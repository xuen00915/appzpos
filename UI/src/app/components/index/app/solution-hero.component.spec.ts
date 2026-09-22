import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  SolutionHeroComponent,
  SolutionHeroConfig
} from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component';

describe('SolutionHeroComponent', () => {
  let fixture: ComponentFixture<SolutionHeroComponent>;

  const config: SolutionHeroConfig = {
    headingId: 'test-solution-title',
    title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
    imageSrc: 'assets/images/ecosystem/test-solution.webp',
    imageAlt: 'Waiter serving a table beside an APPZPOS counter POS',
    imageWidth: 727,
    imageHeight: 478
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [SolutionHeroComponent] });
    fixture = TestBed.createComponent(SolutionHeroComponent);
    fixture.componentInstance.config = config;
    fixture.detectChanges();
  });

  it('renders one accessible H1 and configured intrinsic image data', () => {
    const host = fixture.nativeElement as HTMLElement;
    const section = host.querySelector<HTMLElement>('[data-solution-hero]');
    const title = section?.querySelector<HTMLHeadingElement>('h1');
    const image = section?.querySelector<HTMLImageElement>('img');

    expect(section?.getAttribute('aria-labelledby')).toBe(config.headingId);
    expect(title?.id).toBe(config.headingId);
    expect(title?.textContent?.trim()).toBe(config.title);
    expect(title?.innerHTML).toBe(config.title);
    expect(host.querySelectorAll('h1').length).toBe(1);
    expect(image?.getAttribute('src')).toBe(config.imageSrc);
    expect(image?.alt).toBe(config.imageAlt);
    expect(image?.getAttribute('width')).toBe('727');
    expect(image?.getAttribute('height')).toBe('478');
  });

  it('keeps image before title in mobile reading order', () => {
    const host = fixture.nativeElement as HTMLElement;
    const image = host.querySelector('img') as Node;
    const title = host.querySelector('h1') as Node;

    expect(image.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
