import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOrderFlowComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component';

describe('HomeOrderFlowComponent', () => {
  let fixture: ComponentFixture<HomeOrderFlowComponent>;
  let originalMatchMedia: typeof window.matchMedia;
  let originalIntersectionObserver: typeof window.IntersectionObserver;
  let originalResizeObserver: typeof window.ResizeObserver;

  class IntersectionObserverDouble implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds = [0];
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] { return []; }

    trigger(isIntersecting: boolean): void {
      this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
    }
  }

  class ResizeObserverDouble implements ResizeObserver {
    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}

    trigger(height: number): void {
      this.callback([{ contentRect: { height } } as ResizeObserverEntry], this);
    }
  }

  const setReducedMotion = (matches: boolean) => {
    window.matchMedia = (() => ({
      matches,
      media: '(prefers-reduced-motion: reduce)',
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
    originalResizeObserver = window.ResizeObserver;
    setReducedMotion(false);
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: IntersectionObserverDouble
    });
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: ResizeObserverDouble
    });
    TestBed.configureTestingModule({
      declarations: [HomeOrderFlowComponent],
      imports: [CommonModule]
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
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: originalResizeObserver
    });
  });

  it('renders seven indicators and the converging SVG scene', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.appzpos-order-flow__step').length).toBe(7);
    expect(host.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 1000 460');
    expect(host.querySelectorAll('[data-entry-route]').length).toBe(4);
    expect(host.querySelectorAll('[data-entry-figure]').length).toBe(4);
    expect(host.querySelector('[data-merged-figure]')).not.toBeNull();
    expect(host.querySelector('[data-delivery-figure]')).not.toBeNull();
  });

  it('switches the scene and caption when a numbered step is clicked', () => {
    fixture.detectChanges();
    const scrollTo = spyOn(window, 'scrollTo');
    const host = fixture.nativeElement as HTMLElement;
    const stepButtons = host.querySelectorAll<HTMLButtonElement>('.appzpos-order-flow__step-button');

    expect(stepButtons.length).toBe(7);
    stepButtons[5].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeStepIndex).toBe(5);
    expect(host.querySelector('.appzpos-order-flow__caption h3')?.textContent?.trim())
      .toBe('Kitchen Display System (KDS)');
    expect(scrollTo.calls.mostRecent().args[0] as unknown as ScrollToOptions)
      .toEqual(jasmine.objectContaining({ behavior: 'smooth' }));
  });

  it('skips to the existing homepage content with fixed-header clearance', () => {
    fixture.detectChanges();
    const scrollTo = spyOn(window, 'scrollTo');
    const content = document.createElement('section');
    content.id = 'content';
    spyOn(content, 'getBoundingClientRect').and.returnValue({ top: 240 } as DOMRect);
    document.body.appendChild(content);
    fixture.componentInstance['setHeaderHeight'](72);

    const skipButton = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.appzpos-order-flow__skip');
    expect(skipButton).not.toBeNull();
    skipButton?.click();

    expect(scrollTo.calls.mostRecent().args[0] as unknown as ScrollToOptions).toEqual({
      top: window.scrollY + 240 - 72,
      behavior: 'smooth'
    });
    content.remove();
  });

  it('shows the current title and exact bullets in the caption', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appzpos-order-flow__caption h3')?.textContent?.trim())
      .toBe('Table QR Ordering');
    expect(Array.from(host.querySelectorAll('.appzpos-order-flow__caption li'))
      .map((item) => item.textContent?.trim())).toEqual([
        'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones',
        'Cost Savings - Reduce Printed Menu & dependence on manpower',
        'Online Payment - Multiple integrated payment options for customer to pay securely through mobile'
      ]);
  });

  it('renders only the complete static list when reduced motion is requested', () => {
    fixture.destroy();
    setReducedMotion(true);
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appzpos-order-flow__scroll')).toBeNull();
    expect(host.querySelectorAll('.appzpos-order-flow__static-step').length).toBe(7);
    expect(host.textContent).toContain(
      'Real-time Overview Report - Easily monitor all your delivery, online and in-store orders in one POS system'
    );
  });

  it('maps a measured wrapper position to clamped scroll progress', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.calculateProgress({ top: 0, height: 7600 } as DOMRect, 900)).toBe(0);
    expect(component.calculateProgress({ top: -3350, height: 7600 } as DOMRect, 900)).toBeCloseTo(.5, 5);
    expect(component.calculateProgress({ top: -9000, height: 7600 } as DOMRect, 900)).toBe(1);
    expect(component.calculateProgress({ top: -10, height: 900 } as DOMRect, 900)).toBe(0);
  });

  it('changes Angular caption state only when a breakpoint is crossed', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.renderProgress(.099);
    expect(component.activeStepIndex).toBe(0);
    component.renderProgress(.10);
    expect(component.activeStepIndex).toBe(1);
    component.renderProgress(.75);
    expect(component.activeStepIndex).toBe(6);
  });

  it('disconnects observers and cancels its frame when destroyed', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const disconnectIntersection = spyOn(component['intersectionObserver']!, 'disconnect');
    const disconnectResize = spyOn(component['resizeObserver']!, 'disconnect');
    const cancelFrame = spyOn(window, 'cancelAnimationFrame');
    component['animationFrameId'] = 42;
    fixture.destroy();
    expect(disconnectIntersection).toHaveBeenCalled();
    expect(disconnectResize).toHaveBeenCalled();
    expect(cancelFrame).toHaveBeenCalledWith(42);
  });

  it('starts only one frame loop and stops it when the section leaves view', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const requestFrame = spyOn(window, 'requestAnimationFrame').and.returnValue(17);
    component['handleIntersection'](true);
    component['handleIntersection'](true);
    expect(requestFrame).toHaveBeenCalledTimes(1);
    component['handleIntersection'](false);
    expect(component['frameRunning']).toBeFalse();
  });

  it('updates the sticky offset when the fixed header changes height', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component['setHeaderHeight'](84);
    expect((fixture.nativeElement as HTMLElement).style
      .getPropertyValue('--appzpos-order-flow-nav-height')).toBe('84px');
  });

  it('falls back to the static list when required observer APIs are unavailable', () => {
    Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined });
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: undefined });
    fixture.destroy();
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.reducedMotion).toBeTrue();
    expect((fixture.nativeElement as HTMLElement)
      .querySelectorAll('.appzpos-order-flow__static-step').length).toBe(7);
  });
});
