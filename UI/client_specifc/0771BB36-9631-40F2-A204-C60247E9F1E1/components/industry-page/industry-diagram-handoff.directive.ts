import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, NgZone, OnDestroy } from '@angular/core';

@Directive({ selector: '[appIndustryDiagramHandoff]', standalone: true })
export class IndustryDiagramHandoffDirective implements AfterViewInit, OnDestroy {
  private view?: Window;
  private compact?: MediaQueryList;
  private reduced?: MediaQueryList;
  private overview?: HTMLElement;
  private overviewCopy?: HTMLElement;
  private restaurantSection?: HTMLElement;
  private source?: HTMLElement;
  private target?: HTMLElement;
  private quickSection?: HTMLElement;
  private sourceCopy?: HTMLElement;
  private targetCopy?: HTMLElement;
  private overlay?: HTMLDivElement;
  private picture?: HTMLImageElement;
  private frame = 0;
  private destroyed = false;
  private saved = new Map<HTMLElement, Map<string, string>>();

  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    const view = this.document.defaultView;
    if (!view) return;
    this.view = view;
    const root = this.host.nativeElement;
    this.overview = root.querySelector<HTMLElement>('.restaurant-overview__visual') || undefined;
    this.overviewCopy = root.querySelector<HTMLElement>('.restaurant-scroll__intro h2') || undefined;
    this.restaurantSection = root.querySelector<HTMLElement>('.restaurant-scroll__mode') || undefined;
    this.source = root.querySelector<HTMLElement>('.restaurant-scroll__diagram') || undefined;
    this.target = root.querySelector<HTMLElement>('.quick-service-diagram') || undefined;
    this.quickSection = root.querySelector<HTMLElement>('.quick-service-desktop') || undefined;
    this.sourceCopy = root.querySelector<HTMLElement>('.restaurant-mode__timeline') || undefined;
    this.targetCopy = root.querySelector<HTMLElement>('.quick-service-timeline') || undefined;
    if (!this.source || !this.target || !this.quickSection) return;
    this.compact = view.matchMedia('(max-width: 991px), (max-width: 1366px) and (pointer: coarse)');
    this.reduced = view.matchMedia('(prefers-reduced-motion: reduce)');
    this.zone.runOutsideAngular(() => {
      view.addEventListener('scroll', this.schedule, { passive: true });
      view.addEventListener('resize', this.schedule);
      root.addEventListener('load', this.schedule, true);
      root.addEventListener('focusin', this.schedule);
      root.addEventListener('focusout', this.schedule);
      this.compact?.addEventListener('change', this.schedule);
      this.reduced?.addEventListener('change', this.schedule);
      this.schedule();
    });
  }

  private schedule = (): void => {
    if (!this.view || this.frame || this.destroyed) return;
    this.frame = this.view.requestAnimationFrame(() => { this.frame = 0; this.paint(); });
  };

  private paint(): void {
    if (!this.view || !this.source || !this.target || !this.quickSection) return;
    // Do not animate away controls that someone is currently using with a keyboard.
    const focused = this.document.activeElement;
    if (this.compact?.matches || this.reduced?.matches ||
        (focused && [this.overview, this.overviewCopy, this.source, this.target, this.sourceCopy, this.targetCopy].some(node => node?.contains(focused)))) {
      this.restore();
      return;
    }
    const introProgress = this.overview && this.restaurantSection ? this.progress(this.restaurantSection) : 1;
    const enteringRestaurant = introProgress < 1;
    const source = enteringRestaurant ? this.overview! : this.source;
    const target = enteringRestaurant ? this.source : this.target;
    const sourceCopy = enteringRestaurant ? this.overviewCopy : this.sourceCopy;
    const targetCopy = enteringRestaurant ? this.sourceCopy : this.targetCopy;
    const sourceMap = enteringRestaurant ? source : source.querySelector<HTMLElement>('.industry-islands__map');
    const targetMap = target.querySelector<HTMLElement>('.industry-islands__map');
    const image = source.querySelector<HTMLImageElement>('.industry-islands__original, .restaurant-overview__diagram');
    if (!sourceMap || !targetMap || !image) return;
    const from = sourceMap.getBoundingClientRect();
    const to = targetMap.getBoundingClientRect();
    if (!from.width || !to.width) { this.restore(); return; }
    const progress = enteringRestaurant ? introProgress : this.progress(this.quickSection);
    const eased = progress * progress * (3 - 2 * progress);
    const mix = (a: number, b: number) => a + (b - a) * eased;
    const sourceCamera = this.camera(source, from);
    const targetCamera = this.camera(target, to);

    // One coordinator owns both handoffs, so the shared Restaurant diagram never
    // receives competing visibility/opacity updates when scrolling backwards.
    this.set(this.overview, 'visibility', introProgress > 0 ? 'hidden' : 'visible');
    this.set(this.overviewCopy, 'opacity', String(Math.max(0, 1 - introProgress / .25)));
    if (enteringRestaurant) {
      this.set(this.target, 'visibility', 'hidden');
      this.set(this.targetCopy, 'opacity', '0');
    }
    this.set(source, 'visibility', progress > 0 ? 'hidden' : 'visible');
    this.set(target, 'visibility', progress < 1 ? 'hidden' : 'visible');
    this.set(sourceCopy, 'opacity', String(Math.max(0, 1 - progress / .25)));
    this.set(targetCopy, 'opacity', String(Math.max(0, Math.min(1, (progress - .75) / .25))));
    if (progress === 0 || progress === 1) { this.removeOverlay(); return; }

    if (!this.overlay) {
      this.overlay = this.document.createElement('div');
      this.overlay.className = 'industry-diagram-handoff';
      this.overlay.setAttribute('aria-hidden', 'true');
      this.overlay.style.cssText = 'position:fixed;left:0;top:0;width:1000px;height:562.5px;overflow:hidden;pointer-events:none;z-index:20;transform-origin:0 0;';
      this.picture = this.document.createElement('img');
      this.picture.alt = '';
      this.picture.style.cssText = 'display:block;width:100%;height:100%;max-width:none;transform-origin:center;';
      this.overlay.appendChild(this.picture);
      this.document.body.appendChild(this.overlay);
    }
    if (this.picture!.src !== image.src) this.picture!.src = image.src;
    // Fixed base dimensions keep the moving frame compositor-driven (translate/scale only).
    this.overlay.style.transform = `translate3d(${mix(from.left, to.left)}px, ${mix(from.top, to.top)}px, 0) scale(${mix(from.width, to.width) / 1000}, ${mix(from.height, to.height) / 562.5})`;
    this.picture!.style.transform = `matrix(${mix(sourceCamera.a, targetCamera.a)}, 0, 0, ${mix(sourceCamera.d, targetCamera.d)}, ${mix(sourceCamera.x, targetCamera.x) * 1000}, ${mix(sourceCamera.y, targetCamera.y) * 562.5})`;
  }

  private progress(section: HTMLElement): number {
    const start = Math.max(320, this.view!.innerHeight * .85);
    return Math.max(0, Math.min(1, (start - section.getBoundingClientRect().top) / (start - 112)));
  }

  private camera(container: HTMLElement, bounds: DOMRect): { a: number; d: number; x: number; y: number } {
    const artwork = container.querySelector<HTMLElement>('.industry-islands__artwork, .restaurant-overview__diagram');
    const style = artwork && this.view!.getComputedStyle(artwork);
    const transform = style?.transform;
    const matrix = new DOMMatrixReadOnly(transform && transform !== 'none' ? transform : undefined);
    return {
      a: matrix.a * ((parseFloat(style?.width || '') || bounds.width) / bounds.width),
      d: matrix.d * ((parseFloat(style?.height || '') || bounds.height) / bounds.height),
      x: matrix.e / bounds.width, y: matrix.f / bounds.height
    };
  }

  private set(element: HTMLElement | undefined, property: string, value: string): void {
    if (!element) return;
    if (!this.saved.has(element)) this.saved.set(element, new Map());
    const properties = this.saved.get(element)!;
    if (!properties.has(property)) properties.set(property, element.style.getPropertyValue(property));
    element.style.setProperty(property, value);
  }

  private removeOverlay(): void { this.overlay?.remove(); this.overlay = undefined; this.picture = undefined; }

  private restore(): void {
    this.removeOverlay();
    this.saved.forEach((properties, element) => properties.forEach((value, property) => {
      if (value) element.style.setProperty(property, value);
      else element.style.removeProperty(property);
    }));
    this.saved.clear();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.frame) this.view?.cancelAnimationFrame(this.frame);
    this.view?.removeEventListener('scroll', this.schedule);
    this.view?.removeEventListener('resize', this.schedule);
    this.host.nativeElement.removeEventListener('load', this.schedule, true);
    this.host.nativeElement.removeEventListener('focusin', this.schedule);
    this.host.nativeElement.removeEventListener('focusout', this.schedule);
    this.compact?.removeEventListener('change', this.schedule);
    this.reduced?.removeEventListener('change', this.schedule);
    this.restore();
  }
}
