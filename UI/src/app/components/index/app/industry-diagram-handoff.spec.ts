import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndustryDiagramHandoffDirective } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-diagram-handoff.directive';

@Component({
  standalone: true,
  imports: [IndustryDiagramHandoffDirective],
  template: `<div appIndustryDiagramHandoff>
    <section class="restaurant-scroll__intro"><h2>Transform Your Restaurants</h2>
      <div class="restaurant-overview__visual"><img class="restaurant-overview__diagram" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"></div>
    </section>
    <div class="restaurant-scroll__mode"></div>
    <div class="restaurant-scroll__diagram"><div class="industry-islands__map"><div class="industry-islands__artwork"><img class="industry-islands__original" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"></div></div></div>
    <div class="restaurant-mode__timeline">Restaurant copy</div>
    <div class="quick-service-desktop">
      <div class="quick-service-diagram"><div class="industry-islands__map"><div class="industry-islands__artwork"><img class="industry-islands__original"></div></div></div>
      <div class="quick-service-timeline">Quick service copy</div>
    </div>
  </div>`
})
class HandoffFixture {}

describe('F&B diagram handoff', () => {
  let fixture: ComponentFixture<HandoffFixture>;
  let frame: FrameRequestCallback | undefined;
  let quickTop: number;
  let restaurantTop: number;
  let compact = false;
  let reduced = false;
  const tick = () => { const callback = frame; frame = undefined; callback?.(0); };
  const scroll = (top: number) => { quickTop = top; window.dispatchEvent(new Event('scroll')); tick(); };
  const element = (selector: string): HTMLElement => fixture.nativeElement.querySelector(selector);

  beforeEach(() => {
    compact = false; reduced = false; quickTop = 900; restaurantTop = 100;
    spyOnProperty(window, 'innerHeight').and.returnValue(900);
    spyOn(window, 'matchMedia').and.callFake(query => ({
      get matches() { return query.includes('reduced-motion') ? reduced : compact; },
      media: query, onchange: null, addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {}, dispatchEvent: () => true
    } as MediaQueryList));
    spyOn(window, 'requestAnimationFrame').and.callFake(callback => { frame = callback; return 1; });
    spyOn(window, 'cancelAnimationFrame');
    fixture = TestBed.createComponent(HandoffFixture);
    fixture.detectChanges();
    spyOn(element('.restaurant-scroll__mode'), 'getBoundingClientRect').and.callFake(() => new DOMRect(0, restaurantTop, 480, 3200));
    spyOn(element('.restaurant-overview__visual'), 'getBoundingClientRect').and.returnValue(new DOMRect(150, 120, 900, 506.25));
    spyOn(element('.quick-service-desktop'), 'getBoundingClientRect').and.callFake(() => new DOMRect(0, quickTop, 1200, 3200));
    spyOn(element('.restaurant-scroll__diagram .industry-islands__map'), 'getBoundingClientRect').and.returnValue(new DOMRect(600, 120, 600, 337.5));
    spyOn(element('.quick-service-diagram .industry-islands__map'), 'getBoundingClientRect').and.returnValue(new DOMRect(40, 120, 480, 270));
    tick();
  });

  afterEach(() => fixture.destroy());

  it('hands the centered full diagram to the right column and reverses without duplicate images', () => {
    restaurantTop = 900; scroll(4000);
    expect(element('.restaurant-overview__visual').style.visibility).not.toBe('hidden');
    expect(element('.restaurant-scroll__diagram').style.visibility).toBe('hidden');
    restaurantTop = 700; scroll(4000);
    const overlay = document.querySelector<HTMLElement>('.industry-diagram-handoff');
    expect(overlay).not.toBeNull();
    if (!overlay) return;
    const first = new DOMMatrix(getComputedStyle(overlay).transform);
    expect(element('.restaurant-overview__visual').style.visibility).toBe('hidden');
    expect(element('.restaurant-scroll__diagram').style.visibility).toBe('hidden');
    expect(element('.quick-service-diagram').style.visibility).toBe('hidden');
    restaurantTop = 300; scroll(4000);
    const next = new DOMMatrix(getComputedStyle(overlay).transform);
    expect(next.e).toBeGreaterThan(first.e);
    expect(next.a).toBeLessThan(first.a);
    expect(document.querySelectorAll('.industry-diagram-handoff').length).toBe(1);
    restaurantTop = 700; scroll(4000);
    expect(new DOMMatrix(getComputedStyle(overlay).transform).e).toBeCloseTo(first.e, 4);
    restaurantTop = 100; scroll(4000);
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
    expect(element('.restaurant-scroll__diagram').style.visibility).toBe('visible');
    expect(element('.restaurant-mode__timeline').style.opacity).toBe('1');
    expect(element('.restaurant-overview__visual').style.visibility).toBe('hidden');
    scroll(400);
    expect(document.querySelector('.industry-diagram-handoff')).not.toBeNull();
    scroll(100);
    expect(element('.quick-service-diagram').style.visibility).toBe('visible');
    restaurantTop = 900; scroll(4000);
    expect(element('.restaurant-overview__visual').style.visibility).toBe('visible');
    expect(element('.restaurant-scroll__intro h2').style.opacity).toBe('1');
  });

  it('preserves the full-image crop while blending into the Restaurant zoom', () => {
    element('.restaurant-overview__diagram').style.cssText = 'width:1080px;height:506.25px;margin-left:-90px;max-width:none';
    element('.restaurant-scroll__diagram .industry-islands__artwork').style.cssText = 'width:600px;height:337.5px;transform:matrix(2,0,0,2,100,-50)';
    restaurantTop = 438.5; scroll(4000);
    const image = document.querySelector<HTMLElement>('.industry-diagram-handoff img');
    expect(image).not.toBeNull();
    if (!image) return;
    const camera = new DOMMatrix(getComputedStyle(image).transform);
    expect(camera.a).toBeCloseTo(1.6, 4);
    expect(camera.d).toBeCloseTo(1.5, 4);
    expect(element('.restaurant-mode__timeline').style.opacity).toBe('0');
    reduced = true; scroll(4000);
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
    expect(element('.restaurant-overview__visual').style.visibility).toBe('');
    expect(element('.restaurant-scroll__diagram').style.visibility).toBe('');
  });

  it('moves right to left and shrinks, with only one visible diagram, then reverses', () => {
    scroll(700);
    const overlay = document.querySelector<HTMLElement>('.industry-diagram-handoff');
    expect(overlay).not.toBeNull();
    if (!overlay) return;
    const first = new DOMMatrix(getComputedStyle(overlay).transform);
    expect(element('.restaurant-scroll__diagram').style.visibility).toBe('hidden');
    expect(element('.quick-service-diagram').style.visibility).toBe('hidden');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(overlay.style.pointerEvents).toBe('none');
    scroll(300);
    const second = new DOMMatrix(getComputedStyle(overlay).transform);
    expect(second.e).toBeLessThan(first.e);
    expect(second.a).toBeLessThan(first.a);
    scroll(700);
    const reversed = new DOMMatrix(getComputedStyle(overlay).transform);
    expect(reversed.e).toBeCloseTo(first.e, 4);
    expect(reversed.a).toBeCloseTo(first.a, 4);
    scroll(100);
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
    expect(element('.quick-service-diagram').style.visibility).not.toBe('hidden');
    expect(element('.quick-service-timeline').style.opacity).toBe('1');
    scroll(900);
    expect(element('.restaurant-scroll__diagram').style.visibility).not.toBe('hidden');
    expect(element('.restaurant-mode__timeline').style.opacity).toBe('1');
  });

  it('leaves compact and reduced-motion layouts untouched, including preference changes mid-handoff', () => {
    scroll(450);
    reduced = true;
    window.dispatchEvent(new Event('resize')); tick();
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
    expect(element('.restaurant-scroll__diagram').style.visibility).toBe('');
    expect(element('.quick-service-timeline').style.opacity).toBe('');
    reduced = false; compact = true;
    scroll(450);
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
    expect(element('.quick-service-diagram').style.visibility).toBe('');
  });

  it('interpolates the zoom and clears both text columns while crossing between them', () => {
    const source = element('.restaurant-scroll__diagram .industry-islands__artwork');
    const target = element('.quick-service-diagram .industry-islands__artwork');
    source.style.cssText = 'width:600px;height:337.5px;transform:matrix(2,0,0,2,100,-50)';
    target.style.cssText = 'width:480px;height:270px;transform:matrix(1.5,0,0,1.5,-50,27)';
    scroll(438.5);
    const overlay = document.querySelector<HTMLElement>('.industry-diagram-handoff');
    expect(overlay).not.toBeNull();
    if (!overlay) return;
    const camera = new DOMMatrix(getComputedStyle(overlay.querySelector('img')!).transform);
    expect(camera.a).toBeCloseTo(1.75, 4);
    expect(camera.e).toBeCloseTo(31.25, 4);
    expect(overlay.querySelector('.industry-island__floor')).toBeNull();
    expect(element('.restaurant-mode__timeline').style.opacity).toBe('0');
    expect(element('.quick-service-timeline').style.opacity).toBe('0');
  });

  it('restores controls immediately when keyboard focus enters a moving section', () => {
    scroll(450);
    const button = document.createElement('button');
    element('.quick-service-timeline').appendChild(button);
    button.focus(); tick();
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
    expect(element('.quick-service-timeline').style.opacity).toBe('');
    expect(element('.quick-service-diagram').style.visibility).toBe('');
  });

  it('removes the visual overlay and restores the page on destruction', () => {
    scroll(450);
    const source = element('.restaurant-scroll__diagram');
    expect(document.querySelector('.industry-diagram-handoff')).not.toBeNull();
    fixture.destroy();
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
    expect(source.style.visibility).toBe('');
    window.dispatchEvent(new Event('scroll')); tick();
    expect(document.querySelector('.industry-diagram-handoff')).toBeNull();
  });
});
