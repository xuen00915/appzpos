import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';

import { CustomHomeComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { HomeHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component';
import { HomePageTemplateComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component';

describe('APPZPOS home hero', () => {
  let fixture: ComponentFixture<CustomHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CustomHomeComponent, HomePageTemplateComponent, HomeHeroComponent],
      providers: [
        {
          provide: CommonFunctionService,
          useValue: { BindURL_Image: (fileName: string) => `/images/${fileName}` }
        },
        { provide: Title, useValue: { setTitle: () => undefined } },
        { provide: Meta, useValue: { updateTag: () => undefined } },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) })
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(CustomHomeComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('presents the POS machine, product promise, and demo action in one hero', () => {
    const host = fixture.nativeElement as HTMLElement;
    const hero = host.querySelector<HTMLElement>('.appzpos-product-hero');

    expect(hero).withContext('the product-led hero should render').not.toBeNull();
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('All-In-One POS System in Singapore with EDGE Grant');
    expect(hero?.querySelector('.appzpos-product-hero__intro')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('Transform your F&B, Retail, & Salon Businesses with APPZPOS Cutting-Edge Point of Sales Software');
    expect(hero?.querySelector<HTMLImageElement>('img[alt="APPZPOS touchscreen POS terminal with receipt printer"]'))
      .withContext('the terminal should have meaningful alternative text')
      .not.toBeNull();
    expect(Array.from(hero?.querySelectorAll('button') ?? []).some((button) =>
      button.textContent?.trim() === 'Request a Demo'
    )).toBeTrue();
  });

  it('renders the changing software interface inside the stationary flat hardware screen', () => {
    const host = fixture.nativeElement as HTMLElement;
    const hero = host.querySelector<HTMLElement>('.appzpos-product-hero');
    const product = hero?.querySelector<HTMLImageElement>('.appzpos-product-hero__machine img');

    expect(hero?.classList.contains('appzpos-product-hero--reclined')).toBeTrue();
    expect(product?.getAttribute('src')).toBe('assets/images/appzpos-pos-terminal-hardware-only.png');
    expect(hero?.querySelector('.appzpos-product-hero__machine .appzpos-software-screen'))
      .withContext('the changing software must sit inside the physical terminal screen')
      .not.toBeNull();
    expect(hero?.querySelector('.appzpos-software-screen__lift')).toBeNull();
    expect(hero?.querySelector('.appzpos-software-screen__float')).toBeNull();
    expect(hero?.querySelector('.appzpos-software-screen__projection')).toBeNull();
  });

  it('maps the software through a dedicated perspective plane inside the physical screen', () => {
    const host = fixture.nativeElement as HTMLElement;
    const perspectivePlane = host.querySelector<HTMLElement>(
      '.appzpos-product-hero__screen-window > .appzpos-product-hero__screen-plane'
    );

    expect(perspectivePlane)
      .withContext('the software needs its own plane so it can follow the reclined touchscreen angle')
      .not.toBeNull();
    expect(perspectivePlane?.querySelector(':scope > .appzpos-software-screen'))
      .withContext('the complete interface must be transformed as one surface')
      .not.toBeNull();
  });

  it('rebuilds realistic image-backed screen regions for the selected industry', fakeAsync(() => {
    const host = fixture.nativeElement as HTMLElement;
    const screenImages = () => Array.from(
      host.querySelectorAll<HTMLImageElement>('.appzpos-screen-slice img')
    );

    expect(screenImages().length)
      .withContext('the POS interface should be split into animated screen regions')
      .toBe(4);
    expect(screenImages().every((image) => image.getAttribute('src') ===
      'assets/images/appzpos-screen-quick-service.png'))
      .withContext('the initial screen should use the realistic quick-service interface')
      .toBeTrue();

    Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
      .find((tab) => tab.textContent?.trim() === 'Retail')
      ?.click();
    tick(500);
    fixture.detectChanges();

    expect(screenImages().every((image) => image.getAttribute('src') ===
      'assets/images/appzpos-screen-retail.png'))
      .withContext('selecting Retail should rebuild the screen with the retail interface')
      .toBeTrue();

    tick(800);
  }));

  it('shows the official APPZPOS logo once and removes it cleanly if the asset fails', () => {
    const host = fixture.nativeElement as HTMLElement;
    const logoLayer = host.querySelector<HTMLElement>('.appzpos-software-screen__brand');
    const officialLogo = logoLayer?.querySelector<HTMLImageElement>('img');

    expect(host.querySelectorAll('.appzpos-software-screen__brand').length)
      .withContext('the software display should expose exactly one logo layer')
      .toBe(1);
    expect(officialLogo?.getAttribute('src')).toBe(
      'https://appzpos.com/admin/Upload/0771BB36-9631-40F2-A204-C60247E9F1E1/Images/APPZPOS-300X150px.png'
    );

    officialLogo?.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(logoLayer?.querySelector('img'))
      .withContext('a failed official logo should leave a clean covered area instead of a duplicate or broken image')
      .toBeNull();
  });

  it('places the order-flow story directly after the homepage hero', () => {
    const host = fixture.nativeElement as HTMLElement;
    const hero = host.querySelector('app-home-hero');
    const orderFlow = hero?.nextElementSibling;

    expect(orderFlow?.tagName.toLowerCase()).toBe('app-home-order-flow');
    expect(orderFlow?.nextElementSibling?.tagName.toLowerCase()).toBe('main');
  });

  it('keeps the configured English landing-page section order', () => {
    const content = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('main.appz-home-story');
    const sectionOrder = Array.from(content?.children ?? [])
      .map((element) => element.tagName.toLowerCase());

    expect(sectionOrder).toEqual([
      'app-home-ecosystem',
      'app-home-ecosystem',
      'app-home-ecosystem',
      'app-home-industries',
      'app-home-ecosystem',
      'app-home-proof',
      'app-home-proof',
      'section'
    ]);
  });

  it('rebuilds illuminated module cards around the machine for the selected industry', fakeAsync(() => {
    const host = fixture.nativeElement as HTMLElement;
    const moduleCards = () => Array.from(
      host.querySelectorAll<HTMLElement>('.appzpos-module-orbit__card')
    );
    const moduleLabels = () => moduleCards()
      .map((card) => card.textContent?.replace(/\s+/g, ' ').trim());

    expect(moduleLabels()).toEqual([
      'POS System',
      'Website Ordering',
      'Self Order Kiosk',
      'Kitchen Display System (KDS)',
      'Queue Number Display'
    ]);
    expect(moduleCards()[0].classList.contains('appzpos-module-orbit__card--primary'))
      .withContext('POS System should lead the module constellation with stronger visual hierarchy')
      .toBeTrue();
    expect(moduleCards().every((card) => card.querySelector('svg') === null))
      .withContext('premium module panels should not repeat a generic grid icon')
      .toBeTrue();
    expect(moduleCards().every((card) =>
      card.querySelector('.appzpos-module-orbit__connector, .appzpos-module-orbit__edge') === null
    ))
      .withContext('module panels should use their own depth treatment without lines linking them to the POS')
      .toBeTrue();

    Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
      .find((tab) => tab.textContent?.trim() === 'Retail')
      ?.click();
    tick(500);
    fixture.detectChanges();

    expect(moduleLabels()).toEqual([
      'POS System',
      'Website Ordering',
      'Self Order Kiosk'
    ]);

    tick(800);
  }));

  it('preserves the real actions and exposes four business-type controls', () => {
    const host = fixture.nativeElement as HTMLElement;
    const hero = host.querySelector<HTMLElement>('.appzpos-product-hero');
    const tabs = Array.from(hero?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    const whatsApp = hero?.querySelector<HTMLAnchorElement>('.appzpos-product-hero__button--secondary');

    expect(tabs.map((tab) => tab.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Quick Service',
      'Restaurant',
      'Retail',
      'Salon'
    ]);
    expect(whatsApp?.getAttribute('href')).toBe(
      "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
  });

  it('uses the compact industry line as the switcher without adding a second control bar above the machine', () => {
    const host = fixture.nativeElement as HTMLElement;
    const hero = host.querySelector<HTMLElement>('.appzpos-product-hero');

    expect(hero?.querySelector('.appzpos-product-hero__copy .appzpos-industry-switcher'))
      .withContext('the four controls should replace the decorative industry line')
      .not.toBeNull();
    expect(hero?.querySelector('.appzpos-product-hero__visual > .appzpos-industry-switcher'))
      .withContext('the machine should not be pushed down by a second pill bar')
      .toBeNull();
  });

  it('stops autoplay permanently after a visitor chooses an industry', fakeAsync(() => {
    const host = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(
      host.querySelectorAll<HTMLButtonElement>('.appzpos-product-hero [role="tab"]')
    );
    tabs.find((tab) => tab.textContent?.trim() === 'Retail')?.click();

    tick(1200);
    fixture.detectChanges();
    expect(host.querySelector('.appzpos-product-hero [role="tab"][aria-selected="true"]')?.textContent?.trim())
      .toBe('Retail');

    tick(14000);
    fixture.detectChanges();
    expect(host.querySelector('.appzpos-product-hero [role="tab"][aria-selected="true"]')?.textContent?.trim())
      .toBe('Retail');
  }));
});
