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
    imageHeight: 478,
    scrollTargetId: 'content',
    scrollLabel: 'Explore APPZPOS POS features',
    integrationTargetId: 'pos-integrations',
    integrationMobileTargetId: 'pos-integrations-mobile',
    integrationLabel: 'Explore APPZPOS platform integrations',
    deviceLinks: [
      {
        id: 'tablet',
        targetId: 'pos-tablet',
        mobileTargetId: 'pos-tablet-mobile',
        label: 'Explore Tablet POS System on iPad and E-Waiter'
      },
      {
        id: 'cloud',
        targetId: 'pos-cloud',
        mobileTargetId: 'pos-cloud-mobile',
        label: 'Explore Powerful Cloud POS System'
      }
    ]
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
    expect(image?.closest('a')?.getAttribute('href')).toBe('#content');
    expect(image?.closest('a')?.getAttribute('aria-label')).toBe('Explore APPZPOS POS features');
    expect(section?.querySelector('.appz-solution-hero__integration-link')?.getAttribute('href'))
      .toBe('#pos-integrations');
    expect(section?.querySelector('.appz-solution-hero__integration-link')?.getAttribute('aria-label'))
      .toBe('Explore APPZPOS platform integrations');
    expect(Array.from(section?.querySelectorAll('[data-solution-device]') ?? []).map((link) => link.getAttribute('href')))
      .toEqual(['#pos-tablet', '#pos-cloud']);
  });

  it('keeps image before title in mobile reading order', () => {
    const host = fixture.nativeElement as HTMLElement;
    const image = host.querySelector('img') as Node;
    const title = host.querySelector('h1') as Node;

    expect(image.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('scrolls to the configured solution content when the illustration is activated', () => {
    const target = document.createElement('div');
    target.id = config.scrollTargetId;
    target.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(target);

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLAnchorElement>('.appz-solution-hero__visual-link')
      ?.click();

    expect(target.scrollIntoView).toHaveBeenCalled();
    target.remove();
  });

  it('scrolls to the integration section when the floating screen is activated', () => {
    const target = document.createElement('div');
    const mobileTarget = document.createElement('div');
    const scrollSpy = jasmine.createSpy('scrollIntoView');
    target.id = config.integrationTargetId;
    mobileTarget.id = config.integrationMobileTargetId;
    target.scrollIntoView = scrollSpy;
    mobileTarget.scrollIntoView = scrollSpy;
    document.body.append(target, mobileTarget);

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLAnchorElement>('.appz-solution-hero__integration-link')
      ?.click();

    expect(scrollSpy).toHaveBeenCalled();
    target.remove();
    mobileTarget.remove();
  });

  it('scrolls each device hotspot to its matching POS section', () => {
    const targets = config.deviceLinks.flatMap((link) => [link.targetId, link.mobileTargetId])
      .map((id) => {
        const target = document.createElement('div');
        target.id = id;
        target.scrollIntoView = jasmine.createSpy(`scroll-${id}`);
        document.body.appendChild(target);
        return target;
      });

    const links = (fixture.nativeElement as HTMLElement)
      .querySelectorAll<HTMLAnchorElement>('[data-solution-device]');
    links.forEach((link) => link.click());

    expect(targets.filter((target) => (target.scrollIntoView as jasmine.Spy).calls.any()).length).toBe(2);
    targets.forEach((target) => target.remove());
  });
});
