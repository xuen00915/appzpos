import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingRevealDirective } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/marketing-reveal/marketing-reveal.directive';

@Component({ template: '<section appMarketingReveal>Product content</section>' })
class RevealHostComponent {}

describe('MarketingRevealDirective', () => {
  let fixture: ComponentFixture<RevealHostComponent>;
  let callback: IntersectionObserverCallback;
  let disconnect: jasmine.Spy;
  let originalObserver: typeof window.IntersectionObserver;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalObserver = window.IntersectionObserver;
    originalMatchMedia = window.matchMedia;
    disconnect = jasmine.createSpy('disconnect');
    window.matchMedia = (() => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => true
    })) as typeof window.matchMedia;
    window.IntersectionObserver = class {
      readonly root = null;
      readonly rootMargin = '0px';
      readonly thresholds = [0.15];
      constructor(observerCallback: IntersectionObserverCallback) { callback = observerCallback; }
      observe(): void {}
      unobserve(): void {}
      disconnect = disconnect;
      takeRecords(): IntersectionObserverEntry[] { return []; }
    } as unknown as typeof window.IntersectionObserver;

    TestBed.configureTestingModule({
      declarations: [RevealHostComponent, MarketingRevealDirective]
    });
    fixture = TestBed.createComponent(RevealHostComponent);
  });

  afterEach(() => {
    fixture.destroy();
    window.IntersectionObserver = originalObserver;
    window.matchMedia = originalMatchMedia;
  });

  it('reveals once when its real host enters the viewport', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(host.classList.contains('is-revealed')).toBeTrue();
    expect(disconnect).toHaveBeenCalled();
  });

  it('reveals immediately when reduced motion is requested', () => {
    window.matchMedia = (() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => true
    })) as typeof window.matchMedia;
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    expect(host.classList.contains('is-revealed')).toBeTrue();
  });
});
