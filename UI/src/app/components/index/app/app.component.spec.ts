import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    (window as any).$ = { getScript: () => undefined };
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => document.body.classList.remove('gototop-active', 'appz-past-intro', 'appz-form-visible'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one sitewide floating contact rail with preserved destinations and tracking hooks', () => {
    const element = fixture.nativeElement as HTMLElement;
    const rail = element.querySelector<HTMLElement>('.appz-site-floating-contacts');
    const whatsapp = rail?.querySelector<HTMLAnchorElement>('a.btn-whatsapp');
    const messenger = rail?.querySelector<HTMLAnchorElement>('a.btn-fb');

    expect(element.querySelectorAll('.appz-site-floating-contacts').length).toBe(1);
    expect(rail?.getAttribute('aria-label')).toBe('Contact APPZPOS');
    expect(whatsapp?.getAttribute('href')).toBe(
      "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(whatsapp?.target).toBe('_blank');
    expect(whatsapp?.rel).toContain('noopener');
    expect(whatsapp?.rel).toContain('noreferrer');
    expect(whatsapp?.querySelector('.fa-whatsapp')).not.toBeNull();
    expect(whatsapp?.querySelector('img')?.alt).toBe('APPZPOS Point of Sales WhatsApp Us');
    expect(messenger?.getAttribute('href')).toBe(
      "http://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(messenger?.target).toBe('_blank');
    expect(messenger?.rel).toContain('noopener');
    expect(messenger?.rel).toContain('noreferrer');
    expect(messenger?.querySelector('img')?.alt).toBe('APPZPOS Point of Sales Messenger Us');
  });

  it('keeps the shared scroll-to-top state in sync on every route', () => {
    const scrollY = spyOnProperty(window, 'scrollY', 'get').and.returnValue(450);
    component.updateScrollTopVisibility();
    expect(document.body.classList.contains('gototop-active')).toBeTrue();

    scrollY.and.returnValue(0);
    component.updateScrollTopVisibility();
    expect(document.body.classList.contains('gototop-active')).toBeFalse();
  });
  it('keeps the persistent CTA out of the hero and gives visible forms priority', () => {
    const scrollY = spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
    component.updateScrollTopVisibility();
    expect(document.body.classList.contains('appz-past-intro')).toBeFalse();
    scrollY.and.returnValue(2000);
    component.updateScrollTopVisibility();
    expect(document.body.classList.contains('appz-past-intro')).toBeTrue();
    const form = document.createElement('section');
    form.className = 'appz-demo';
    document.body.appendChild(form);
    const bounds = spyOn(form, 'getBoundingClientRect').and.returnValue(new DOMRect(20, 120, 400, 500));
    try {
      component.updateScrollTopVisibility();
      expect(document.body.classList.contains('appz-form-visible')).toBeTrue();
      bounds.and.returnValue(new DOMRect(20, -700, 400, 500));
      component.updateScrollTopVisibility();
      expect(document.body.classList.contains('appz-form-visible')).toBeFalse();
    } finally { form.remove(); }
  });


});
