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

  it('groups the desktop navigation into six focused actions', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    const labels = Array.from(host.querySelectorAll<HTMLElement>('.appzpos-nav__primary-item'))
      .map((item) => item.textContent?.replace(/\s+/g, ' ').trim());
    expect(labels).toEqual([
      'Solutions', 'Industries', 'PSG Grant', 'Resources', 'POS餐饮系统', 'Request a Demo'
    ]);
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
