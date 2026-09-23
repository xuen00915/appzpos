import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HomeHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component';
import { HomeHeroConfig } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.models';

describe('HomeHeroComponent', () => {
  let fixture: ComponentFixture<HomeHeroComponent>;
  let component: HomeHeroComponent;

  const englishHero: HomeHeroConfig = {
    headingId: 'home-title',
    title: 'All-In-One POS System',
    titleAccent: 'in Singapore with PSG Grant',
    description: 'Transform your F&B, Retail, & Salon Businesses with APPZPOS Cutting-Edge Point of Sales Software',
    industryTabLabel: 'Preview APPZPOS by business type',
    industryStatusPrefix: 'Showing APPZPOS for',
    visual: {
      kind: 'product-showcase',
      hardwareImage: 'assets/images/appzpos-pos-terminal-hardware-only.png',
      hardwareAlt: 'APPZPOS touchscreen POS terminal with receipt printer',
      hardwareWidth: 1672,
      hardwareHeight: 941,
      brandImage: 'https://appzpos.com/logo.png',
      industries: [
        {
          id: 'quick-service', label: 'Quick Service', eyebrow: 'F&B QUICK SERVICE',
          workspaceTitle: 'Counter & pickup orders', screenImage: 'assets/images/quick.png',
          modules: ['POS System', 'Website Ordering']
        },
        {
          id: 'restaurant', label: 'Restaurant', eyebrow: 'F&B RESTAURANT',
          workspaceTitle: 'Table & kitchen orders', screenImage: 'assets/images/restaurant.png',
          modules: ['POS System', 'Table QR Ordering']
        }
      ]
    },
    ctas: [
      { kind: 'action', action: 'request-demo', label: 'Request a Demo' },
      {
        kind: 'link', label: 'WhatsApp Us',
        href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
        target: '_blank', rel: 'noopener noreferrer'
      }
    ]
  };

  const chineseHero: HomeHeroConfig = {
    headingId: 'cn-home-title',
    title: 'APPZPOS POS系统云端智能POS餐饮系统高达50%政府津贴折扣',
    description: '专为餐饮业者设计的全方位餐饮系统，包括收银系统、销售报告分析、会员管理、库存管理、促销优惠，运营流程等',
    visual: {
      kind: 'responsive-image',
      desktopSrc: '/images/APPZPOS-Pos-Best-Point-of-Sales-System-Banner.png',
      mobileSrc: '/images/APPZPOS-Pos-Best-Point-of-Sales-System-Banner-mobile.png',
      alt: 'APPZPOS POS系统',
      width: 1600,
      height: 900
    },
    ctas: [
      { kind: 'action', action: 'request-demo', label: '预约免费演示' },
      {
        kind: 'link', label: 'WhatsApp联系我们',
        href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
        target: '_blank', rel: 'noopener noreferrer'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [HomeHeroComponent]
    });
    fixture = TestBed.createComponent(HomeHeroComponent);
    component = fixture.componentInstance;
  });

  it('renders the configured product showcase with keyboard-accessible industry tabs', () => {
    component.config = englishHero;
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('h1').length).toBe(1);
    expect(host.querySelector('h1')?.textContent).toContain('All-In-One POS System');
    expect(host.textContent).toContain(englishHero.description);
    expect(host.querySelector('[data-industry="quick-service"]')).not.toBeNull();
    const tabs = host.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs.length).toBe(2);
    expect(tabs[0].type).toBe('button');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(host.querySelector('[role="tabpanel"]')?.getAttribute('data-industry')).toBe('quick-service');
  });

  it('changes industry after the existing transition and stops autoplay after manual selection', fakeAsync(() => {
    component.config = englishHero;
    fixture.detectChanges();
    component.selectIndustry('restaurant', true);
    expect(component.transitionPhase).toBe('breaking');

    tick(480);
    fixture.detectChanges();
    expect(component.activeIndustryId).toBe('restaurant');
    expect(component.transitionPhase).toBe('rebuilding');

    tick(720 + 7000);
    expect(component.transitionPhase).toBe('settled');
    expect(component.activeIndustryId).toBe('restaurant');
  }));

  it('automatically rebuilds the interface for the next industry after seven seconds', fakeAsync(() => {
    component.config = englishHero;
    fixture.detectChanges();

    tick(8200);
    fixture.detectChanges();

    expect(component.activeIndustryId).toBe('restaurant');
    expect(component.transitionPhase).toBe('settled');
    fixture.destroy();
  }));

  it('renders the Chinese responsive image and exact configured wording', () => {
    component.config = chineseHero;
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('h1').length).toBe(1);
    expect(host.querySelector('h1')?.textContent?.trim()).toBe(chineseHero.title);
    expect(host.textContent).toContain(chineseHero.description);
    expect(host.textContent).toContain('预约免费演示');
    expect(host.querySelector('picture source[media="(max-width: 767px)"]')?.getAttribute('srcset'))
      .toBe('/images/APPZPOS-Pos-Best-Point-of-Sales-System-Banner-mobile.png');
    expect(host.querySelector('picture img')?.getAttribute('src'))
      .toBe('/images/APPZPOS-Pos-Best-Point-of-Sales-System-Banner.png');
    expect(host.querySelector('picture img')?.getAttribute('alt')).toBe('APPZPOS POS系统');
    expect(host.querySelector('[role="tablist"]')).toBeNull();
  });

  it('emits demo requests and preserves the direct WhatsApp destination', () => {
    component.config = chineseHero;
    spyOn(component.requestDemo, 'emit');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    host.querySelector<HTMLButtonElement>('[data-track-cta="request-demo"]')?.click();
    expect(component.requestDemo.emit).toHaveBeenCalledTimes(1);
    expect(host.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/"]')?.getAttribute('href'))
      .toBe("https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!");
  });

  it('cancels pending transitions and autoplay when destroyed', fakeAsync(() => {
    component.config = englishHero;
    fixture.detectChanges();
    component.selectIndustry('restaurant');

    fixture.destroy();
    tick(8000);

    expect(component.activeIndustryId).toBe('quick-service');
  }));
});
