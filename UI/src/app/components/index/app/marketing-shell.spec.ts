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

  it('keeps Resources focused on Blog and EDGE Grant', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    const resourceLinks = Array.from(
      host.querySelectorAll<HTMLAnchorElement>('#resources-menu a[href]')
    ).map((anchor) => ({
      label: anchor.textContent?.replace(/\s+/g, ' ').trim(),
      href: anchor.getAttribute('href')
    }));

    expect(resourceLinks).toEqual([
      { label: 'Blog', href: '/blog' },
      { label: 'EDGE Grant', href: '/psg-pos-system-grant-singapore' }
    ]);
  });

  it('uses Title Case for Hardware and Features without changing destinations', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('#solutions-menu a'));
    const byHref = (href: string) => links.find(link => link.getAttribute('href') === href);

    expect(byHref('/pos-hardware-machine-receipt-printer')?.querySelector('strong')?.textContent?.trim())
      .toBe('Hardware');
    expect(byHref('/pos-features-crm-payment-gateway')?.querySelector('strong')?.textContent?.trim())
      .toBe('Features');
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
      expect(headerFixture.nativeElement.querySelector('#resources-menu a[aria-current="page"]')?.textContent).toBe('EDGE Grant');
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

  it('offers ordered call, WhatsApp and Messenger actions after the demo button', () => {
    const host = headerFixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    const header = host.querySelector<HTMLElement>('#header')!;
    const callLink = host.querySelector<HTMLAnchorElement>('[aria-label="Call APPZPOS"]');
    const whatsappLink = host.querySelector<HTMLAnchorElement>('[aria-label="WhatsApp APPZPOS"]');
    const messengerLink = host.querySelector<HTMLAnchorElement>('[aria-label="Message APPZPOS on Messenger"]');

    expect(callLink?.getAttribute('href')).toBe('tel:+6583109631');
    expect(whatsappLink?.getAttribute('href')).toBe(
      "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(whatsappLink?.getAttribute('target')).toBe('_blank');
    expect(whatsappLink?.getAttribute('rel')).toBe('noopener');
    expect(messengerLink?.getAttribute('href')).toBe(
      "https://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(messengerLink?.getAttribute('target')).toBe('_blank');
    expect(messengerLink?.getAttribute('rel')).toBe('noopener');
    expect(getComputedStyle(header).position).toBe('fixed');
    expect(header.getBoundingClientRect().height).toBe(76);

    const headerActions = Array.from(
      host.querySelectorAll<HTMLAnchorElement>('.appzpos-nav > a[href]')
    ).map((anchor) => anchor.getAttribute('aria-label') || anchor.textContent?.trim());
    expect(headerActions.indexOf('Request a Demo')).toBeLessThan(headerActions.indexOf('Call APPZPOS'));
    expect(headerActions.indexOf('Call APPZPOS')).toBeLessThan(headerActions.indexOf('WhatsApp APPZPOS'));
    expect(headerActions.indexOf('WhatsApp APPZPOS')).toBeLessThan(headerActions.indexOf('Message APPZPOS on Messenger'));
    host.remove();
  });

  it('continues loading the configured Google and Facebook marketing tags', () => {
    expect(GoogleAnalyticsHelpersService.LoadGoogleTag).toHaveBeenCalledTimes(1);
    expect(FacebookPixelSettingService.LoadFacebookPixelSetting).toHaveBeenCalledTimes(1);
    expect(FacebookPixelSettingService.LoadFaceBookImgPixelCode).toHaveBeenCalledTimes(1);
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

  it('keeps the conversion and social actions after removing resource navigation', () => {
    const host = footerFixture.nativeElement as HTMLElement;
    const actionColumn = host.querySelector<HTMLElement>('.appzpos-footer__socials')?.parentElement;
    const headings = Array.from(actionColumn?.querySelectorAll<HTMLElement>('h2') ?? [])
      .map((heading) => heading.textContent?.trim());
    const directLinks = Array.from(
      actionColumn?.querySelectorAll<HTMLAnchorElement>(':scope > a') ?? []
    );

    expect(headings).toEqual(['SOCIAL MEDIA']);
    expect(directLinks.map((link) => ({
      label: link.textContent?.trim(),
      href: link.getAttribute('href')
    }))).toEqual([
      { label: 'Request a Demo', href: '/point-of-sales-demo-quotation' }
    ]);
    expect(actionColumn?.firstElementChild).toBe(directLinks[0]);
  });

  it('uses recognizable social brand colors and a larger certification badge', () => {
    const host = footerFixture.nativeElement as HTMLElement;
    const socialIcons = Array.from(host.querySelectorAll<HTMLElement>('.appzpos-footer__socials i'));
    const badge = host.querySelector<HTMLElement>('.appzpos-footer__iso')!;

    expect(getComputedStyle(socialIcons[0]).backgroundImage).toContain('linear-gradient');
    expect(getComputedStyle(socialIcons[1]).color).toBe('rgb(24, 119, 242)');
    expect(getComputedStyle(socialIcons[2]).color).toBe('rgb(10, 102, 194)');
    expect(getComputedStyle(socialIcons[3]).color).toBe('rgb(255, 0, 0)');
    expect(badge.getBoundingClientRect().width).toBe(190);
  });

  it('keeps the footer vertically compact on desktop', () => {
    const host = footerFixture.nativeElement as HTMLElement;
    const innerStyle = getComputedStyle(host.querySelector<HTMLElement>('.appzpos-footer__inner')!);
    const bottomStyle = getComputedStyle(host.querySelector<HTMLElement>('.appzpos-footer__bottom')!);
    const innerVerticalPadding = parseFloat(innerStyle.paddingTop) + parseFloat(innerStyle.paddingBottom);
    const bottomVerticalPadding = parseFloat(bottomStyle.paddingTop) + parseFloat(bottomStyle.paddingBottom);

    expect(innerVerticalPadding).toBeLessThanOrEqual(100);
    expect(bottomVerticalPadding).toBeLessThanOrEqual(32);
  });

  it('does not render a divider above the footer', () => {
    const host = footerFixture.nativeElement as HTMLElement;
    const footer = host.querySelector<HTMLElement>('#footer.appzpos-footer')!;

    expect(parseFloat(getComputedStyle(footer).borderTopWidth)).toBe(0);
  });

  it('exposes the designer credit as a safe external destination', () => {
    const host = footerFixture.nativeElement as HTMLElement;
    const credit = host.querySelector<HTMLAnchorElement>('.appzpos-footer__credit a');

    expect(credit?.textContent?.trim()).toBe('Adcendes Pte Ltd');
    expect(credit?.getAttribute('href')).toBe('https://adcendes.com.sg/');
    expect(credit?.getAttribute('target')).toBe('_blank');
    expect(credit?.getAttribute('rel')).toContain('noopener');
  });

  it('places the designer credit directly under the copyright phrase', () => {
    const host = footerFixture.nativeElement as HTMLElement;
    const footer = host.querySelector<HTMLElement>('#footer.appzpos-footer')!;
    const bottom = host.querySelector<HTMLElement>('#copyrights.appzpos-footer__bottom')!;
    const legal = bottom.querySelector<HTMLElement>('.appzpos-footer__legal')!;

    expect(bottom.children.length).toBe(2);
    expect(legal.children.length).toBe(2);
    expect(legal.firstElementChild?.textContent?.trim()).toBe(
      '© Copyrights 2016-2026 by APPZGATE SOLUTIONS PTE LTD'
    );
    expect(legal.lastElementChild).toHaveClass('appzpos-footer__credit');
    expect(getComputedStyle(bottom).flexDirection).toBe('row');
    expect(getComputedStyle(bottom).backgroundColor).toBe(getComputedStyle(footer).backgroundColor);
  });

});
