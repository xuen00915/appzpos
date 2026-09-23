import { TestBed } from '@angular/core/testing';
import { SolutionHardwareFiltersComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-page/solution-page.component';

describe('Shared solution hardware filters', () => {
  async function setup(count: number) {
    const grid = document.createElement('div');
    for (let index = 0; index < count; index++) {
      const card = document.createElement('a');
      card.href = `/hardware?product=${index}`;
      card.innerHTML = `<h4>${index % 2 ? '24” Stand Kiosk' : '16”, 21” Countertop Kiosk'}</h4>`;
      grid.append(card);
    }
    const fixture = TestBed.configureTestingModule({ imports: [SolutionHardwareFiltersComponent] })
      .createComponent(SolutionHardwareFiltersComponent);
    fixture.componentRef.setInput('grid', grid);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, grid };
  }

  for (const count of [0, 1, 5, 6]) {
    it(`shows controls only above five products (count ${count})`, async () => {
      const { fixture } = await setup(count);
      expect(!!fixture.nativeElement.querySelector('[data-hardware-filters]')).toBe(count > 5);
    });
  }

  it('filters categories and sizes without removing product links', async () => {
    const { fixture, grid } = await setup(6);
    const component = fixture.componentInstance;
    const originalLinks = Array.from(grid.children).map(el => el.getAttribute('href'));
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    buttons.find(button => button.textContent?.trim() === 'Stand')!.click();
    fixture.detectChanges();
    expect(grid.querySelectorAll('a:not(.is-hardware-filtered)').length).toBe(3);
    expect(fixture.nativeElement.querySelector('button[aria-pressed="true"]').textContent.trim()).toBe('Stand');
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '16';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.visibleCount).toBe(0);
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
    component.selectCategory('All');
    select.value = 'all';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(grid.querySelectorAll('a:not(.is-hardware-filtered)').length).toBe(6);
    expect(Array.from(grid.children).map(el => el.getAttribute('href'))).toEqual(originalLinks);
  });
});
