import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeOrderFlowComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

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
      imports: [CommonModule, RouterTestingModule],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ]
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

  it('renders the approved heading and seven independent ecosystem islands', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appz-ecosystem__eyebrow')?.textContent?.trim())
      .toBe('CONNECTED APPZPOS ECOSYSTEM');
    expect(host.querySelector('h2')?.textContent?.trim()).toBe('Everything Works Together');
    expect(host.querySelector('.appz-ecosystem__intro')?.textContent?.trim()).toBe(
      'From order to kitchen, pickup, delivery and management — connect the APPZPOS modules that fit your business.'
    );
    expect(host.querySelectorAll('[data-ecosystem-island]').length).toBe(7);
    expect(host.querySelectorAll('[data-ecosystem-island] img').length).toBe(7);
    expect(host.querySelectorAll('[data-ecosystem-connection]').length).toBe(7);
    expect(host.querySelector('[data-ecosystem-hub] img')?.getAttribute('src'))
      .toBe('assets/images/ecosystem/ecosystem-hub.webp');
    expect(host.querySelector('.appz-ecosystem__connections')?.textContent?.trim()).toBe('');
  });

  it('shows the approved APPZPOS brand inside the central cloud hub', () => {
    fixture.detectChanges();
    const logo = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLImageElement>('[data-ecosystem-hub-logo]');

    expect(logo).not.toBeNull();
    expect(logo?.getAttribute('src')).toBe(
      'https://appzpos.com/admin/Upload/0771BB36-9631-40F2-A204-C60247E9F1E1/Images/APPZPOS-300X150px.png'
    );
  });

  it('uses the existing APPZPOS route for each of the seven islands', () => {
    fixture.detectChanges();
    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('[data-ecosystem-island]')
    ).map((item) => item.dataset['route']);

    expect(hrefs).toEqual([
      '/cloud-pos-point-of-sales-system',
      '/f&b-restaurant-emenu-qr-code-ordering-system',
      '/f&b-restaurant-kitchen-display-system',
      '/self-order-kiosk-restaurant',
      '/f&b-restaurant-queue-number-display-system',
      '/f&b-restaurant-online-ordering-website',
      '/f&b-restaurant-delivery-integration'
    ]);
  });

  it('places the seven matching module summaries beside their related islands', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const moduleCallouts = Array.from(host.querySelectorAll<HTMLElement>('[data-island-module]'));

    expect(moduleCallouts.map((callout) => callout.querySelector('strong')?.textContent?.trim())).toEqual([
      'POS / E-Waiter',
      'Table QR Ordering',
      'Kitchen Display System (KDS)',
      'Self Ordering Kiosk',
      'Queue Number Display',
      'Website Ordering',
      'Order Hub'
    ]);
    expect(host.querySelectorAll('[data-island-id="kiosk"] [data-island-module]').length).toBe(1);
    expect(host.querySelectorAll('[data-island-id="queue"] [data-island-module]').length).toBe(1);
    expect(host.textContent).toContain('Cloud Based POS system - Access your data anywhere');
    expect(host.textContent).toContain('Order Tracking - Receive real-time updates for new orders, modifications, or cancellations');
    expect(host.textContent).toContain('Centralized Order Management - Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform');
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

  it('keeps the dining content visible in a persistent rail beside the island diagram', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const layout = host.querySelector<HTMLElement>('[data-ecosystem-layout]');
    const stage = host.querySelector<HTMLElement>('.appz-ecosystem__stage');
    const details = host.querySelector<HTMLElement>('[data-island-details]');

    expect(fixture.componentInstance.activeDetailsIslandId).toBe('dining');
    expect(layout).not.toBeNull();
    expect(stage?.parentElement).toBe(layout);
    expect(details?.parentElement).toBe(layout);
    expect(details?.classList).toContain('appz-ecosystem__details--dining');
    expect(details?.querySelector('[data-details-close]')).toBeNull();
    expect(details?.querySelector('h3')?.textContent?.trim()).toBe('Table QR Ordering');
    expect(details?.querySelectorAll('[data-details-feature]').length).toBe(6);
  });

  it('updates the persistent content rail with complete matching copy when an island is clicked', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const kitchenIsland = host.querySelector<HTMLElement>('[data-island-id="kitchen"]')!;

    kitchenIsland.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const details = host.querySelector<HTMLElement>('[data-island-details]');
    expect(details).not.toBeNull();
    expect(details?.parentElement?.hasAttribute('data-ecosystem-layout')).toBeTrue();
    expect(details?.classList).toContain('appz-ecosystem__details--kitchen');
    expect(details?.getAttribute('aria-live')).toBe('polite');
    expect(details?.getAttribute('role')).not.toBe('dialog');
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(details?.querySelector('h3')?.textContent?.trim()).toBe('Kitchen Display System (KDS)');
    expect(details?.querySelectorAll('[data-details-feature]').length).toBe(6);
    expect(details?.textContent).toContain('Error Reduction - Minimize order errors');
    expect(details?.querySelector<HTMLAnchorElement>('[data-details-learn-more]')?.getAttribute('href'))
      .toBe('/f&b-restaurant-kitchen-display-system');
    expect(details?.querySelector('[data-details-close]')).toBeNull();
  });

  it('shows Self Ordering Kiosk and Queue Number Display as separate island details', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    host.querySelector<HTMLElement>('[data-island-id="kiosk"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    let details = host.querySelector<HTMLElement>('[data-island-details]');
    expect(details?.querySelectorAll('h3').length).toBe(1);
    expect(details?.querySelector('h3')?.textContent?.trim()).toBe('Self Ordering Kiosk');
    expect(details?.querySelectorAll('[data-details-feature]').length).toBe(8);
    expect(details?.querySelector<HTMLAnchorElement>('[data-details-learn-more]')?.getAttribute('href'))
      .toBe('/self-order-kiosk-restaurant');

    host.querySelector<HTMLElement>('[data-island-id="queue"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    details = host.querySelector<HTMLElement>('[data-island-details]');
    expect(details?.querySelectorAll('h3').length).toBe(1);
    expect(details?.querySelector('h3')?.textContent?.trim()).toBe('Queue Number Display');
    expect(details?.querySelectorAll('[data-details-feature]').length).toBe(4);
    expect(details?.querySelector<HTMLAnchorElement>('[data-details-learn-more]')?.getAttribute('href'))
      .toBe('/f&b-restaurant-queue-number-display-system');
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
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('[data-ecosystem-island]').length).toBe(7);
  });

  it('removes the duplicated category explorer while preserving all module content for island details', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const component = fixture.componentInstance;

    expect(host.querySelectorAll('[data-module-tab]').length).toBe(0);
    expect(host.querySelectorAll('[data-module-panel]').length).toBe(0);
    expect(component.productModules.length).toBe(7);
    expect(component.productModules.reduce((total, module) => total + module.features.length, 0)).toBe(46);
    expect(component.productModules.map((module) => module.route)).toEqual([
      '/cloud-pos-point-of-sales-system',
      '/f&b-restaurant-online-ordering-website',
      '/f&b-restaurant-emenu-qr-code-ordering-system',
      '/self-order-kiosk-restaurant',
      '/f&b-restaurant-queue-number-display-system',
      '/f&b-restaurant-kitchen-display-system',
      '/f&b-restaurant-delivery-integration'
    ]);
  });
});
