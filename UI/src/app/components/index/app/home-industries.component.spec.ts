import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeIndustriesComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component';
import { ENGLISH_HOME_INDUSTRIES_CONFIG } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-sections.en';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('HomeIndustriesComponent', () => {
  let fixture: ComponentFixture<HomeIndustriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeIndustriesComponent],
      imports: [CommonModule],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomeIndustriesComponent);
    fixture.componentInstance.config = ENGLISH_HOME_INDUSTRIES_CONFIG;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('keeps all four industries and their wording, imagery and links', () => {
    const root = fixture.nativeElement as HTMLElement;
    const slides = Array.from(root.querySelectorAll('.industries__active'));
    expect(slides.length).toBe(4);
    fixture.componentInstance.stories.forEach((story, index) => {
      expect(slides[index].querySelector('h3')!.textContent).toBe(story.title);
      expect(slides[index].querySelector('.industries__active-description')!.textContent).toBe(story.description);
      expect(slides[index].querySelector('a')!.getAttribute('href')).toBe(story.href);
      const moreInfo = slides[index].querySelector<HTMLAnchorElement>('.industries__more-info')!;
      expect(moreInfo.textContent).toBe('More Info');
      expect(moreInfo.getAttribute('href')).toBe(story.href);
      expect(moreInfo.querySelector('span')).toBeNull();
      expect(getComputedStyle(moreInfo).backgroundColor).toBe('rgb(22, 136, 216)');
      expect(slides[index].querySelector('img')!.getAttribute('src')).toBe('/images/' + story.image);
      expect(Array.from(slides[index].querySelectorAll('.industries__functions li')).map(li => li.getAttribute('data-module'))).toEqual([...story.modules]);
    });
    expect(root.querySelector('.industries__puzzle')).toBeNull();
  });

  it('keeps the top selector synchronized with swipe navigation without a bottom scrollbar', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.industries__controls')).toBeNull();
    expect(root.querySelector('input[type="range"]')).toBeNull();
    const buttons = root.querySelectorAll<HTMLButtonElement>('.industries__switcher button');
    buttons[3].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex).toBe(3);
    expect(root.querySelector('#industry-panel-salon')!.hasAttribute('inert')).toBeFalse();
    expect(root.querySelector('#industry-panel-restaurant')!.hasAttribute('inert')).toBeTrue();
    buttons[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex).toBe(2);
    const viewport = root.querySelector<HTMLElement>('.industries__viewport')!;
    // Scroll snapping uses fractional slide widths; clientWidth is integer-rounded.
    expect(Math.abs(viewport.scrollLeft - viewport.clientWidth * 2)).toBeLessThanOrEqual(2);
    expect(getComputedStyle(viewport).overflowX).toBe('auto');
    expect(getComputedStyle(viewport).getPropertyValue('scrollbar-width')).toBe('none');
    viewport.scrollLeft = viewport.clientWidth;
    viewport.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex).toBe(1);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex).toBe(3);
  });

  it('groups the industry selector buttons inside a rounded white container', () => {
    const root = fixture.nativeElement as HTMLElement;
    const container = root.querySelector<HTMLElement>('.industries__switcher')!;
    const styles = getComputedStyle(container);
    expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(styles.borderTopWidth).toBe('1px');
    expect(styles.borderRadius).toBe('18px');
    expect(container.querySelectorAll('button').length).toBe(4);
    expect(getComputedStyle(container.querySelector('button.is-active')!).backgroundColor).toBe('rgb(255, 240, 226)');
    expect(getComputedStyle(container.querySelector('button.is-active')!).color).toBe('rgb(138, 57, 15)');
  });

  it('centers the heading and places imagery beside desktop copy, above mobile copy', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    try {
      const doc = frame.contentDocument!;
      document.querySelectorAll('style').forEach(style => doc.head.appendChild(style.cloneNode(true)));
      doc.body.appendChild(fixture.nativeElement.cloneNode(true));
      for (const width of [1440, 1024, 820, 390, 320]) {
        frame.style.width = width + 'px';
        const section = doc.querySelector('.industries__experience')!.getBoundingClientRect();
        expect(section.right).toBeLessThanOrEqual(width);
        expect(section.left).toBeGreaterThanOrEqual(0);
        const image = doc.querySelector('.industries__active-media')!.getBoundingClientRect();
        const copy = doc.querySelector('.industries__active-copy')!.getBoundingClientRect();
        if (width > 900) expect(image.right).toBeLessThanOrEqual(copy.left + 1);
        else expect(image.bottom).toBeLessThanOrEqual(copy.top + 1);
        expect(frame.contentWindow!.getComputedStyle(doc.querySelector('.industries__intro')!).textAlign).toBe('center');
      }
    } finally { frame.remove(); }
  });

  it('renders only the supplied localized industries configuration', () => {
    (fixture.componentInstance as any).config = {
      eyebrow: '行业', title: '中文行业标题', description: '中文行业说明', moreInfoLabel: '了解更多',
      modules: [{ id: 'cn-pos', title: '中文收银系统' }],
      stories: [{ id: 'cn-sector', title: '中文行业', description: '中文行业内容', image: 'cn-sector.png', alt: '中文行业图', href: '/cn-sector', modules: ['cn-pos'] }]
    };
    fixture.componentInstance.activeIndex = 0;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.industries__active').length).toBe(1);
    expect(host.textContent).toContain('中文行业标题');
    expect(host.textContent).toContain('中文收银系统');
    expect(host.textContent).not.toContain('F&B Restaurant');
    expect(host.querySelector('.industries__more-info')?.textContent).toBe('了解更多');
  });
});
