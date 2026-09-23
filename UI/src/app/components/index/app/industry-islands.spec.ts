import { ReactiveFormsModule } from '@angular/forms';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';
import { ApiService } from '../../../services/shared_function/api.service';
import { CommonModule } from '@angular/common';
import { IndustryDiagramHandoffDirective } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-diagram-handoff.directive';
import { IndustryPageComponent, IndustryIslandsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CustomIndustryRestaurantComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-cloud-pos-system/f&b-restaurant-cloud-pos-system.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('F&B industry islands pilot', () => {
  it('lets each of five islands select its related solutions without losing existing page hooks', () => {
    let notifyMode: IntersectionObserverCallback | undefined;
    let notifyProcedure: IntersectionObserverCallback | undefined;
    let notifyReveal: IntersectionObserverCallback | undefined;
    const disconnect = jasmine.createSpy('disconnect');
    spyOn(window, 'IntersectionObserver').and.callFake(function(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      if (options?.rootMargin === '-96px 0px -35% 0px') notifyMode = callback;
      else if (options?.rootMargin === `-${Math.round(window.innerHeight * .25)}px 0px -${Math.round(window.innerHeight * .65)}px 0px`) notifyProcedure = callback;
      else notifyReveal = callback;
      return { observe: () => undefined, unobserve: () => undefined, disconnect,
        takeRecords: () => [], root: null, rootMargin: '', thresholds: [0] } as IntersectionObserver;
    });
    const fixture = TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, IndustryPageComponent, IndustryIslandsComponent, IndustryDiagramHandoffDirective],
      declarations: [CustomIndustryRestaurantComponent, CustomRequestDemoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiService, useValue: { apiCallPOST_Sync: () => { throw new Error('Responsive tests must not submit leads'); } } },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) }) } }
      ]
    }).createComponent(CustomIndustryRestaurantComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    if (window.matchMedia('(max-width: 991px), (max-width: 1366px) and (pointer: coarse)').matches) {
      for (const selector of ['.restaurant-mode__timeline', '.quick-service-compact .container']) {
        expect(getComputedStyle(root.querySelector(selector)!).borderRadius).toBe('20px');
      }
      expect(getComputedStyle(root.querySelector('.quick-service-stack')!).display).toBe('grid');
      const restaurantHeading = getComputedStyle(root.querySelector('.restaurant-procedure > a')!);
      const quickHeading = getComputedStyle(root.querySelector('.quick-step-heading')!);
      for (const property of ['font-size', 'font-weight', 'line-height', 'color', 'gap']) {
        expect(quickHeading.getPropertyValue(property)).toBe(restaurantHeading.getPropertyValue(property));
      }
      expect(getComputedStyle(root.querySelector('.quick-service-step .restaurant-procedure__number')!).backgroundColor)
        .toBe(getComputedStyle(root.querySelector('.restaurant-procedure .restaurant-procedure__number')!).backgroundColor);
    }
    expect(root.querySelector('.restaurant-scroll__intro')?.textContent).toContain('Transform Your Restaurants: Maximize Profits');
    expect(root.querySelector('.restaurant-scroll__mode')?.textContent).toContain('Restaurant Mode');
    expect(getComputedStyle(root.querySelector('.restaurant-scroll__mode')!, '::before').backgroundColor)
      .toBe('rgb(238, 246, 255)');
    expect(root.querySelector('.restaurant-scroll__diagram app-industry-islands')).not.toBeNull();
    const quickDesktop = root.querySelector('.quick-service-desktop')!;
    expect(quickDesktop.firstElementChild?.classList.contains('quick-service-diagram')).toBeTrue();
    // Reproduce the legacy #webview rule in the site's canvas index at laptop width.
    const laptopFrame = document.createElement('iframe');
    laptopFrame.style.width = '1280px';
    laptopFrame.style.height = '900px';
    document.body.appendChild(laptopFrame);
    try {
      const frameDocument = laptopFrame.contentDocument!;
      document.querySelectorAll('style').forEach(style => frameDocument.head.appendChild(style.cloneNode(true)));
      const legacyStyle = frameDocument.createElement('style');
      legacyStyle.textContent = '@media(min-width:769px){#webview{display:block}}';
      frameDocument.head.appendChild(legacyStyle);
      frameDocument.body.appendChild(root.cloneNode(true));
      for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [1280, 720], [1024, 768], [820, 1180], [768, 1024], [430, 932], [390, 844], [375, 667], [320, 568], [844, 390]]) {
        laptopFrame.style.width = width + 'px';
        laptopFrame.style.height = height + 'px';
        expect(frameDocument.documentElement.scrollWidth).withContext('No horizontal overflow at ' + width)
          .toBeLessThanOrEqual(width);
        const view = laptopFrame.contentWindow!;
        const wall = frameDocument.querySelector('.solution-wall')!;
        expect(wall.querySelectorAll('.solution-sign__image').length).toBe(8);
        for (const card of Array.from(wall.querySelectorAll('.solution-sign'))) {
          const image = card.querySelector('.solution-sign__image')!;
          expect(image.getBoundingClientRect().width).toBeCloseTo(card.getBoundingClientRect().width, 0);
        }
        const columns = view.getComputedStyle(wall).gridTemplateColumns.split(' ').length;
        expect(columns).withContext('Readable solution columns at ' + width).toBe(width >= 992 ? 4 : width >= 600 ? 2 : 1);
        for (const selector of ['.solution-sign', '.appz-demo__field', '.restaurant-hero__copy']) {
          for (const item of Array.from(frameDocument.querySelectorAll<HTMLElement>(selector))) {
            expect(item.scrollWidth).withContext(selector + ' text fits at ' + width).toBeLessThanOrEqual(item.clientWidth + 1);
          }
        }
        for (const input of Array.from(frameDocument.querySelectorAll('input'))) {
          const bounds = input.getBoundingClientRect();
          expect(bounds.width).toBeGreaterThan(100);
          expect(bounds.left).toBeGreaterThanOrEqual(0);
          expect(bounds.right).toBeLessThanOrEqual(width);
        }
        if (width < 992) {
          expect(view.getComputedStyle(frameDocument.querySelector('.restaurant-mode__timeline')!).position).toBe('static');
          expect(view.getComputedStyle(frameDocument.querySelector('.restaurant-scroll__diagram')!).display).toBe('none');
        }
        const hero = frameDocument.querySelector('.restaurant-hero__inner')!.getBoundingClientRect();
        const selectors = ['.restaurant-scroll__intro', '.restaurant-scroll', '.pos-solutions', '#requestdemo',
          width >= 992 ? '.quick-service-desktop' : '.quick-service-compact'];
        for (const selector of selectors) {
          const bounds = frameDocument.querySelector(selector)!.getBoundingClientRect();
          expect(bounds.left).withContext(selector + ' left at ' + width).toBeCloseTo(hero.left, 0);
          expect(bounds.width).withContext(selector + ' width at ' + width).toBeCloseTo(hero.width, 0);
        }
      }
      laptopFrame.style.width = '1280px';
      laptopFrame.style.height = '900px';
      const layout = frameDocument.querySelector('.quick-service-desktop')!;
      expect(laptopFrame.contentWindow!.getComputedStyle(layout).display).toBe('grid');
      const diagram = layout.querySelector('.quick-service-diagram')!.getBoundingClientRect();
      const copy = layout.querySelector('.quick-service-copy')!.getBoundingClientRect();
      expect(diagram.right).toBeLessThanOrEqual(copy.left);
      expect(diagram.top).toBeCloseTo(copy.top, 0);
      const restaurantMap = frameDocument.querySelector('.restaurant-scroll__diagram .industry-islands__map')!.getBoundingClientRect();
      const quickMap = layout.querySelector('.industry-islands__map')!.getBoundingClientRect();
      expect(quickMap.width).toBeCloseTo(restaurantMap.width, 0);
      for (const selector of ['.restaurant-mode__timeline', '.quick-service-timeline']) {
        const timeline = frameDocument.querySelector(selector)!;
        expect(laptopFrame.contentWindow!.getComputedStyle(timeline).position).toBe('sticky');
        expect(timeline.getBoundingClientRect().height).toBeLessThan(790);
      }
      const firstStep = frameDocument.querySelector('.restaurant-procedure')!.getBoundingClientRect();
      expect(firstStep.height).toBeLessThan(160);
      expect(laptopFrame.contentWindow!.getComputedStyle(frameDocument.querySelector('.restaurant-procedure')!).borderWidth).toBe('0px');
      for (const [width, height] of [[1280, 720], [1024, 768]]) {
        laptopFrame.style.width = width + 'px';
        laptopFrame.style.height = height + 'px';
        for (const selector of ['.restaurant-mode__timeline', '.quick-service-timeline']) {
          expect(frameDocument.querySelector(selector)!.getBoundingClientRect().height)
            .withContext('All five steps fit below the header at ' + width + 'x' + height)
            .toBeLessThan(height - 110);
        }
      }
      laptopFrame.style.width = '1280px';
      laptopFrame.style.height = '900px';
      const overview = frameDocument.querySelector('.restaurant-scroll__intro')!;
      const title = overview.querySelector('h2')!;
      const fullDiagram = overview.querySelector<HTMLImageElement>('.restaurant-overview__diagram');
      expect(fullDiagram).not.toBeNull();
      expect(laptopFrame.contentWindow!.getComputedStyle(title).textAlign).toBe('center');
      if (fullDiagram) {
        expect(fullDiagram.getBoundingClientRect().top).toBeGreaterThanOrEqual(title.getBoundingClientRect().bottom);
        expect(fullDiagram.getAttribute('src')).toContain('floorplan.png');
        expect(fullDiagram.style.transform).toBe('');
        for (const width of [820, 390]) {
          laptopFrame.style.width = `${width}px`;
          expect(laptopFrame.contentWindow!.getComputedStyle(title).textAlign).toBe('center');
          expect(fullDiagram.getBoundingClientRect().top).toBeGreaterThanOrEqual(title.getBoundingClientRect().bottom);
          expect(fullDiagram.getBoundingClientRect().width).toBeGreaterThan(0);
          expect(laptopFrame.contentWindow!.getComputedStyle(frameDocument.querySelector('.restaurant-scroll__diagram')!).display).toBe('none');
          expect(laptopFrame.contentWindow!.getComputedStyle(layout).display).toBe('none');
        }
      }
    } finally {
      laptopFrame.remove();
    }
    expect(quickDesktop.querySelector('.quick-service-copy h2')?.textContent).toBe('Quick Service Mode');
    expect(quickDesktop.querySelectorAll('.quick-service-copy .restaurant-procedures li').length).toBe(5);
    expect(quickDesktop.querySelector('.quick-service-copy #ptab10')).not.toBeNull();
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector<HTMLImageElement>('.restaurant-hero__photo')?.getAttribute('src'))
      .toBe('/images/APPZPOS-Restaurant-POS-System- Singapore-banner.png');
    expect(root.querySelector('.restaurant-hero__diagram')).toBeNull();
    expect(root.querySelector('.restaurant-hero__copy')?.textContent).toContain('One-stop POS Solutions for F&B industry');
    const islands = Array.from(root.querySelectorAll<HTMLButtonElement>('.restaurant-scroll [data-industry-island]'));
    expect(islands.length).toBe(5);
    const artwork = root.querySelector('.industry-islands__artwork');
    expect(artwork?.querySelector('.industry-islands__original')).not.toBeNull();
    expect(artwork?.querySelectorAll('.industry-island').length).toBe(5);
    expect(root.querySelectorAll('.restaurant-scroll .industry-island__floor').length).toBe(4);
    const floorKey = root.querySelector('feFuncR')?.getAttribute('tableValues')?.split(' ');
    expect(floorKey?.length).toBe(256);
    expect(floorKey?.[247]).toBe('1');
    expect(floorKey?.filter(value => value === '1').length).toBe(1);
    expect(root.querySelector('[data-industry-island="Online & Delivery"] .industry-island__floor')).toBeNull();
    expect(islands.every(island => island.disabled)).toBeTrue();
    islands[0].click();
    fixture.detectChanges();
    expect(root.querySelector('[data-industry-detail]')).toBeNull();
    fixture.componentInstance.isCompact = false;
    notifyMode?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(islands.every(island => !island.disabled)).toBeTrue();
    const original = root.querySelector<HTMLElement>('.industry-islands__original')!;
    const imageBounds = original.getBoundingClientRect();
    if (window.matchMedia('(max-width: 991px), (max-width: 1366px) and (pointer: coarse)').matches) {
      const diagramStyle = getComputedStyle(root.querySelector('.restaurant-scroll__diagram')!);
      expect(diagramStyle.display).toBe('none');
      expect(root.querySelector('.restaurant-overview__diagram')!.getBoundingClientRect().width).toBeGreaterThan(0);
    } else {
      expect(imageBounds.width).toBeGreaterThan(0);
    }
    for (const preview of Array.from(root.querySelectorAll('.procedure-island'))) {
      expect(getComputedStyle(preview).display).toBe('none');
    }
    for (const island of islands) {
      const bounds = island.getBoundingClientRect();
      expect(bounds.left).toBeCloseTo(imageBounds.left, 0);
      expect(bounds.width).toBeCloseTo(imageBounds.width, 0);
      expect(bounds.height).toBeCloseTo(imageBounds.height, 0);
      expect(getComputedStyle(island).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    }
    expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure').length).toBe(5);
    expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure .procedure-island svg').length).toBe(5);
    expect(root.querySelectorAll('.quick-service-stack .procedure-island svg').length).toBe(5);
    expect(root.querySelector('.quick-service-stack.owl-carousel')).toBeNull();
    for (const preview of Array.from(root.querySelectorAll('.procedure-island svg'))) {
      expect(preview.getAttribute('viewBox')).toBe('0 0 1920 1080');
      expect(preview.querySelector('image')?.getAttribute('href')).toContain('floorplan.png');
      expect(preview.querySelector('image')?.hasAttribute('clip-path')).toBeFalse();
      expect(preview.querySelector('.procedure-island__highlight')?.getAttribute('clip-path')).toContain('-floor');
    }
    const wasCompact = fixture.componentInstance.isCompact;
    fixture.componentInstance.isCompact = true;
    fixture.detectChanges();
    expect(islands.every(island => island.disabled)).toBeTrue();
    expect(root.querySelector('.industry-island.is-lit')).toBeNull();
    expect(root.querySelector('.industry-islands__mobile-controls')).toBeNull();
    islands[0].click();
    fixture.detectChanges();
    expect(root.querySelector('.industry-island.is-selected')).toBeNull();
    expect(root.querySelector('[data-industry-detail]')).toBeNull();
    expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure [hidden]').length).toBe(0);
    expect(root.querySelectorAll('.quick-service-stack p[hidden]').length).toBe(0);
    for (let index = 0; index < 5; index++) {
      for (const mode of ['restaurant', 'quick']) {
        const target = root.querySelector(`[data-mode="${mode}"][data-step="${index}"]`)!;
        notifyReveal?.([{ isIntersecting: true, target } as IntersectionObserverEntry], {} as IntersectionObserver);
      }
      fixture.detectChanges();
      expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure [hidden]').length).toBe(0);
      expect(root.querySelectorAll('.quick-service-stack p[hidden]').length).toBe(0);
    }
    notifyReveal?.([], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure > a[aria-expanded="true"]').length).toBe(5);
    fixture.componentInstance.isCompact = wasCompact;
    fixture.detectChanges();
    for (let index = 0; index < 5; index++) {
      const target = root.querySelector(`.restaurant-scroll .restaurant-procedure[data-procedure="${index}"]`)!;
      notifyProcedure?.([{ isIntersecting: true, target } as IntersectionObserverEntry], {} as IntersectionObserver);
      fixture.detectChanges();
      expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure.is-active').length).toBe(1);
      expect(root.querySelector(`#ptab${index + 1}`)?.hasAttribute('hidden')).toBeFalse();
      for (const floor of Array.from(root.querySelectorAll('.restaurant-scroll .is-focused .industry-island__floor'))) {
        expect(getComputedStyle(floor).display).toBe('none');
      }
      expect(root.querySelectorAll('.restaurant-scroll .industry-island.is-lit').length)
        .toBe(fixture.componentInstance.procedureIslands[index].length);
      const expectedTitles = fixture.componentInstance.industryIslands
        .filter(island => fixture.componentInstance.procedureIslands[index].includes(island.id))
        .map(island => island.title);
      expect(Array.from(root.querySelectorAll<HTMLElement>('.restaurant-scroll .industry-island.is-lit'))
        .map(island => island.dataset['industryIsland'])).toEqual(expectedTitles);
    }
    expect(root.querySelector<HTMLImageElement>('.industry-islands__original')?.getAttribute('src'))
      .toBe('/images/APPZPOS-Restaurant-POS-System- Singapore-floorplan.png');
    for (const island of islands) {
      island.click();
      fixture.detectChanges();
      expect(island.getAttribute('aria-pressed')).toBe('true');
      expect(root.querySelectorAll('[data-industry-island][aria-pressed="true"]').length).toBe(1);
      const panel = root.querySelector('[data-industry-detail]');
      expect(panel).toBeNull();
      expect(island.hasAttribute('aria-controls')).toBeFalse();
    }
    expect(root.querySelectorAll('#content').length).toBe(1);
    const restaurantProcedure = fixture.componentInstance.activeProcedure;
    for (let index = 0; index < 5; index++) {
      const marker = quickDesktop.querySelector(`[data-mode="quick"][data-procedure="${index}"]`);
      expect(marker).not.toBeNull();
      if (marker) notifyProcedure?.([{ isIntersecting: true, target: marker } as IntersectionObserverEntry], {} as IntersectionObserver);
      fixture.detectChanges();
      expect(fixture.componentInstance.activeQuickProcedure).toBe(index);
      root.querySelector<HTMLAnchorElement>(`#canvas-tab-${index + 6}`)!.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.activeQuickProcedure).toBe(index);
      expect(root.querySelector(`#ptab${index + 6}`)?.classList.contains('active')).toBeTrue();
      expect(quickDesktop.querySelectorAll('.restaurant-procedure.is-active').length).toBe(1);
      expect(quickDesktop.querySelector(`#canvas-tab-${index + 6}`)?.parentElement?.querySelector(`#ptab${index + 6}`)).not.toBeNull();
      const expected = fixture.componentInstance.industryIslands
        .filter(island => fixture.componentInstance.quickProcedureIslands[index].includes(island.id)).map(island => island.title);
      expect(Array.from(quickDesktop.querySelectorAll<HTMLElement>('.industry-island.is-lit'))
        .map(island => island.dataset['industryIsland'])).toEqual(expected);
      expect(fixture.componentInstance.activeProcedure).toBe(restaurantProcedure);
      expect(quickDesktop.querySelector('[data-industry-detail]')).toBeNull();
    }
    const signs = root.querySelectorAll<HTMLButtonElement>('.solution-sign button');
    expect(signs.length).toBe(8);
    expect(root.querySelectorAll('.solution-sign__detail:not([hidden])').length).toBe(8);
    expect(root.querySelectorAll('.solution-sign__detail a').length).toBe(0);
    for (const card of Array.from(root.querySelectorAll<HTMLElement>('.solution-sign'))) {
      expect(getComputedStyle(card).borderTopWidth).toBe('0px');
      expect(getComputedStyle(card.querySelector('button')!).borderTopWidth).toBe('0px');
      const description = card.querySelector('.solution-sign__detail')!.getBoundingClientRect();
      const bounds = card.getBoundingClientRect();
      expect(description.left).toBeGreaterThanOrEqual(bounds.left);
      expect(description.right).toBeLessThanOrEqual(bounds.right);
      expect(description.bottom).toBeLessThanOrEqual(bounds.bottom);
    }
    if (signs.length) {
      signs[0].click(); fixture.detectChanges();
      expect(signs[0].hasAttribute('aria-expanded')).toBeFalse();
      expect(root.querySelector('.solution-sign__detail')?.hasAttribute('hidden')).toBeFalse();
      signs[0].dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
      fixture.detectChanges();
      expect(root.querySelectorAll('.solution-sign__detail:not([hidden])').length).toBe(8);
    }
    expect(root.querySelector('#requestdemo app-custom-request-demo')).not.toBeNull();
    expect(root.querySelectorAll('#requestdemo').length).toBe(1);
    expect(root.querySelector('#requestdemo')?.classList.contains('appz-conversion-panel')).toBeTrue();
    expect(root.querySelector('a.btn-whatsapp[href^="https://wa.me/6583109631"]')).not.toBeNull();
    expect(root.querySelector('#canvas-tab-1')).not.toBeNull();
    notifyMode?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(islands.every(island => island.disabled)).toBeTrue();
    expect(root.querySelector('[data-industry-detail]')).toBeNull();
    expect(root.querySelector('.industry-island.is-selected')).toBeNull();
    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });
  it('keeps solution cards unlit automatically while retaining deliberate focus highlighting', fakeAsync(() => {
    let notifyWall: IntersectionObserverCallback | undefined;
    spyOn(window, 'IntersectionObserver').and.callFake(function(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      if (!options) notifyWall = callback;
      return { observe: () => undefined, unobserve: () => undefined, disconnect: () => undefined,
        takeRecords: () => [], root: null, rootMargin: '', thresholds: [0] } as IntersectionObserver;
    });
    const realMatch = window.matchMedia.bind(window);
    let reduced = false;
    spyOn(window, 'matchMedia').and.callFake(query => query === '(prefers-reduced-motion: reduce)'
      ? {matches: reduced, media: query, onchange: null, addEventListener: () => undefined,
        removeEventListener: () => undefined, addListener: () => undefined,
        removeListener: () => undefined, dispatchEvent: () => true} as MediaQueryList : realMatch(query));
    spyOnProperty(document, 'hidden', 'get').and.returnValue(false);
    const fixture = TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, IndustryPageComponent, IndustryIslandsComponent, IndustryDiagramHandoffDirective],
      declarations: [CustomIndustryRestaurantComponent, CustomRequestDemoComponent], schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiService, useValue: { apiCallPOST_Sync: () => { throw new Error('Responsive tests must not submit leads'); } } },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => '/images/' + name } },
        { provide: MatDialog, useValue: {} }
      ]
    }).createComponent(CustomIndustryRestaurantComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.solution-sign.is-lit')).toBeNull();
    notifyWall?.([{isIntersecting: true} as IntersectionObserverEntry], {} as IntersectionObserver);
    tick(10800); fixture.detectChanges();
    expect(root.querySelector('.solution-sign.is-lit')).toBeNull();
    const button = root.querySelector<HTMLButtonElement>('.solution-sign button')!;
    button.click(); fixture.detectChanges();
    expect(button.closest('.solution-sign')!.classList.contains('is-open')).toBeTrue();
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('.solution-sign.is-open')).toBeNull();
    fixture.destroy();
    tick(5400);
  }));

});
