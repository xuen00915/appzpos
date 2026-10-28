import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { CustomIndustryRestaurantComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-cloud-pos-system/f&b-restaurant-cloud-pos-system.component';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';
import { IndustryDiagramHandoffDirective } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-diagram-handoff.directive';
import { IndustryIslandsComponent, IndustryPageComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-page.component';
import { ApiService } from '../../../services/shared_function/api.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('F&B industry service modes', () => {
  const createFixture = () => TestBed.configureTestingModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      IndustryPageComponent,
      IndustryIslandsComponent,
      IndustryDiagramHandoffDirective
    ],
    declarations: [CustomIndustryRestaurantComponent, CustomRequestDemoComponent],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [
      { provide: ApiService, useValue: { apiCallPOST_Sync: () => { throw new Error('Tests must not submit leads'); } } },
      { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
      { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) }) } }
    ]
  }).createComponent(CustomIndustryRestaurantComponent);

  it('renders both five-step service modes without the retired interactive diagrams', () => {
    spyOn(window, 'IntersectionObserver').and.callFake(function() {
      return {
        observe: () => undefined,
        unobserve: () => undefined,
        disconnect: () => undefined,
        takeRecords: () => [],
        root: null,
        rootMargin: '',
        thresholds: [0]
      } as IntersectionObserver;
    });

    const fixture = createFixture();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('.restaurant-scroll__mode')?.textContent).toContain('Restaurant Mode');
    expect(root.querySelector('.quick-service-desktop')?.textContent).toContain('Quick Service Mode');
    expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure').length).toBe(5);
    expect(root.querySelectorAll('.quick-service-desktop .restaurant-procedure').length).toBe(5);

    for (const selector of [
      '.restaurant-overview__visual',
      '.restaurant-scroll__diagram',
      '.quick-service-diagram',
      '.restaurant-mode__markers',
      '.quick-service-markers'
    ]) {
      expect(root.querySelector(selector)).withContext(`${selector} is removed`).toBeNull();
    }

    for (const selector of ['.restaurant-scroll__mode', '.quick-service-desktop']) {
      const mode = root.querySelector(selector)!;
      expect(mode.querySelector('img')).withContext(`${selector} has no graphic`).toBeNull();
      expect(mode.querySelector('svg')).withContext(`${selector} has no graphic`).toBeNull();
      expect(mode.querySelector('app-industry-islands')).withContext(`${selector} has no interactive map`).toBeNull();
    }

    expect(getComputedStyle(root.querySelector('.restaurant-mode__timeline')!).position).toBe('static');
    expect(getComputedStyle(root.querySelector('.quick-service-timeline')!).position).toBe('static');
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('#requestdemo app-custom-request-demo')).not.toBeNull();

    fixture.destroy();
  });

  it('keeps solution cards unlit automatically while retaining deliberate focus highlighting', fakeAsync(() => {
    let notifyWall: IntersectionObserverCallback | undefined;
    spyOn(window, 'IntersectionObserver').and.callFake(function(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      if (!options) notifyWall = callback;
      return {
        observe: () => undefined,
        unobserve: () => undefined,
        disconnect: () => undefined,
        takeRecords: () => [],
        root: null,
        rootMargin: '',
        thresholds: [0]
      } as IntersectionObserver;
    });
    const realMatch = window.matchMedia.bind(window);
    let reduced = false;
    spyOn(window, 'matchMedia').and.callFake(query => query === '(prefers-reduced-motion: reduce)'
      ? {
        matches: reduced,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true
      } as MediaQueryList
      : realMatch(query));
    spyOnProperty(document, 'hidden', 'get').and.returnValue(false);

    const fixture = createFixture();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.solution-sign.is-lit')).toBeNull();
    notifyWall?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    tick(10800);
    fixture.detectChanges();
    expect(root.querySelector('.solution-sign.is-lit')).toBeNull();

    const button = root.querySelector<HTMLButtonElement>('.solution-sign button')!;
    button.click();
    fixture.detectChanges();
    expect(button.closest('.solution-sign')!.classList.contains('is-open')).toBeTrue();
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('.solution-sign.is-open')).toBeNull();

    fixture.destroy();
    tick(5400);
  }));
});
