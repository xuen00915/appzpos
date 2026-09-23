import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeOrderFlowComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { ENGLISH_HOME_SOLUTIONS_CONFIG } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-content.en';
import { HomeSolutionsConfig } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.models';

describe('HomeOrderFlowComponent ecosystem', () => {
  let fixture: ComponentFixture<HomeOrderFlowComponent>;
  let originalMatchMedia: typeof window.matchMedia;
  let originalIntersectionObserver: typeof window.IntersectionObserver;

  const chineseSolutions: HomeSolutionsConfig = {
    eyebrow: 'APPZPOS 餐饮生态系统',
    title: '新加坡本地最佳POS系统供应商',
    description: '满足您餐饮业务的一切需求，您的餐厅运营首选',
    initialItemId: 'cn-pos',
    learnMoreLabel: '了解更多',
    items: [
      { id: 'cn-pos', title: '收银机 / 电子点餐', moduleTitle: '收银机 / 电子点餐', summary: '云端POS系统', route: '/cloud-pos-point-of-sales-system', image: '/images/cn-pos.png', imageAlt: '收银机 / 电子点餐', ariaLabel: '收银机 / 电子点餐', features: [{ label: '云端POS系统', description: '随时随地访问数据' }] },
      { id: 'cn-web', title: '网站点餐系统', moduleTitle: '网站点餐系统', summary: '在线点餐', route: '/f&b-restaurant-online-ordering-website', image: '/images/cn-web.png', imageAlt: '网站点餐系统', ariaLabel: '网站点餐系统', features: [{ label: '在线点餐', description: '随时随地轻松点餐' }] },
      { id: 'cn-qr', title: '扫码点餐系统', moduleTitle: '扫码点餐系统', summary: '电子菜单', route: '/f&b-restaurant-emenu-qr-code-ordering-system', image: '/images/cn-qr.png', imageAlt: '扫码点餐系统', ariaLabel: '扫码点餐系统', features: [{ label: '电子菜单', description: '扫描二维码查看菜单' }] },
      { id: 'cn-kiosk', title: '自助点餐机', moduleTitle: '自助点餐机', summary: '无接触点餐', route: '/self-order-kiosk-restaurant', image: '/images/cn-kiosk.png', imageAlt: '自助点餐机', ariaLabel: '自助点餐机', features: [{ label: '无接触点餐', description: '减少等待时间' }] },
      { id: 'cn-queue', title: '排队叫号系统', moduleTitle: '排队叫号系统', summary: '实时叫号', route: '/f&b-restaurant-queue-number-display-system', image: '/images/cn-queue.png', imageAlt: '排队叫号系统', ariaLabel: '排队叫号系统', features: [{ label: '实时叫号', description: '实时更新排队号码' }] },
      { id: 'cn-kds', title: 'KDS厨房系统', moduleTitle: 'KDS厨房系统', summary: '订单追踪', route: '/f&b-restaurant-kitchen-display-system', image: '/images/cn-kds.png', imageAlt: 'KDS厨房系统', ariaLabel: 'KDS厨房系统', features: [{ label: '订单追踪', description: '实时追踪订单状态' }] },
      { id: 'cn-hub', title: '外卖订单中心', moduleTitle: '外卖订单中心', summary: '统一管理', route: '/f&b-restaurant-delivery-integration', image: '/images/cn-hub.png', imageAlt: '外卖订单中心', ariaLabel: '外卖订单中心', features: [{ label: '统一管理', description: '集中管理外卖订单' }] }
    ]
  };

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
    fixture.componentInstance.config = ENGLISH_HOME_SOLUTIONS_CONFIG;
  });

  it('renders exact configured Chinese solutions without English fallback copy', () => {
    fixture.componentInstance.config = chineseSolutions;
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const optionTexts = Array.from(host.querySelectorAll<HTMLElement>('[data-island-module] strong'))
      .map((item) => item.textContent?.trim());

    expect(host.querySelector('.appz-ecosystem__eyebrow')?.textContent?.trim()).toBe('APPZPOS 餐饮生态系统');
    expect(host.querySelector('.appz-ecosystem__heading h2')?.textContent?.trim()).toBe('新加坡本地最佳POS系统供应商');
    expect(optionTexts).toEqual([
      '收银机 / 电子点餐', '网站点餐系统', '扫码点餐系统', '自助点餐机',
      '排队叫号系统', 'KDS厨房系统', '外卖订单中心'
    ]);
    expect(host.textContent).not.toContain('Everything Works Together');
  });

  it('uses configured images, links, accessible controls and Enter-key selection', () => {
    fixture.componentInstance.config = chineseSolutions;
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const qrOption = host.querySelector<HTMLButtonElement>('[data-island-id="cn-qr"]')!;

    expect(qrOption.getAttribute('aria-controls')).toBe('appz-island-details');
    qrOption.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(qrOption.getAttribute('aria-pressed')).toBe('true');
    expect(host.querySelector('.appz-ecosystem__selected-visual img')?.getAttribute('src')).toBe('/images/cn-qr.png');
    expect(host.querySelector('[data-details-learn-more]')?.getAttribute('href')).toBe('/f&b-restaurant-emenu-qr-code-ordering-system');
    expect(host.querySelector('[data-details-learn-more]')?.textContent?.trim()).toBe('了解更多');
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
    expect(host.querySelectorAll('.appz-ecosystem__selected-visual img').length).toBe(1);
    expect(host.querySelectorAll('[data-ecosystem-connection]').length).toBe(0);
    expect(host.querySelector('[data-ecosystem-hub]')).toBeNull();
    expect(host.querySelector('.appz-ecosystem__connections')).toBeNull();
  });

  it('places a solution menu beside a single selected diagram and content panel', () => {
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-ecosystem-hub-logo]')).toBeNull();
    const windowPanel = root.querySelector('.appz-ecosystem__window')!;
    expect(windowPanel.querySelectorAll('.appz-ecosystem__option').length).toBe(7);
    expect(windowPanel.querySelector('.appz-ecosystem__options')?.nextElementSibling?.classList.contains('appz-ecosystem__copy')).toBeTrue();
    expect(windowPanel.querySelectorAll('.appz-ecosystem__selected-visual img').length).toBe(1);
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

  it('updates the selected image and light orange menu option when clicked', () => {
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const option = root.querySelector<HTMLButtonElement>('[data-island-id="kitchen"]')!;
    option.click();
    fixture.detectChanges();
    expect(option.getAttribute('aria-pressed')).toBe('true');
    expect(option.classList).toContain('is-active');
    expect(root.querySelector('.appz-ecosystem__selected-visual img')?.getAttribute('src')).toBe(fixture.componentInstance.activeDetailsIsland!.image);
    expect(root.querySelector('.appz-ecosystem__selected-visual img')?.getAttribute('alt')).toBe('Kitchen Display System (KDS)');
    expect(root.querySelector('[data-island-id="dining"]')?.getAttribute('aria-pressed')).toBe('false');
  });


  it('places only the seven matching module names beside their related islands', () => {
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
    expect(host.querySelectorAll('[data-island-module] small').length).toBe(0);
    expect(host.querySelectorAll('[data-island-id="kiosk"] [data-island-module]').length).toBe(1);
    expect(host.querySelectorAll('[data-island-id="queue"] [data-island-module]').length).toBe(1);
  });

  it('keeps the dedicated POS and QR diagrams', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.islands.find(island => island.id === 'admin')?.image).toBe('assets/images/ecosystem/ecosystem-dining.webp');
    expect(fixture.componentInstance.islands.find(island => island.id === 'dining')?.image).toBe('assets/images/ecosystem/ecosystem-table-qr.webp');
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
    const stage = host.querySelector<HTMLElement>('.appz-ecosystem__options');
    const details = host.querySelector<HTMLElement>('[data-island-details]');

    expect(fixture.componentInstance.activeDetailsIslandId).toBe('dining');
    expect(layout).not.toBeNull();
    expect(stage?.parentElement).toBe(layout);
    const copy = host.querySelector<HTMLElement>('.appz-ecosystem__copy');
    expect(details?.parentElement).toBe(copy);
    expect(copy?.parentElement).toBe(layout);
    expect(copy?.querySelector('.appz-ecosystem__heading')).toBeNull();
    const heading = host.querySelector<HTMLElement>('.appz-ecosystem__heading')!;
    expect(heading.nextElementSibling).toBe(layout);
    expect(stage?.nextElementSibling).toBe(copy);
    expect(details?.classList).toContain('appz-ecosystem__details--dining');
    expect(details?.querySelector('[data-details-close]')).toBeNull();
    expect(details?.querySelector('h2')?.textContent?.trim()).toBe('Table QR Ordering');
    expect(details?.textContent).not.toContain('Explore the connected modules');
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
    expect(details?.parentElement?.classList.contains('appz-ecosystem__copy')).toBeTrue();
    expect(details?.classList).toContain('appz-ecosystem__details--kitchen');
    expect(details?.getAttribute('aria-live')).toBe('polite');
    expect(details?.getAttribute('role')).not.toBe('dialog');
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(details?.querySelector('h2')?.textContent?.trim()).toBe('Kitchen Display System (KDS)');
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
    expect(details?.querySelectorAll('h3').length).toBe(0);
    expect(details?.querySelector('h2')?.textContent?.trim()).toBe('Self Ordering Kiosk');
    expect(details?.querySelectorAll('[data-details-feature]').length).toBe(8);
    expect(details?.querySelector<HTMLAnchorElement>('[data-details-learn-more]')?.getAttribute('href'))
      .toBe('/self-order-kiosk-restaurant');

    host.querySelector<HTMLElement>('[data-island-id="queue"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    details = host.querySelector<HTMLElement>('[data-island-details]');
    expect(details?.querySelectorAll('h3').length).toBe(0);
    expect(details?.querySelector('h2')?.textContent?.trim()).toBe('Queue Number Display');
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

  it('keeps the responsive window in menu-then-content DOM order', () => {
    fixture.detectChanges();
    const panel = (fixture.nativeElement as HTMLElement).querySelector('.appz-ecosystem__window')!;
    const menu = panel.querySelector('.appz-ecosystem__options')!;
    const copy = panel.querySelector('.appz-ecosystem__copy')!;
    expect(menu.nextElementSibling).toBe(copy);
  });

  it('keeps the ecosystem visible and motionless for reduced-motion users', () => {
    fixture.destroy();
    setMotionAndPointer(true);
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
    fixture.componentInstance.config = ENGLISH_HOME_SOLUTIONS_CONFIG;
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
