import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({ selector: '[appMarketingReveal]' })
export class MarketingRevealDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const reducedMotion = typeof window === 'undefined'
      || typeof window.matchMedia !== 'function'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof window.IntersectionObserver !== 'function') {
      this.elementRef.nativeElement.classList.add('is-revealed');
      return;
    }

    this.observer = new window.IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      this.elementRef.nativeElement.classList.add('is-revealed');
      this.observer?.disconnect();
    }, { threshold: .15 });
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
