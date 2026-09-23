import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStorySectionsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-story-sections/home-story-sections.component';
import { HomeStorySectionConfig } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.models';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('HomeStorySectionsComponent', () => {
  let fixture: ComponentFixture<HomeStorySectionsComponent>;

  const sections: readonly HomeStorySectionConfig[] = [
    {
      id: 'first-story',
      title: '第一个故事',
      subtitle: '原有副标题',
      paragraphs: ['第一段原文。', '第二段原文。'],
      bullets: [{ label: '重点', text: '保留的要点' }],
      image: 'cn-first.png',
      imageAlt: '第一张图',
      imageWidth: 800,
      imageHeight: 600,
      imagePosition: 'right',
      cta: { kind: 'link', href: '/cn-first', label: '了解更多' }
    },
    {
      id: 'second-story',
      title: '第二个故事',
      paragraphs: ['另一段原文。'],
      image: 'cn-second.png',
      imageAlt: '第二张图',
      imageWidth: 960,
      imageHeight: 720,
      imagePosition: 'left'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeStorySectionsComponent],
      imports: [CommonModule],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ]
    });
    fixture = TestBed.createComponent(HomeStorySectionsComponent);
    fixture.componentInstance.sections = sections;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('renders only the supplied copy, bullets, CTA and intrinsic image dimensions', () => {
    const host = fixture.nativeElement as HTMLElement;
    const articles = Array.from(host.querySelectorAll<HTMLElement>('.home-story-section'));

    expect(articles.length).toBe(2);
    expect(host.textContent).toContain('第一个故事');
    expect(host.textContent).toContain('保留的要点');
    expect(host.textContent).not.toContain('Integrated POS System');
    expect(articles[0].querySelector('a')?.getAttribute('href')).toBe('/cn-first');
    const images = host.querySelectorAll<HTMLImageElement>('img');
    expect(images[0].getAttribute('src')).toBe('/images/cn-first.png');
    expect(images[0].getAttribute('width')).toBe('800');
    expect(images[0].getAttribute('height')).toBe('600');
    expect(images[0].getAttribute('loading')).toBe('lazy');
  });

  it('keeps image-first DOM order and alternates the desktop visual position', () => {
    const articles = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.home-story-section')
    );

    expect(articles[0].firstElementChild?.classList).toContain('home-story-section__media');
    expect(articles[1].firstElementChild?.classList).toContain('home-story-section__media');
    expect(articles[0].classList).toContain('is-image-right');
    expect(articles[1].classList).toContain('is-image-left');
  });

  it('uses two columns on desktop and image-above-copy on tablet and mobile', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    try {
      const doc = frame.contentDocument!;
      document.querySelectorAll('style').forEach(style => doc.head.appendChild(style.cloneNode(true)));
      doc.body.appendChild(fixture.nativeElement.cloneNode(true));
      const article = doc.querySelector<HTMLElement>('.home-story-section')!;
      const media = article.querySelector<HTMLElement>('.home-story-section__media')!;
      const copy = article.querySelector<HTMLElement>('.home-story-section__copy')!;
      for (const width of [1440, 820, 390]) {
        frame.style.width = width + 'px';
        const columns = frame.contentWindow!.getComputedStyle(article).gridTemplateColumns.split(' ').length;
        expect(columns).toBe(width > 900 ? 2 : 1);
        if (width <= 900) expect(media.getBoundingClientRect().bottom).toBeLessThanOrEqual(copy.getBoundingClientRect().top + 1);
      }
    } finally { frame.remove(); }
  });
});
