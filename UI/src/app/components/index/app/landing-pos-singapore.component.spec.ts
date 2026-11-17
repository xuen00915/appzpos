import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';

import { LandingPosSingaporeComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/landing-pos-singapore/landing-pos-singapore.component';
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
      declarations: [LandingPosSingaporeComponent, DemoFormStubComponent],
      providers: [{ provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/img/${name}` } }]
    });
    fixture = TestBed.createComponent(LandingPosSingaporeComponent);
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
  });

  it('has one h1 and exactly one conversion form, passed in compact mode', () => {
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('h1')?.textContent).toContain('Cloud POS System for Singapore Restaurants');
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
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]'));
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

  it('hides only the lead, eyebrow and contact block, keeping the same four-field form', () => {
    const root = render(true);
    expect(root.querySelector('.appz-demo--compact')).not.toBeNull();
    expect(root.querySelector('.appz-demo__lead')).toBeNull();
    expect(root.querySelector('.appz-demo__contact')).toBeNull();
    expect(root.querySelector('#appz-demo-title')?.textContent).toContain('Demo');
    expect(root.querySelectorAll('.appz-demo__field input').length).toBe(4);
    expect(root.querySelector('form')).not.toBeNull();
  });
});
