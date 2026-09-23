import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeProofComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof/home-proof.component';
import { ENGLISH_HOME_PROOF_CONFIG } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-proof.en';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('HomeProofComponent', () => {
  let fixture: ComponentFixture<HomeProofComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeProofComponent],
      imports: [CommonModule],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomeProofComponent);
    fixture.componentInstance.config = ENGLISH_HOME_PROOF_CONFIG;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('shows all four customer comments as cards with a centered introduction', () => {
    const host = fixture.nativeElement as HTMLElement;
    const layout = host.querySelector('.proof__testimonial-layout');

    expect(layout?.querySelector('.proof__intro')).not.toBeNull();
    expect(layout?.querySelector('.proof__quote-card')).not.toBeNull();
    expect(layout?.querySelectorAll('.proof__quote-card').length).toBe(4);
    expect(getComputedStyle(host.querySelector('.proof__intro')!).textAlign).toBe('center');
    expect(layout?.querySelector<HTMLAnchorElement>('.proof__review-link')?.getAttribute('href'))
      .toBe('https://g.page/r/CZDr77wgfEgaEAI/review');
    expect(layout?.querySelector('.proof__review-link')?.textContent).toBe('Leave Us a Review');
    expect(layout?.querySelector('.proof__review-link span')).toBeNull();
    expect(getComputedStyle(host.querySelector('.proof__review-link')!).borderRadius).toBe('999px');
    expect(layout?.querySelector<HTMLImageElement>('.proof__customer-logo')?.getAttribute('src'))
      .toBe('/images/APPZPOS-Pos-System-Singapore-Bar-Stories.png');
  });

  it('clamps each comment to four lines and expands only the selected comment', () => {
    const host = fixture.nativeElement as HTMLElement;
    const controls = Array.from(host.querySelectorAll<HTMLButtonElement>('.proof__show-more'));
    const quotes = Array.from(host.querySelectorAll<HTMLElement>('blockquote'));
    expect(controls.length).toBe(4);
    for (const quote of quotes) {
      expect(getComputedStyle(quote).webkitLineClamp).toBe('4');
    }
    expect(controls.every(button => button.getAttribute('aria-expanded') === 'false')).toBeTrue();

    controls[1].click();
    fixture.detectChanges();

    expect(controls[1].getAttribute('aria-expanded')).toBe('true');
    expect(controls[1].textContent).toBe('Show less');
    expect(quotes[1].classList.contains('is-expanded')).toBeTrue();
    expect(quotes[0].classList.contains('is-expanded')).toBeFalse();
    expect(quotes[1].textContent).toBe(fixture.componentInstance.testimonials[1].quote);
    controls[1].click();
    fixture.detectChanges();
    expect(controls[1].getAttribute('aria-expanded')).toBe('false');
    expect(controls[1].textContent).toBe('Show more');
  });

  it('uses four desktop, two tablet and one mobile columns without overflowing', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    try {
      const doc = frame.contentDocument!;
      document.querySelectorAll('style').forEach(style => doc.head.appendChild(style.cloneNode(true)));
      doc.body.appendChild(fixture.nativeElement.cloneNode(true));
      for (const [width, columns] of [[1440, 4], [1024, 4], [820, 2], [390, 1], [320, 1]]) {
        frame.style.width = width + 'px';
        const grid = doc.querySelector<HTMLElement>('.proof__testimonial-grid')!;
        expect(frame.contentWindow!.getComputedStyle(grid).gridTemplateColumns.split(' ').length)
          .withContext('Columns at ' + width).toBe(columns);
        expect(grid.getBoundingClientRect().right).toBeLessThanOrEqual(width);
        const dialog = doc.querySelector<HTMLDialogElement>('dialog')!;
        dialog.showModal();
        const logoGrid = dialog.querySelector<HTMLElement>('.proof__all-customers')!;
        expect(frame.contentWindow!.getComputedStyle(logoGrid).gridTemplateColumns.split(' ').length)
          .withContext('Popup logo columns at ' + width).toBe(width > 767 ? 5 : width > 575 ? 3 : 2);
        expect(dialog.getBoundingClientRect().right).toBeLessThanOrEqual(width);
        dialog.close();
        for (const row of Array.from(doc.querySelectorAll('.proof__customer-row'))) {
          expect(frame.contentWindow!.getComputedStyle(row).backgroundColor).toBe('rgb(255, 255, 255)');
          expect(row.getBoundingClientRect().right).toBeLessThanOrEqual(width);
        }
        const cards = Array.from(grid.querySelectorAll<HTMLElement>('.proof__quote-card'));
        const heights = cards.map(card => card.getBoundingClientRect().height);
        for (let first = 0; first < cards.length; first += columns) {
          const tops = cards.slice(first, first + columns).map(card => card.querySelector('footer strong')!.getBoundingClientRect().top);
          expect(Math.max(...tops) - Math.min(...tops)).withContext('Aligned commenter names at ' + width).toBeLessThan(1);
        }
        expect(Math.max(...heights) - Math.min(...heights)).withContext('Equal card heights at ' + width).toBeLessThan(1);
        const quoteToExpand = cards[0].querySelector('blockquote')!;
        quoteToExpand.classList.add('is-expanded');
        const expandedHeights = cards.map(card => card.getBoundingClientRect().height);
        expect(Math.max(...expandedHeights) - Math.min(...expandedHeights)).withContext('Equal expanded heights at ' + width).toBeLessThan(1);
        quoteToExpand.classList.remove('is-expanded');
        for (const quote of Array.from(doc.querySelectorAll<HTMLElement>('blockquote'))) {
          expect(quote.scrollHeight).toBeGreaterThan(quote.clientHeight);
        }
      }
    } finally { frame.remove(); }
  });

  it('displays all 76 original logos across three scrolling rows', () => {
    const host = fixture.nativeElement as HTMLElement;
    const title = host.querySelector<HTMLHeadingElement>('h2#customers-title')!;
    expect(title.textContent).toBe('Our Valued Customers');
    expect(getComputedStyle(title).textAlign).toBe('center');
    expect(getComputedStyle(title).fontSize).toBe(getComputedStyle(host.querySelector('.proof__intro h2')!).fontSize);
    const grid = host.querySelector<HTMLElement>('.proof__customer-panel');
    const customers = Array.from(grid?.querySelectorAll('.proof__customer-group:not([aria-hidden]) img') ?? []);

    expect(grid).not.toBeNull();
    expect(grid?.querySelectorAll('.proof__customer-row').length).toBe(3);
    expect(customers.length).toBe(76);
    expect(new Set(customers.map(image => image.getAttribute('src'))).size).toBe(76);
    expect(grid?.querySelectorAll('[aria-hidden="true"] img').length).toBe(76);
    expect(fixture.componentInstance.customerRows.map(row => row.length)).toEqual([26, 25, 25]);
  });

  it('opens all 76 logos in a modal and closes it again', () => {
    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector<HTMLButtonElement>('.proof__show-all')!;
    const dialog = host.querySelector<HTMLDialogElement>('dialog')!;
    expect(host.querySelector('.proof__pause')).toBeNull();
    expect(dialog.open).toBeFalse();
    button.click();
    fixture.detectChanges();
    expect(dialog.open).toBeTrue();
    expect(dialog.querySelectorAll('.proof__all-customers img').length).toBe(76);
    dialog.querySelector<HTMLButtonElement>('.proof__dialog-close')!.click();
    fixture.detectChanges();
    expect(dialog.open).toBeFalse();
  });

  it('renders supplied localized customers once before animation duplication and omits empty testimonials', () => {
    (fixture.componentInstance as any).config = {
      customersTitle: '中文客户', showAllLabel: '查看全部', customers: [
        { image: 'cn-a.png', alt: '客户甲' },
        { image: 'cn-b.png', alt: '客户乙' },
        { image: 'cn-c.png', alt: '客户丙' }
      ],
      testimonials: []
    };
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const originals = host.querySelectorAll('.proof__customer-group:not([aria-hidden]) img');
    const duplicates = host.querySelectorAll('.proof__customer-group[aria-hidden="true"] img');
    expect(host.textContent).toContain('中文客户');
    expect(host.textContent).not.toContain('Our Valued Customers');
    expect(originals.length).toBe(3);
    expect(duplicates.length).toBe(3);
    expect(host.querySelector('.proof__testimonial-layout')).toBeNull();
  });

  it('can render customers and reviews as separate homepage sections', () => {
    const component = fixture.componentInstance as any;
    const host = fixture.nativeElement as HTMLElement;

    component.mode = 'customers';
    fixture.detectChanges();
    expect(host.querySelector('.proof__customers')).not.toBeNull();
    expect(host.querySelector('.proof__testimonial-layout')).toBeNull();
    expect(host.querySelector('section')?.dataset['homeSection']).toBe('customers');

    component.mode = 'reviews';
    fixture.detectChanges();
    expect(host.querySelector('.proof__customers')).toBeNull();
    expect(host.querySelector('.proof__customer-dialog')).toBeNull();
    expect(host.querySelector('.proof__testimonial-layout')).not.toBeNull();
    expect(host.querySelector('section')?.dataset['homeSection']).toBe('reviews');
  });
});
