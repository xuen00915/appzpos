import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Shared solution layout. Project existing route content without recreating
 * forms, links or tracking hooks.
 */
@Component({
  selector: 'app-solution-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[solutionHero]"></ng-content>
    <section id="content">
      <div class="content-wrap solution-page__sections">
        <ng-content></ng-content>
      </div>
    </section>
    <ng-content select="[solutionFloating]"></ng-content>
  `
})
export class SolutionPageComponent {}

@Component({
  selector: 'app-solution-feature-heading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }'],
  template: `<div class="pos-feature-section__header" data-pos-feature-heading>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>`
})
export class SolutionFeatureHeadingComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
}

/** Filter projected hardware without rebuilding product links or tracking hooks. */
@Component({
  selector: 'app-solution-hardware-filters',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }'],
  template: `
    <ng-container *ngIf="productCount > 5">
      <ng-container *ngIf="existingControls; else sharedControls"><ng-content></ng-content></ng-container>
      <ng-template #sharedControls>
        <div class="pos-hardware__filters" aria-label="Filter POS hardware" data-hardware-filters>
          <div class="pos-hardware__categories" role="group" aria-label="Hardware category">
            <button *ngFor="let option of categories" type="button"
              [class.is-active]="category === option" [attr.aria-pressed]="category === option"
              (click)="selectCategory(option)">{{ option }}</button>
          </div>
          <label *ngIf="sizes.length" class="pos-hardware__size">Filter by
            <select aria-label="Filter hardware by size" [value]="size" (change)="selectSize($event)">
              <option value="all">All</option>
              <option *ngFor="let option of sizes" [value]="option">{{ option }} inch</option>
            </select>
          </label>
        </div>
        <p *ngIf="visibleCount === 0" role="status">No products match these filters.</p>
      </ng-template>
    </ng-container>`
})
export class SolutionHardwareFiltersComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) grid!: HTMLElement;
  @Input() existingControls = false;
  productCount = 0;
  visibleCount = 0;
  categories: string[] = ['All'];
  sizes: string[] = [];
  category = 'All';
  size = 'all';
  private products: { element: HTMLElement; category: string; sizes: string[] }[] = [];
  private observer?: MutationObserver;
  private destroyed = false;

  constructor(private renderer: Renderer2, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      if (this.destroyed) return;
      this.readProducts();
      this.observer = new MutationObserver(() => this.readProducts());
      this.observer.observe(this.grid, { childList: true });
    });
  }

  private readProducts(): void {
    this.products = Array.from(this.grid.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el.matches('a')).map(element => {
      const label = element.querySelector('h4')?.textContent || '';
      const category = element.dataset['hardwareCategory'] ||
        (/countertop/i.test(label) ? 'Countertop' : /wallmount/i.test(label) ? 'Wallmount' :
          /stand kiosk/i.test(label) ? 'Stand' : /printer/i.test(label) ? 'Printers' :
            /kiosk/i.test(label) ? 'Kiosks' : /POS/i.test(label) ? 'POS Machines' : 'Accessories');
      const sizes = element.dataset['hardwareSizes']?.split(' ') ||
        Array.from(label.matchAll(/(\d+(?:\.\d+)?)\s*[”"″]/g), match => match[1]);
      return { element, category, sizes };
    });
    this.productCount = this.products.length;
    this.categories = ['All', ...new Set(this.products.map(product => product.category))];
    this.sizes = [...new Set(this.products.flatMap(product => product.sizes))].sort((a, b) => Number(a) - Number(b));
    if (!this.categories.includes(this.category)) this.category = 'All';
    if (!this.sizes.includes(this.size)) this.size = 'all';
    this.applyFilter();
    this.changeDetector.markForCheck();
  }

  selectCategory(category: string): void { this.category = category; this.applyFilter(); }
  selectSize(event: Event): void { this.size = (event.target as HTMLSelectElement).value; this.applyFilter(); }

  private applyFilter(): void {
    if (this.existingControls) return;
    this.visibleCount = 0;
    for (const product of this.products) {
      const visible = this.productCount <= 5 ||
        ((this.category === 'All' || product.category === this.category) &&
          (this.size === 'all' || product.sizes.includes(this.size)));
      if (visible) this.visibleCount++;
      this.renderer[visible ? 'removeClass' : 'addClass'](product.element, 'is-hardware-filtered');
    }
  }

  ngOnDestroy(): void { this.destroyed = true; this.observer?.disconnect(); }
}
