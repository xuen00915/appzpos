import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, HostListener, NgZone, OnDestroy } from '@angular/core';

/** Shared, progressively enhanced workflow; copy stays visible without motion. */
@Directive({ selector: '[appIndustryWorkflow]', standalone: true, exportAs: 'industryWorkflow' })
export class IndustryWorkflowDirective implements AfterViewInit, OnDestroy {
  activeStep = 0;
  active = false;
  compact = false;
  private frame = 0;
  private readonly media = window.matchMedia('(max-width: 991px), (max-width: 1366px) and (pointer: coarse)');
  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone, private change: ChangeDetectorRef) {}
  ngAfterViewInit(): void { this.schedule(); }
  @HostListener('window:scroll')
  @HostListener('window:resize')
  schedule(): void {
    if (this.frame) return;
    this.zone.runOutsideAngular(() => { this.frame = requestAnimationFrame(() => { this.frame = 0; this.update(); }); });
  }
  private update(): void {
    const bounds = this.host.nativeElement.getBoundingClientRect();
    const compact = this.media.matches;
    const active = bounds.top < innerHeight * .65 && bounds.bottom > 140;
    const items = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.restaurant-procedure'));
    let index = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top <= innerHeight * .4) index = i;
    }
    if (compact !== this.compact || active !== this.active || index !== this.activeStep) {
      this.zone.run(() => { this.compact = compact; this.active = active; this.activeStep = index; this.change.markForCheck(); });
    }
  }
  goTo(event: Event, index: number): void {
    event.preventDefault();
    this.activeStep = index;
    this.active = true;
    const item = this.host.nativeElement.querySelectorAll<HTMLElement>('.restaurant-procedure')[index];
    item?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  ngOnDestroy(): void { cancelAnimationFrame(this.frame); }
}
