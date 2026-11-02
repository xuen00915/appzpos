import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solution-banner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./solution-banner.component.css'],
  template: `
    <section class="product-banner" data-solution-hero [attr.aria-labelledby]="headingId">
      <div class="product-banner__inner">
        <div class="product-banner__copy">
          <h1 [id]="headingId">{{ title }}</h1>
          <p>{{ description }}</p>
          <div class="product-banner__actions">
            <button type="button" class="product-banner__demo" (click)="requestDemo()">
              Request a demo
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>
            </button>
            <a [attr.href]="exploreTarget.startsWith('#') ? exploreTarget : '#content'" (click)="explore($event)">
              {{ exploreLabel }}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6"/></svg>
            </a>
          </div>
        </div>
        <figure class="product-banner__stage">
          <img [src]="imageSrc" [alt]="imageAlt" [width]="imageWidth" [height]="imageHeight" loading="eager" fetchpriority="high">
          <figcaption>
            <ul aria-label="Solution highlights"><li *ngFor="let highlight of highlights">{{ highlight }}</li></ul>
          </figcaption>
        </figure>
      </div>
    </section>`
})
export class SolutionBannerComponent {
  @Input({ required: true }) headingId = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input({ required: true }) imageSrc = '';
  @Input({ required: true }) imageAlt = '';
  @Input() imageWidth = 1446;
  @Input() imageHeight = 1088;
  @Input() highlights: readonly string[] = [];
  @Input() exploreTarget = '.pos-feature-section';
  @Input() exploreLabel = 'Explore features';
  @Input() demoMode: 'scroll' | 'dialog' = 'scroll';
  @Output() demoRequested = new EventEmitter<void>();

  constructor(private readonly element: ElementRef<HTMLElement>) {}

  requestDemo(): void {
    if (this.demoMode === 'dialog') this.demoRequested.emit();
    else this.scrollTo('#requestdemo');
  }

  explore(event: MouseEvent): void {
    if (this.scrollTo(this.exploreTarget)) event.preventDefault();
  }

  private scrollTo(selector: string): boolean {
    const target = this.element.nativeElement.ownerDocument.querySelector<HTMLElement>(selector);
    if (!target) return false;
    const reduced = target.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    return true;
  }
}
