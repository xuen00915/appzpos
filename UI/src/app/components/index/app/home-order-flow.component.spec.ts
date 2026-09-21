import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeOrderFlowComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component';

describe('HomeOrderFlowComponent ecosystem', () => {
  let fixture: ComponentFixture<HomeOrderFlowComponent>;
  let originalMatchMedia: typeof window.matchMedia;
  let originalIntersectionObserver: typeof window.IntersectionObserver;

  class IntersectionObserverDouble implements IntersectionObserver {
    static latest?: IntersectionObserverDouble;
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds = [0];

    constructor(private readonly callback: IntersectionObserverCallback) {
      IntersectionObserverDouble.latest = this;
    }

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] { return []; }

    trigger(isIntersecting: boolean): void {
      this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
    }
  }

  const setMotionAndPointer = (reducedMotion: boolean, coarsePointer = false) => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? reducedMotion : coarsePointer,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true
    })) as typeof window.matchMedia;
  };

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalIntersectionObserver = window.IntersectionObserver;
    setMotionAndPointer(false);
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: IntersectionObserverDouble
    });

    TestBed.configureTestingModule({
      declarations: [HomeOrderFlowComponent],
      imports: [CommonModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
  });

  afterEach(() => {
    fixture.destroy();
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: originalIntersectionObserver
    });
  });

  it('renders the approved heading and six independent ecosystem islands', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appz-ecosystem__eyebrow')?.textContent?.trim())
      .toBe('CONNECTED APPZPOS ECOSYSTEM');
    expect(host.querySelector('h2')?.textContent?.trim()).toBe('Everything Works Together');
    expect(host.querySelector('.appz-ecosystem__intro')?.textContent?.trim()).toBe(
      'From order to kitchen, pickup, delivery and management — connect the APPZPOS modules that fit your business.'
    );
    expect(host.querySelectorAll('[data-ecosystem-island]').length).toBe(6);
    expect(host.querySelectorAll('[data-ecosystem-island] img').length).toBe(6);
    expect(host.querySelectorAll('[data-ecosystem-connection]').length).toBe(5);
    expect(host.querySelector('.appz-ecosystem__connections')?.textContent?.trim()).toBe('');
  });

  it('uses only existing APPZPOS routes for the six islands', () => {
    fixture.detectChanges();
    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('[data-ecosystem-island]')
    ).map((item) => item.getAttribute('href'));

    expect(hrefs).toEqual([
      '/cloud-pos-point-of-sales-system',
      '/f&b-restaurant-emenu-qr-code-ordering-system',
      '/f&b-restaurant-kitchen-display-system',
      '/custom-solutions',
      '/f&b-restaurant-online-ordering-website',
      '/f&b-restaurant-delivery-integration'
    ]);
  });

  it('activates one island and clears it without changing routes', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.setActiveIsland('kitchen');
    fixture.detectChanges();
    expect(component.activeIslandId).toBe('kitchen');
    expect((fixture.nativeElement as HTMLElement)
      .querySelector('[data-island-id="kitchen"]')?.classList.contains('is-active')).toBeTrue();

    component.clearActiveIsland();
    fixture.detectChanges();
    expect(component.activeIslandId).toBeNull();
  });

  it('reveals the scene when it enters the viewport', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.isVisible).toBeFalse();
    IntersectionObserverDouble.latest?.trigger(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.isVisible).toBeTrue();
  });

  it('limits pointer parallax to five pixels and resets on leave', () => {
    fixture.detectChanges();
    const stage = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.appz-ecosystem__stage')!;
    spyOn(stage, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 1000,
      height: 600
    } as DOMRect);
    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    fixture.componentInstance.handlePointerMove(new PointerEvent('pointermove', {
      clientX: 1000,
      clientY: 600
    }));

    const deepest = stage.querySelector<HTMLElement>('[data-depth="1"]')!;
    expect(deepest.style.getPropertyValue('--pointer-x')).toBe('5px');
    expect(deepest.style.getPropertyValue('--pointer-y')).toBe('5px');

    fixture.componentInstance.resetPointerParallax();
    expect(deepest.style.getPropertyValue('--pointer-x')).toBe('0px');
    expect(deepest.style.getPropertyValue('--pointer-y')).toBe('0px');
  });

  it('keeps the ecosystem visible and motionless for reduced-motion users', () => {
    fixture.destroy();
    setMotionAndPointer(true);
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.reducedMotion).toBeTrue();
    expect(fixture.componentInstance.isVisible).toBeTrue();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('[data-ecosystem-island]').length).toBe(6);
  });
});
