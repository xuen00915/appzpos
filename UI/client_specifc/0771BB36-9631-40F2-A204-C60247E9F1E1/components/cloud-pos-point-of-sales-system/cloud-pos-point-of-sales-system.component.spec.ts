import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPOSEWaiterComponent } from './cloud-pos-point-of-sales-system.component';
import { SolutionHeroComponent } from '../solution-hero/solution-hero.component';

describe('CustomPOSEWaiterComponent', () => {
  let component: CustomPOSEWaiterComponent;
  let fixture: ComponentFixture<CustomPOSEWaiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPOSEWaiterComponent, SolutionHeroComponent]
    });
    fixture = TestBed.createComponent(CustomPOSEWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the POS island in the shared solution hero', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('[data-solution-hero]');
    expect(hero?.querySelector('img')?.getAttribute('src')).toBe('assets/images/ecosystem/ecosystem-pos-ewaiter-transparent.webp');
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('APPZPOS Cutting-Edge POS Point of Sales and E-Menu System');
  });

  it('puts the centered All-In-One title above copy-left and artwork-right', () => {
    const overview = (fixture.nativeElement as HTMLElement).querySelector('[data-pos-overview]');
    expect(overview?.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('All-In-One Point of Sale Software');
    expect([...overview?.querySelectorAll('[data-pos-overview-layout] > *') ?? []]
      .map((element) => element.getAttribute('data-pos-overview-column')))
      .toEqual(['copy', 'visual']);
  });

  it('groups all twelve POS features into three four-item colour rows', () => {
    const grid = (fixture.nativeElement as HTMLElement).querySelector('[data-pos-feature-grid]');
    const features = [...grid?.querySelectorAll('[data-pos-feature]') ?? []];

    expect(features.length).toBe(12);
    expect(features.map((feature) => feature.getAttribute('data-feature-tone')))
      .toEqual([
        'blue', 'blue', 'blue', 'blue',
        'orange', 'orange', 'orange', 'orange',
        'green', 'green', 'green', 'green'
      ]);
  });

  it('stacks image before title and description in each POS system card', () => {
    const cards = [...(fixture.nativeElement as HTMLElement).querySelectorAll('[data-pos-system-card]')];

    expect(cards.length).toBe(3);
    cards.forEach((card) => {
      const visual = card.querySelector('.pos-system-card__visual');
      const title = card.querySelector('h2');
      const description = card.querySelector('.pos-system-card__body > p:not(.pos-system-card__eyebrow)');
      expect(visual?.compareDocumentPosition(title as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(title?.compareDocumentPosition(description as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  it('filters the borderless four-column hardware collection by category and size', () => {
    const host = fixture.nativeElement as HTMLElement;
    const items = [...host.querySelectorAll('[data-hardware-item]')];
    expect(items.length).toBe(16);

    component.setHardwareCategory('printer');
    fixture.detectChanges();
    expect(items.filter((item) => !item.classList.contains('is-hidden')).length).toBe(2);

    component.setHardwareCategory('all');
    const select = host.querySelector<HTMLSelectElement>('[data-hardware-filters] select') as HTMLSelectElement;
    select.value = '15.6';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(items.filter((item) => !item.classList.contains('is-hidden')).length).toBe(9);
  });
});
