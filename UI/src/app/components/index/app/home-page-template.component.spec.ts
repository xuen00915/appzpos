import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomePageTemplateComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component';
import { HomeHeroConfig } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.models';
import { HomeHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component';
import { CustomHomeComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { MatDialog } from '@angular/material/dialog';

describe('HomePageTemplateComponent', () => {
  let fixture: ComponentFixture<HomePageTemplateComponent>;
  let component: HomePageTemplateComponent;
  let element: HTMLElement;

  const chineseHero: HomeHeroConfig = {
    headingId: 'cn-home-title',
    title: 'APPZPOS POS系统云端智能POS餐饮系统高达50%政府津贴折扣',
    description: '专为餐饮业者设计的全方位餐饮系统',
    visual: {
      kind: 'responsive-image',
      desktopSrc: '/images/desktop.png',
      mobileSrc: '/images/mobile.png',
      alt: 'APPZPOS POS系统',
      width: 1600,
      height: 900
    },
    ctas: [
      { kind: 'action', action: 'request-demo', label: '预约免费演示', trackingClass: 'legacy-demo' },
      {
        kind: 'link',
        label: 'WhatsApp联系我们',
        href: 'https://wa.me/6583109631?text=test',
        target: '_blank',
        rel: 'noopener noreferrer',
        trackingClass: 'legacy-whatsapp'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [HomePageTemplateComponent, HomeHeroComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomePageTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders only configured sections without English fallback copy', () => {
    component.config = {
      language: 'zh',
      hero: chineseHero,
      conversion: { locale: 'zh', sectionId: 'requestdemo' }
    };

    fixture.detectChanges();

    expect(element.textContent).toContain(chineseHero.title);
    expect(element.textContent).not.toContain('Everything Works Together');
    expect(element.querySelector('app-cn-custom-request-demo')).not.toBeNull();
    expect(element.querySelector('app-custom-request-demo')).toBeNull();
    expect(element.querySelector('app-home-order-flow')).toBeNull();
    expect(element.querySelector('app-home-industries')).toBeNull();
    expect(element.querySelector('app-home-proof')).toBeNull();
  });

  it('emits requestDemo for an action CTA and leaves link CTAs as anchors', () => {
    component.config = { language: 'zh', hero: chineseHero };
    spyOn(component.requestDemo, 'emit');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('[data-track-cta="request-demo"]')?.click();

    expect(component.requestDemo.emit).toHaveBeenCalledTimes(1);
    const whatsapp = element.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/"]');
    expect(whatsapp).not.toBeNull();
    expect(whatsapp?.target).toBe('_blank');
    expect(whatsapp?.rel).toContain('noopener');
    expect(whatsapp?.classList).toContain('legacy-whatsapp');
  });

  it('provides one labelled H1 and applies the configured page language', () => {
    component.config = { language: 'zh', hero: chineseHero };

    fixture.detectChanges();

    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelector('h1')?.id).toBe('cn-home-title');
    expect(element.querySelector('[data-home-page-template]')?.getAttribute('lang')).toBe('zh');
    expect(element.querySelector('section')?.getAttribute('aria-labelledby')).toBe('cn-home-title');
  });

  it('selects the English form without changing the stable conversion section id', () => {
    component.config = {
      language: 'en',
      hero: { ...chineseHero, title: 'English title' },
      conversion: { locale: 'en', sectionId: 'requestdemo' }
    };

    fixture.detectChanges();

    expect(element.querySelector('#requestdemo app-custom-request-demo')).not.toBeNull();
    expect(element.querySelector('app-cn-custom-request-demo')).toBeNull();
  });
});

describe('English homepage shared-template parity', () => {
  it('provides the complete English homepage through one shared template config', () => {
    const dialog = { open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => ({ subscribe: () => undefined }) }) };
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CustomHomeComponent],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    const fixture = TestBed.createComponent(CustomHomeComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const config = (fixture.componentInstance as any).pageConfig;
    expect(host.querySelector('app-home-page-template')).not.toBeNull();
    expect(config.language).toBe('en');
    expect(config.hero.title).toBe('All-In-One POS System');
    expect(config.hero.titleAccent).toBe('in Singapore with PSG Grant');
    expect(config.hero.ctas.map((cta: any) => cta.label)).toEqual(['Request a Demo', 'WhatsApp Us']);
    expect(config.hero.visual.industries.length).toBe(4);
    expect(config.solutions.items.length).toBe(7);
    expect(config.features.items.length).toBe(6);
    expect(config.industries.stories.length).toBe(4);
    expect(new Set(config.proof.customers.map((customer: any) => customer.image)).size).toBe(76);
    expect(config.proof.testimonials.length).toBe(4);
    expect(config.grant.cta.href).toBe('/psg-pos-system-grant-singapore');
    expect(config.proof.reviewCta.href).toBe('https://g.page/r/CZDr77wgfEgaEAI/review');
    expect(config.conversion).toEqual({ locale: 'en', sectionId: 'requestdemo' });
    expect(host.querySelector('.appzpos-legacy-copy-bank')?.hasAttribute('hidden')).toBeTrue();

    fixture.componentInstance.openDialog();
    expect(dialog.open).toHaveBeenCalled();
    fixture.destroy();
  });
});
