import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { CustomFooterComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-footer/custom-footer.component';
import { CustomWhiteHeaderComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { FacebookPixelSettingService } from '../../../services/shared_function/facebook-pixelsetting.service';
import { GoogleAnalyticsHelpersService } from '../../../services/shared_function/google-helpers.services';

describe('APPZPOS marketing shell', () => {
  let headerFixture: ComponentFixture<CustomWhiteHeaderComponent>;
  let footerFixture: ComponentFixture<CustomFooterComponent>;

  beforeEach(() => {
    spyOn(GoogleAnalyticsHelpersService, 'LoadGoogleTag');
    spyOn(GoogleAnalyticsHelpersService, 'LoadGoogleIFrame');
    spyOn(FacebookPixelSettingService, 'LoadFacebookPixelSetting');
    spyOn(FacebookPixelSettingService, 'LoadFaceBookImgPixelCode');
    TestBed.configureTestingModule({
      declarations: [CustomWhiteHeaderComponent, CustomFooterComponent],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
        { provide: Title, useValue: { setTitle: () => undefined } }
      ]
    });
    headerFixture = TestBed.createComponent(CustomWhiteHeaderComponent);
    footerFixture = TestBed.createComponent(CustomFooterComponent);
    headerFixture.detectChanges();
    footerFixture.detectChanges();
  });

  afterEach(() => {
    headerFixture.destroy();
    footerFixture.destroy();
  });

  it('groups the desktop navigation into five focused actions', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    const labels = Array.from(host.querySelectorAll<HTMLElement>('.appzpos-nav__primary-item'))
      .map((item) => item.textContent?.replace(/\s+/g, ' ').trim());
    expect(labels).toEqual([
      'Solutions', 'Industries', 'Resources', 'POS餐饮系统', 'Request a Demo'
    ]);
  });

  it('keeps Resources focused on Blog and PSG Grant', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    const resourceLinks = Array.from(
      host.querySelectorAll<HTMLAnchorElement>('#resources-menu a[href]')
    ).map((anchor) => ({
      label: anchor.textContent?.replace(/\s+/g, ' ').trim(),
      href: anchor.getAttribute('href')
    }));

    expect(resourceLinks).toEqual([
      { label: 'Blog', href: '/blog' },
      { label: 'PSG Grant', href: '/psg-pos-system-grant-singapore' }
    ]);
  });

  it('marks only the current navigation destination without changing its URL', () => {
    const initialUrl = location.href;
    try {
      history.replaceState(null, '', '/f&b-restaurant-kitchen-display-system');
      headerFixture.detectChanges();
      const current = headerFixture.nativeElement.querySelectorAll('a[aria-current="page"]');
      expect(current.length).toBe(1);
      expect(current[0].getAttribute('href')).toBe('/f&b-restaurant-kitchen-display-system');
      expect(current[0].closest('#solutions-menu')).not.toBeNull();
      history.replaceState(null, '', '/psg-pos-system-grant-singapore');
      headerFixture.detectChanges();
      expect(headerFixture.nativeElement.querySelector('#resources-menu a[aria-current="page"]')?.textContent).toBe('PSG Grant');
    } finally {
      history.replaceState(null, '', initialUrl);
    }
  });

  it('keeps every commercial destination reachable', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    const hrefs = Array.from(host.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map((anchor) => anchor.getAttribute('href'));
    expect(hrefs).toContain('/cloud-pos-point-of-sales-system');
    expect(hrefs).toContain('/f&b-restaurant-cloud-pos-system');
    expect(hrefs).toContain('/cn-f&b-restaurant-cloud-pos-system');
    expect(hrefs).toContain('/point-of-sales-demo-quotation');
  });

  it('offers direct call and WhatsApp actions in the header', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    const callLink = host.querySelector<HTMLAnchorElement>('[aria-label="Call APPZPOS"]');
    const whatsappLink = host.querySelector<HTMLAnchorElement>('[aria-label="WhatsApp APPZPOS"]');

    expect(callLink?.getAttribute('href')).toBe('tel:+6583109631');
    expect(whatsappLink?.getAttribute('href')).toBe(
      "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(whatsappLink?.getAttribute('target')).toBe('_blank');
    expect(whatsappLink?.getAttribute('rel')).toBe('noopener');

    const headerActions = Array.from(
      host.querySelectorAll<HTMLAnchorElement>('.appzpos-nav > a[href]')
    ).map((anchor) => anchor.getAttribute('aria-label') || anchor.textContent?.trim());
    expect(headerActions.indexOf('Request a Demo')).toBeLessThan(headerActions.indexOf('Call APPZPOS'));
    expect(headerActions.indexOf('Call APPZPOS')).toBeLessThan(headerActions.indexOf('WhatsApp APPZPOS'));
  });

  it('opens and closes menu state with accessible attributes', () => {
    const component = headerFixture.componentInstance;
    const host = headerFixture.nativeElement as HTMLElement;
    component.toggleMenu('solutions');
    headerFixture.detectChanges();
    expect(host.querySelector('[aria-controls="solutions-menu"]')?.getAttribute('aria-expanded')).toBe('true');
    component.handleEscape();
    headerFixture.detectChanges();
    expect(host.querySelector('[aria-controls="solutions-menu"]')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('locks page scrolling while the mobile navigation is open', () => {
    const component = headerFixture.componentInstance;
    component.toggleMobileMenu();
    expect(document.body.style.overflow).toBe('hidden');
    component.closeMenus();
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps existing footer contact, social and brochure destinations', () => {
    const host = footerFixture.nativeElement as HTMLElement;
    const hrefs = Array.from(host.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map((anchor) => anchor.getAttribute('href'));
    expect(host.textContent).toContain('Office Address:');
    expect(host.textContent).toContain('+65 8310 9631 (WhatsApp)');
    expect(hrefs).toContain('https://www.instagram.com/appzgatesolutions/');
    expect(hrefs).toContain('https://www.facebook.com/APPZPOS/');
    expect(hrefs).toContain('https://www.linkedin.com/company/appzgate');
    expect(hrefs).toContain('https://www.youtube.com/@APPZPOS');
    expect(hrefs).toContain('https://www.appzpos.com/docs/APPZPOS-A4-Brochure-EN.pdf');
  });
});
