import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';

import { LandingPosSingaporeComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/landing-pos-singapore/landing-pos-singapore.component';
import { LpIconComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/lp-icon/lp-icon.component';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';
import { ApiService } from '../../../services/shared_function/api.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

@Component({ selector: 'app-custom-request-demo', template: '<input name="name">' })
class DemoFormStubComponent { @Input() compact = false; }

describe('LandingPosSingaporeComponent (Google Ads landing page)', () => {
  let fixture: ComponentFixture<LandingPosSingaporeComponent>;
  let root: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPosSingaporeComponent, LpIconComponent, DemoFormStubComponent],
      providers: [{ provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/img/${name}` } }]
    });
    fixture = TestBed.createComponent(LandingPosSingaporeComponent);
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
  });

  it('has one h1 and exactly one conversion form, passed in compact mode', () => {
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('h1')?.textContent).toContain('Restaurant POS System in Singapore');
    expect(root.querySelectorAll('app-custom-request-demo').length).toBe(1);
    expect(root.querySelector('#requestdemo app-custom-request-demo')).not.toBeNull();
    const demo = fixture.debugElement.query(sel => sel.name === 'app-custom-request-demo');
    expect(demo.componentInstance.compact).toBeTrue();
  });

  it('offers no site navigation: the only internal link is the logo', () => {
    const internal = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map(a => a.getAttribute('href')!)
      .filter(href => !/^(https?:|mailto:|tel:)/.test(href));
    expect(internal).toEqual(['/']);
    expect(root.querySelector('nav')).toBeNull();
  });

  it('keeps WhatsApp links on the tracked destination with the "WhatsApp Us" text', () => {
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]:not(.lp-pkg__quote)'));
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const link of links) {
      expect(link.getAttribute('href')).toContain('https://wa.me/6583109631');
      expect(link.textContent?.trim()).toBe('WhatsApp Us');
      expect(link.rel).toContain('noopener');
    }
  });

  it('qualifies the grant claim and avoids unverifiable numbers', () => {
    const text = root.textContent ?? '';
    expect(text).toContain('Up to 50% EDGE Grant support');
    expect(text).toContain('Eligibility and support levels vary by activity');
    expect(text).not.toMatch(/guarantee|#1|best price|lowest price/i);
  });

  it('renders six modules, three steps and an accessible FAQ', () => {
    expect(root.querySelectorAll('.lp-card').length).toBe(6);
    expect(root.querySelectorAll('.lp-steps li').length).toBe(3);
    expect(root.querySelectorAll('.lp-faq details summary').length).toBe(5);
  });

  it('shows the Google rating in the hero and again before the final call to action', () => {
    const badges = Array.from(root.querySelectorAll<HTMLElement>('.lp-rating'));
    expect(badges.length).toBe(2);
    expect(root.querySelector('.lp-hero .lp-rating')).not.toBeNull();
    expect(root.querySelector('.lp-final .lp-rating')).not.toBeNull();
    for (const badge of badges) {
      expect(badge.getAttribute('role')).toBe('img');
      expect(badge.getAttribute('aria-label')).toBe('Rated 4.8 out of 5 on Google');
      expect(badge.textContent).toContain('4.8');
      expect(badge.textContent).not.toMatch(/reviews/i);
      expect(badge.querySelectorAll('.lp-rating__stars svg').length).toBe(5);
    }
  });

  it('moves the system screen out of the hero and into the EDGE Grant packages section', () => {
    expect(root.querySelector('.lp-hero img[src*="appzpos-screen-restaurant"]')).toBeNull();
    const section = root.querySelector('#packages') as HTMLElement;
    expect(section.querySelector('img.lp-pkgs__screen')?.getAttribute('src')).toContain('appzpos-screen-restaurant');
    const pkgs = Array.from(section.querySelectorAll<HTMLElement>('.lp-pkg'));
    expect(pkgs.length).toBe(5);
    expect(pkgs[0].textContent).toContain('Package 1');
    expect(pkgs[4].textContent).toContain('1 Order Hub + 1 Self-ordering Kiosk');
    const quote = pkgs[2].querySelector<HTMLAnchorElement>('a.lp-pkg__quote')!;
    expect(quote.href).toContain('https://wa.me/6583109631?text=');
    expect(quote.href).toContain('EDGE%20Grant%20Package%203');
    expect(quote.rel).toContain('noopener');
    expect(section.textContent).toContain('1-year subscription');
    expect(section.textContent).toContain('Central Admin Portal with unlimited users');
  });

  it('shows the purple IMDA / EDGE Grant banner and the Google rating in the hero', () => {
    const hero = root.querySelector('.lp-hero') as HTMLElement;
    const banner = hero.querySelector<HTMLImageElement>('img.lp-hero__edge');
    expect(banner?.getAttribute('src')).toContain('smes-go-digital-imda-banner-horizontal');
    expect(banner?.alt).toContain('up to 50% business grant support');
    const rating = hero.querySelector('.lp-rating');
    expect(rating?.getAttribute('aria-label')).toBe('Rated 4.8 out of 5 on Google');
    expect(rating?.querySelectorAll('.lp-rating__stars svg').length).toBe(5);
    expect(rating?.textContent).not.toMatch(/reviews/i);
  });

  it('shows three plain highlights under the hero and the grant qualifier in the hero', () => {
    const stats = Array.from(root.querySelectorAll<HTMLElement>('.lp-trust .lp-stat'));
    expect(stats.length).toBe(3);
    expect(stats[0].textContent).toContain('3 platforms');
    expect(root.querySelector('.lp-hero .lp-footnote')?.textContent).toContain('vary by activity');
  });

  it('numbers the steps and keeps the FAQ keyboard-operable (native details)', () => {
    expect(Array.from(root.querySelectorAll('.lp-step__num')).map(n => n.textContent?.trim())).toEqual(['1', '2', '3']);
    const items = Array.from(root.querySelectorAll<HTMLDetailsElement>('.lp-faq details.lp-faq__item'));
    expect(items.length).toBe(5);
    items.forEach(item => {
      expect(item.querySelector('summary .lp-faq__arrow svg')).not.toBeNull();
      expect(item.querySelector('p')?.textContent?.trim().length).toBeGreaterThan(20);
    });
    root.querySelectorAll<HTMLElement>('svg').forEach(svg => expect(svg.getAttribute('aria-hidden')).toBe('true'));
  });

  it('uses one section header pattern (a title only, no eyebrow) for every content section', () => {
    const heads = Array.from(root.querySelectorAll('.lp-head'));
    expect(heads.length).toBe(4);
    expect(root.querySelectorAll('.lp-eyebrow').length).toBe(0);
    heads.forEach(head => {
      expect(head.querySelector('.lp-eyebrow')).toBeNull();
      expect(head.querySelector('h2.lp-title')).not.toBeNull();
    });
  });

  it('hides the site header and footer only while the landing page is shown', () => {
    expect(document.body.classList.contains('appz-landing')).toBeTrue();
    fixture.destroy();
    expect(document.body.classList.contains('appz-landing')).toBeFalse();
  });

  it('keeps the page out of organic results only while it is shown', () => {
    const meta = TestBed.inject(Meta);
    expect(meta.getTag("name='robots'")?.content).toBe('noindex, nofollow');
    fixture.destroy();
    expect(meta.getTag("name='robots'")).toBeNull();
  });

  it('scrolls to and focuses the form from every call to action', () => {
    const target = root.querySelector<HTMLElement>('#requestdemo')!;
    const scroll = spyOn(target, 'scrollIntoView');
    const input = target.querySelector<HTMLInputElement>('input[name="name"]')!;
    const focus = spyOn(input, 'focus');
    root.querySelectorAll<HTMLButtonElement>('button.lp-btn--primary').forEach(button => button.click());
    expect(scroll).toHaveBeenCalled();
    expect(focus).toHaveBeenCalled();
    expect(root.querySelectorAll('button.lp-btn--primary').length).toBeGreaterThanOrEqual(3);
  });
});

describe('CustomRequestDemoComponent compact mode (used by the landing page)', () => {
  const render = (compact: boolean) => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CustomRequestDemoComponent],
      providers: [
        { provide: ApiService, useValue: {} },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => '/img/' + name } }
      ]
    });
    const fixture = TestBed.createComponent(CustomRequestDemoComponent);
    fixture.componentInstance.compact = compact;
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('keeps the full copy and contact details by default', () => {
    const root = render(false);
    expect(root.querySelector('.appz-demo--compact')).toBeNull();
    expect(root.querySelector('.appz-demo__lead')).not.toBeNull();
    expect(root.querySelector('.appz-demo__contact')).not.toBeNull();
  });

  it('hides the lead, eyebrow and contact block and asks only for name, email and mobile number', () => {
    const root = render(true);
    expect(root.querySelector('.appz-demo--compact')).not.toBeNull();
    expect(root.querySelector('.appz-demo__lead')).toBeNull();
    expect(root.querySelector('.appz-demo__contact')).toBeNull();
    expect(root.querySelector('#appz-demo-title')?.textContent).toContain('Demo');
    const ids = Array.from(root.querySelectorAll('.appz-demo__fields input')).map(i => i.id);
    expect(ids).toEqual(['name', 'email', 'mobilenum']);
    expect(root.querySelector('#restaurant_name')).toBeNull();
    expect(root.querySelector('#edge_grant')).toBeNull();
    expect(root.querySelector('form')).not.toBeNull();
  });

  it('keeps the restaurant name field on every other page', () => {
    const root = render(false);
    expect(root.querySelector('#restaurant_name')).not.toBeNull();
  });

  describe('submission', () => {
    const submit = (compact: boolean) => {
      const sent: any[] = [];
      const api = { apiCallPOST_Sync: (_url: string, body: any) => {
        sent.push(body);
        return { __zone_symbol__value: JSON.stringify({ APIResponse: { Message: '' } }) };
      } };
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [CustomRequestDemoComponent],
        providers: [
          { provide: ApiService, useValue: api },
          { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => name } }
        ]
      });
      const fixture = TestBed.createComponent(CustomRequestDemoComponent);
      fixture.componentInstance.compact = compact;
      fixture.detectChanges();
      fixture.componentInstance.requestDemoForm.patchValue({
        name: 'Test Owner', email: 'owner@example.com', mobilenum: '+6591234567'
      });
      fixture.componentInstance.onSubmit();
      return sent;
    };

    it('submits with only name, email and mobile number on the landing page', () => {
      const sent = submit(true);
      expect(sent.length).toBe(1);
      expect(sent[0].ContactUs.Subject).toBe('Demo Enquiry');
      expect(sent[0].ContactUs.RestaurantName).toBe('');
      expect(sent[0].ContactUs.Name).toBe('Test Owner');
      expect(sent[0].ContactUs.EmailAddress).toBe('owner@example.com');
      expect(sent[0].ContactUs.Phone).toBe('+6591234567');
    });

    it('still requires a restaurant name outside the landing page', () => {
      expect(submit(false).length).toBe(0);
    });
  });
});
