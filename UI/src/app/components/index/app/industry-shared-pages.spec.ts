import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { ApiService } from '../../../services/shared_function/api.service';
import { IndustryPageComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-page.component';
import { CustomIndustryRestoreStoreComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/retail-store-cloud-pos-system/retail-store-cloud-pos-system.component';
import { CustomIndustryBeautySalonsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/salon-cloud-pos-system/salon-cloud-pos-system.component';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';

describe('Shared Retail and Beauty industry template', () => {
  for (const page of [
    { component: CustomIndustryRestoreStoreComponent, title: 'Retail Store', steps: 3, cards: 3, image: 'APPZPOS-Point-of-Sale-Systems-for-Retail-floorpan.png' },
    { component: CustomIndustryBeautySalonsComponent, title: 'Spa & Salon', steps: 7, cards: 5, image: 'APPZPOS-POS-System-for-Beauty-Salon-floorplan.png' }
  ]) {
    it('renders the ' + page.title + ' workflow as a static numbered icon timeline', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CommonModule, ReactiveFormsModule, IndustryPageComponent],
        declarations: [CustomIndustryRestoreStoreComponent, CustomIndustryBeautySalonsComponent, CustomRequestDemoComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {provide: CommonFunctionService, useValue: {BindURL_Image: (name: string) => '/images/' + name}},
          {provide: ApiService, useValue: {}}, {provide: MatDialog, useValue: {}}
        ]
      }).createComponent(page.component as typeof CustomIndustryRestoreStoreComponent);
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      expect(root.querySelectorAll('.industry-static-timeline__step').length).toBe(page.steps);
      expect(root.querySelectorAll('.industry-static-timeline__heading i').length).toBe(page.steps);
      expect(root.querySelectorAll('.industry-static-timeline__step p').length).toBe(page.steps);
      expect(root.querySelector('.industry-static-timeline__number')?.textContent?.trim()).toBe('01');
      expect(root.querySelector('app-industry-islands')).toBeNull();
      fixture.destroy();
    });

    it('preserves ' + page.title + ' content and gives its own islands a responsive workflow', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CommonModule, ReactiveFormsModule, IndustryPageComponent],
        declarations: [CustomIndustryRestoreStoreComponent, CustomIndustryBeautySalonsComponent, CustomRequestDemoComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {provide: CommonFunctionService, useValue: {BindURL_Image: (name: string) => '/images/' + name}},
          {provide: ApiService, useValue: {}},
          {provide: MatDialog, useValue: {}}
        ]
      }).createComponent(page.component as typeof CustomIndustryRestoreStoreComponent);
      fixture.detectChanges();
      const root: HTMLElement = fixture.nativeElement;
      expect(root.querySelectorAll('h1').length).toBe(1);
      expect(root.querySelector('h1')?.textContent).toContain(page.title);
      expect(root.querySelector('app-industry-page')).not.toBeNull();
      expect(root.querySelector('.restaurant-overview__diagram')?.getAttribute('src')).toContain(page.image);
      expect(root.querySelectorAll('.industry-static-timeline__step').length).toBe(page.steps);
      expect(root.querySelectorAll('.solution-sign').length).toBe(page.cards);
      const solution = root.querySelector<HTMLElement>('.solution-sign')!;
      const solutionButton = solution.querySelector<HTMLButtonElement>('button')!;
      expect(solutionButton).not.toBeNull();
      solution.dispatchEvent(new FocusEvent('focusin', {bubbles: true}));
      fixture.detectChanges();
      expect(solution.classList.contains('is-open')).toBeTrue();
      solution.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
      fixture.detectChanges();
      expect(solution.classList.contains('is-open')).toBeFalse();
      solutionButton.click(); fixture.detectChanges();
      expect(solution.classList.contains('is-open')).toBeTrue();
      solution.dispatchEvent(new FocusEvent('focusout', {bubbles: true}));
      fixture.detectChanges();
      expect(solution.classList.contains('is-open')).toBeFalse();
      expect(root.querySelectorAll('.solution-sign__detail a').length).toBe(0);
      expect(root.querySelector('app-industry-islands')).toBeNull();
      expect(root.querySelector('#requestdemo app-custom-request-demo form')).not.toBeNull();
      const frame = document.createElement('iframe');
      document.body.appendChild(frame);
      try {
        const doc = frame.contentDocument!;
        document.querySelectorAll('style').forEach(style => doc.head.appendChild(style.cloneNode(true)));
        doc.body.appendChild(root.cloneNode(true));
        for (const width of [1920, 1366, 1280, 1024, 820, 768, 390, 320]) {
          frame.style.width = width + 'px'; frame.style.height = '900px';
          expect(doc.documentElement.scrollWidth).withContext(page.title + ' overflow at ' + width).toBeLessThanOrEqual(width);
          const hero = doc.querySelector('.restaurant-hero__inner')!.getBoundingClientRect();

          if (width < 768) {
          const heroArea = doc.querySelector('.restaurant-hero')!.getBoundingClientRect();
          const photo = doc.querySelector('.restaurant-hero__photo')!;
          const photoStyle = frame.contentWindow!.getComputedStyle(photo);
          expect(photoStyle.position).toBe('absolute');
          expect(Number(photoStyle.opacity)).toBe(.18);
          expect(photo.getBoundingClientRect().height).toBeCloseTo(heroArea.height, 0);
          expect(photo.getBoundingClientRect().width).toBeCloseTo(heroArea.width, 0);
        }
          const cards = Array.from(doc.querySelectorAll('.solution-sign')).map(card => card.getBoundingClientRect());
          const columns = width >= 992 ? 3 : width >= 600 ? 2 : 1;
          expect(cards.filter(card => Math.abs(card.top - cards[0].top) < 1).length).toBe(columns);
          const lastRow = cards.filter(card => Math.abs(card.top - cards[cards.length - 1].top) < 1);
          const wall = doc.querySelector('.solution-wall')!.getBoundingClientRect();
          expect((lastRow[0].left + lastRow[lastRow.length - 1].right) / 2).toBeCloseTo((wall.left + wall.right) / 2, 0);
          if (page.title === 'Retail Store') {
            const image = doc.querySelector('.solution-sign__image')!;
            expect(image.getBoundingClientRect().width).toBeCloseTo(cards[0].width, 0);
            expect(frame.contentWindow!.getComputedStyle(image).objectFit).toBe('cover');
          }
          for (const selector of ['.restaurant-scroll__intro', '.pos-solutions', '#requestdemo']) {
            const bounds = doc.querySelector(selector)!.getBoundingClientRect();
            expect(bounds.width).withContext(selector + ' at ' + width).toBeCloseTo(hero.width, 0);
          }
          const timeline = doc.querySelector('.industry-static-timeline')!.getBoundingClientRect();
          expect(timeline.width).toBeLessThanOrEqual(Math.min(820, hero.width));
          expect((timeline.left + timeline.right) / 2).toBeCloseTo((hero.left + hero.right) / 2, 0);
        }
      } finally { frame.remove(); fixture.destroy(); }
    });
  }
});
