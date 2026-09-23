import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { HomePageTemplateComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component';
import { HomeHeroConfig } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.models';
import { HomeHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component';
import { CustomHomeComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { MatDialog } from '@angular/material/dialog';
import { HomeOrderFlowComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component';
import { HomeStorySectionsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-story-sections/home-story-sections.component';
import { HomeEcosystemComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component';
import { HomeIndustriesComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component';
import { HomeProofComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof/home-proof.component';
import { ENGLISH_HOME_PAGE_CONFIG } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-content.en';
import { CHINESE_HOME_PAGE_CONFIG } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/home-page-content.zh';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';
import { ApiService } from '../../../services/shared_function/api.service';

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
      imports: [CommonModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [
        HomePageTemplateComponent,
        HomeHeroComponent,
        HomeOrderFlowComponent,
        HomeStorySectionsComponent,
        HomeEcosystemComponent,
        HomeIndustriesComponent,
        HomeProofComponent,
        CustomRequestDemoComponent
      ],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
        { provide: ApiService, useValue: { apiCallPOST_Sync: () => undefined } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomePageTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => fixture.destroy());

  it('renders only configured sections without English fallback copy', () => {
    component.config = {
      language: 'zh',
      hero: chineseHero,
      conversion: { locale: 'zh', sectionId: 'requestdemo' }
    };

    fixture.detectChanges();

    expect(element.textContent).toContain(chineseHero.title);
    expect(element.textContent).not.toContain('Everything Works Together');
    expect(element.querySelector('#requestdemo app-custom-request-demo')).not.toBeNull();
    expect(element.querySelector('app-cn-custom-request-demo')).toBeNull();
    expect(element.textContent).toContain('联系APPZPOS');
    expect(element.textContent).toContain('新加坡最佳POS收银系统，协助您轻松管理餐厅业务。');
    expect(element.textContent).toContain('名字');
    expect(element.textContent).toContain('电子邮件地址');
    expect(element.textContent).toContain('电话号码');
    expect(element.textContent).toContain('公司名字');
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

  it('keeps both locale templates ordered, overflow-safe and touch-friendly at all supported widths', () => {
    const copyStyles = (target: Document) => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const style = target.createElement('style');
          style.textContent = Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
          target.head.appendChild(style);
        } catch { /* Cross-origin styles are not part of the compiled app bundle. */ }
      }
    };

    for (const pageConfig of [ENGLISH_HOME_PAGE_CONFIG, CHINESE_HOME_PAGE_CONFIG]) {
      fixture.componentRef.setInput('config', pageConfig);
      fixture.detectChanges();

      const frame = document.createElement('iframe');
      document.body.appendChild(frame);
      try {
        const doc = frame.contentDocument!;
        copyStyles(doc);
        doc.body.appendChild(element.cloneNode(true));

        for (const width of [1450, 1280, 1024, 820, 768, 430, 390, 320]) {
          frame.style.width = width + 'px';
          const view = frame.contentWindow!;
          expect(doc.documentElement.scrollWidth)
            .withContext(`${pageConfig.language} horizontal overflow at ${width}`)
            .toBeLessThanOrEqual(doc.documentElement.clientWidth + 1);

          const ids = Array.from(doc.querySelectorAll<HTMLElement>('[id]')).map(node => node.id).filter(Boolean);
          expect(ids.length).withContext(`${pageConfig.language} duplicate ids at ${width}`).toBe(new Set(ids).size);

          const targets = Array.from(doc.querySelectorAll<HTMLElement>('button, a'))
            .filter(node => {
              const rect = node.getBoundingClientRect();
              const styles = view.getComputedStyle(node);
              return rect.width > 0 && rect.height > 0 && styles.display !== 'none' && styles.visibility !== 'hidden';
            });
          const undersizedTargets = targets
            .filter(node => node.getBoundingClientRect().height < 44)
            .map(node => `${node.tagName.toLowerCase()}.${node.className}:${Math.round(node.getBoundingClientRect().height)}`);
          expect(undersizedTargets)
            .withContext(`${pageConfig.language} touch target below 44px at ${width}`)
            .toEqual([]);

          const ordered = Array.from(doc.querySelectorAll<HTMLElement>(
            'app-home-hero > section, app-home-order-flow > section, main > app-home-story-sections article, main > app-home-ecosystem > section > div, main > app-home-industries > section, main > app-home-proof > section, main > .appz-conversion-panel'
          )).map(section => section.getBoundingClientRect().top);
          expect(ordered).withContext(`${pageConfig.language} section order at ${width}`)
            .toEqual([...ordered].sort((left, right) => left - right));

          const story = doc.querySelector<HTMLElement>('.home-story-section');
          if (story) {
            expect(view.getComputedStyle(story).gridTemplateColumns.split(' ').length)
              .withContext(`${pageConfig.language} story columns at ${width}`)
              .toBe(width > 900 ? 2 : 1);
          }
        }
      } finally { frame.remove(); }
    }
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
