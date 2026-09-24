import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPOSEWaiterComponent } from './cloud-pos-point-of-sales-system.component';
import { SolutionHeroComponent } from '../solution-hero/solution-hero.component';
import { SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent } from '../solution-page/solution-page.component';

describe('CustomPOSEWaiterComponent', () => {
  let component: CustomPOSEWaiterComponent;
  let fixture: ComponentFixture<CustomPOSEWaiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent],
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

  it('renders the POS hero diagram without interactive or yellow hotspot overlays', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('[data-solution-hero]');
    const image = hero?.querySelector('img');

    expect(image?.closest('a')).toBeNull();
    expect(hero?.querySelector('.appz-solution-hero__integration-link')).toBeNull();
    expect(hero?.querySelectorAll('[data-solution-device]').length).toBe(0);
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

  it('introduces the POS feature grid with a section title and description', () => {
    const heading = (fixture.nativeElement as HTMLElement).querySelector('[data-pos-feature-heading]');

    expect(heading?.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('Everything You Need to Run Your Restaurant');
    expect(heading?.querySelector('p')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('Manage orders, payments, inventory, customers and reporting from one connected POS platform.');
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

  it('gives the Cloud and Tablet POS cards green WhatsApp actions', () => {
    const host = fixture.nativeElement as HTMLElement;
    const actions = [...host.querySelectorAll<HTMLAnchorElement>('#pos-cloud .pos-whatsapp-button, #pos-tablet .pos-whatsapp-button')];

    expect(actions.length).toBe(2);
    actions.forEach((action) => {
      expect(action.textContent?.replace(/\s+/g, ' ').trim()).toBe('WhatsApp Us');
      expect(action.href).toContain('https://wa.me/6583109631');
      expect(action.classList.contains('button-green')).toBeTrue();
    });
  });

  it('introduces the hardware collection with centered supporting copy', () => {
    const heading = (fixture.nativeElement as HTMLElement).querySelector('[data-pos-hardware] .heading-block');
    const intro = heading?.querySelector('.pos-hardware__intro');

    expect(heading?.classList.contains('text-center')).toBeTrue();
    expect(heading?.querySelector('h2')?.textContent?.trim()).toBe('Related POS Hardware');
    expect(intro?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('Choose the POS machines, printers and accessories that fit your business setup.');
  });

  it('keeps all sixteen hardware products focused on image and title only', () => {
    const items = [...(fixture.nativeElement as HTMLElement).querySelectorAll('[data-hardware-item]')];

    expect(items.length).toBe(16);
    items.forEach((item) => {
      expect(item.querySelector('h4')?.textContent?.trim().length).toBeGreaterThan(0);
      expect(item.querySelector('.pos-hardware-card__description')).toBeNull();
    });
  });

  it('filters the borderless four-column hardware collection by category and configuration', () => {
    const host = fixture.nativeElement as HTMLElement;
    const items = [...host.querySelectorAll('[data-hardware-item]')];
    expect(items.length).toBe(16);

    component.setHardwareCategory('printer');
    fixture.detectChanges();
    expect(items.filter((item) => !item.classList.contains('is-hidden')).length).toBe(2);

    component.setHardwareCategory('all');
    const select = host.querySelector<HTMLSelectElement>('[data-hardware-filters] select') as HTMLSelectElement;
    expect(select.closest('label')?.querySelector('span')?.textContent?.trim()).toBe('Filter by');
    expect([...select.options].map((option) => option.text.trim()))
      .toEqual([
        'All', 'Tablet', '10 inch', '15.6 inch', 'Accessories / Other',
        'With printer', 'With customer display'
      ]);
    select.value = 'printer';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(items.filter((item) => !item.classList.contains('is-hidden')).length).toBe(3);

    select.value = 'customer-display';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(items.filter((item) => !item.classList.contains('is-hidden')).length).toBe(6);

    select.value = '15.6';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(items.filter((item) => !item.classList.contains('is-hidden')).length).toBe(9);
  });
});
