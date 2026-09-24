import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeEcosystemComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component';
import { ENGLISH_HOME_FEATURES_CONFIG, ENGLISH_HOME_GRANT_CONFIG, ENGLISH_HOME_HARDWARE_CONFIG } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-sections.en';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('HomeEcosystemComponent', () => {
  let fixture: ComponentFixture<HomeEcosystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeEcosystemComponent],
      imports: [CommonModule],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomeEcosystemComponent);
    fixture.componentInstance.hardware = ENGLISH_HOME_HARDWARE_CONFIG;
    fixture.componentInstance.grant = ENGLISH_HOME_GRANT_CONFIG;
    fixture.componentInstance.features = ENGLISH_HOME_FEATURES_CONFIG;
    (fixture.componentInstance as any).growth = {
      title: 'Grow Your Business Revenue with APPZPOS Solution',
      items: [
        { label: 'Powerful Cloud POS', text: 'Boost revenue from one platform.', iconClass: 'bi-cloud-check' },
        { label: 'Analytics & Reporting', text: 'See real-time performance.', iconClass: 'bi-graph-up-arrow' },
        { label: 'Third-party Integrations', text: 'Connect leading partners.', iconClass: 'bi-diagram-3' },
        { label: 'Multiple Outlets', text: 'Manage every location simply.', iconClass: 'bi-buildings' }
      ]
    };
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('centers the feature label and title above the full-width list', () => {
    const root = fixture.nativeElement as HTMLElement;
    const heading = root.querySelector('.ecosystem__features-intro')!;
    expect(getComputedStyle(heading).textAlign).toBe('center');
    expect(getComputedStyle(heading).justifyItems).toBe('center');
    expect(getComputedStyle(heading).position).toBe('static');
  });

  it('arranges two features per row and stacks them on phones', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    try {
      const doc = frame.contentDocument!;
      document.querySelectorAll('style').forEach(style => doc.head.appendChild(style.cloneNode(true)));
      doc.body.appendChild(fixture.nativeElement.cloneNode(true));
      const list = doc.querySelector('.ecosystem__feature-list')!;
      const entries = Array.from(list.children);
      for (const width of [1440, 820, 390]) {
        frame.style.width = width + 'px';
        const styles = frame.contentWindow!.getComputedStyle(list);
        const bullets = doc.querySelector('.ecosystem__feature-card ul')!;
        expect(frame.contentWindow!.getComputedStyle(bullets).gridTemplateColumns.split(' ').length).toBe(1);
        const firstBullet = bullets.children[0].getBoundingClientRect();
        const secondBullet = bullets.children[1].getBoundingClientRect();
        expect(secondBullet.top).toBeGreaterThan(firstBullet.top);
        expect(secondBullet.left).toBe(firstBullet.left);
        expect(styles.gridAutoFlow).toBe('row');
        const view = frame.contentWindow!;
        expect(view.getComputedStyle(entries[0]).borderTopWidth).toBe('0px');
        expect(view.getComputedStyle(entries[0]).borderRightWidth).toBe(width > 767 ? '1px' : '0px');
        expect(view.getComputedStyle(entries[1]).borderTopWidth).toBe(width > 767 ? '0px' : '1px');
        expect(view.getComputedStyle(entries[2]).borderTopWidth).toBe('1px');
        expect(view.getComputedStyle(entries[entries.length - 1]).borderBottomWidth).toBe('0px');
        if (width > 767) {
          expect(entries[0].getBoundingClientRect().left).toBe(entries[2].getBoundingClientRect().left);
          expect(entries[1].getBoundingClientRect().left).toBeGreaterThan(entries[0].getBoundingClientRect().left);
          expect(entries[1].getBoundingClientRect().top).toBe(entries[0].getBoundingClientRect().top);
        } else {
          expect(entries[5].getBoundingClientRect().left).toBe(entries[0].getBoundingClientRect().left);
        }
      }
    } finally { frame.remove(); }
  });

  it('shows the original hardware image without a coloured container or added shadow', () => {
    const media = (fixture.nativeElement as HTMLElement).querySelector('.ecosystem__hardware-media')!;
    const image = media.querySelector('img')!;
    expect(getComputedStyle(media).backgroundImage).toBe('none');
    expect(getComputedStyle(media).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(media).boxShadow).toBe('none');
    expect(getComputedStyle(image).filter).toBe('none');
    expect(image.getAttribute('src')).toContain('APPZPOS-Pos-Point-of-Sales-System-Customized-Software-and-Hardware.png');
  });

  it('replaces the hardware text link with the real APPZPOS WhatsApp action', () => {
    const hardware = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.ecosystem__hardware-copy')!;
    const action = hardware.querySelector<HTMLAnchorElement>('[data-hardware-whatsapp]');

    expect(action).not.toBeNull();
    expect(action?.textContent?.replace(/\s+/g, ' ').trim()).toBe('WhatsApp Us');
    expect(action?.getAttribute('href')).toBe(
      "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(action?.getAttribute('target')).toBe('_blank');
    expect(hardware.textContent).not.toContain('Contact us to explore the ideal solutions for your business.');
  });

  it('keeps the stacked grant concise without repeating its funding message', () => {
    const grant = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.ecosystem__grant')!;
    const normalizedText = grant.textContent?.replace(/\s+/g, ' ').trim();

    expect(grant.querySelector('.ecosystem__grant-visual')).not.toBeNull();
    const image = grant.querySelector<HTMLImageElement>('.ecosystem__grant-visual img')!;
    expect(image.getAttribute('src')).toBe('assets/images/smes-go-digital-lockup-vertical.png');
    expect(image.getAttribute('width')).toBe('1273');
    expect(image.getAttribute('height')).toBe('1251');
    expect(grant.querySelector('.ecosystem__grant-copy')).not.toBeNull();
    expect(grant.querySelector('.appz-kicker')).toBeNull();
    expect(grant.querySelector('.ecosystem__grant-rate')).toBeNull();
    expect(grant.querySelector('h2')?.textContent).toContain('Up to 50% Monetary Support');
    expect(grant.querySelector('h2')?.textContent).toContain('To Kickstart To Your F&B Business');
    expect(normalizedText).toContain(
      'Eligible Singapore companies can receive EDGE Grant support for qualifying APPZPOS digitalisation projects. Support levels vary by activity.'
    );
    expect(normalizedText).toContain('Learn More');
    expect(grant.querySelector('.ecosystem__grant-link')?.textContent).toBe('Learn More');
    expect(grant.querySelector('.ecosystem__grant-link span')).toBeNull();
  });

  it('places the growth benefits between the integrated POS and grant sections', () => {
    const ecosystem = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.ecosystem')!;
    const sections = Array.from(ecosystem.children)
      .map((element) => element.className);

    expect(sections[0]).toContain('ecosystem__hardware');
    expect(sections[1]).toContain('ecosystem__growth');
    expect(sections[2]).toContain('ecosystem__grant');
    expect(sections[3]).toContain('ecosystem__features');

    const benefits = Array.from(ecosystem.querySelectorAll<HTMLElement>('.ecosystem__growth-item'));
    expect(benefits.length).toBe(4);
    expect(benefits[0].textContent).toContain('Powerful Cloud POS');
    expect(benefits[3].textContent).toContain('Manage every location simply.');
  });

  it('renders one distinct icon-led card for every growth benefit', () => {
    const growth = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.ecosystem__growth')!;
    const cards = Array.from(growth.querySelectorAll<HTMLElement>('.ecosystem__growth-card'));
    const icons = cards.map((card) => card.querySelector<HTMLElement>('.ecosystem__growth-icon i'));

    expect(cards.length).toBe(4);
    expect(icons.map((icon) => Array.from(icon?.classList ?? []).find((name) => name !== 'bi')))
      .toEqual(['bi-cloud-check', 'bi-graph-up-arrow', 'bi-diagram-3', 'bi-buildings']);
    expect(cards.map((card) => card.querySelector('h3')?.textContent?.trim())).toEqual([
      'Powerful Cloud POS',
      'Analytics & Reporting',
      'Third-party Integrations',
      'Multiple Outlets'
    ]);
    expect(growth.querySelector('.ecosystem__growth-marker')).toBeNull();
  });

  it('renders all six original key features with their complete wording', () => {
    const cards = Array.from(
      (fixture.nativeElement as HTMLElement)
        .querySelectorAll<HTMLElement>('.ecosystem__feature-card')
    );
    const text = cards.map((card) => card.textContent?.replace(/\s+/g, ' ').trim());

    expect(cards.length).toBe(6);
    expect(text[0]).toContain('Build-in Loyalty Membership Features');
    expect(text[0]).toContain('Promotions based on tier, birthday and more');
    expect(text[1]).toContain('Singapore based developers and technical support team with prompt response');
    expect(text[2]).toContain('Onsite payment terminal integration to Kiosk and POS system');
    expect(text[3]).toContain('Real time item sales report with advanced data analytics');
    expect(text[4]).toContain('Manage Grabfood, Foodpanda and Deliveroo orders in one POS System');
    expect(text[5]).toContain('APT certified by CREST approved vendor');
  });

  it('presents the key features without visible numbers and preserves item identifiers', () => {
    const section = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.ecosystem__features')!;
    const entries = Array.from(
      section.querySelectorAll<HTMLElement>('.ecosystem__feature-entry')
    );

    expect(section.querySelector('.ecosystem__features-intro')).not.toBeNull();
    expect(section.querySelector('.ecosystem__feature-number')).toBeNull();
    expect(section.querySelector('a, button, .ecosystem__feature-arrow')).toBeNull();
    expect(getComputedStyle(section).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(section).borderTopWidth).toBe('0px');
    expect(section.querySelector('ol.ecosystem__feature-list')).not.toBeNull();
    expect(entries.length).toBe(6);
    expect(entries.map((entry) => entry.dataset['featureIndex'])).toEqual([
      '01', '02', '03', '04', '05', '06'
    ]);
  });

  it('renders only the supplied localized hardware, grant and feature content', () => {
    const component = fixture.componentInstance as any;
    component.hardware = {
      eyebrow: '软件与硬件', title: '中文硬件标题', paragraphs: ['中文硬件说明'],
      image: 'cn-hardware.png', imageAlt: '中文硬件', imageWidth: 800, imageHeight: 600,
      cta: { kind: 'link', href: '/cn-contact', label: '联络我们' }
    };
    component.grant = {
      title: '中文补助标题', paragraphs: ['中文补助说明'], image: 'cn-grant.png', imageAlt: '中文补助',
      imageWidth: 640, imageHeight: 480, cta: { kind: 'link', href: '/cn-grant', label: '查看详情' }
    };
    component.features = {
      eyebrow: '主要功能', title: '中文功能标题', items: [
        { id: 'cn-feature', title: '中文功能', icon: 'cn-feature.png', iconAlt: '', points: ['中文功能说明'] }
      ]
    };
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('中文硬件标题');
    expect(host.textContent).toContain('中文补助标题');
    expect(host.textContent).toContain('中文功能说明');
    expect(host.textContent).not.toContain('Integrated POS System');
    expect(host.querySelectorAll('.ecosystem__feature-entry').length).toBe(1);
  });
});
