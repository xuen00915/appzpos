import { IndustryWorkflowDirective } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-workflow.directive';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { ApiService } from '../../../services/shared_function/api.service';
import { IndustryPageComponent, IndustryIslandsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-page.component';
import { CustomIndustryRestoreStoreComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/retail-store-cloud-pos-system/retail-store-cloud-pos-system.component';
import { CustomIndustryBeautySalonsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/salon-cloud-pos-system/salon-cloud-pos-system.component';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';

describe('Shared Retail and Beauty industry template', () => {
  for (const page of [
    { component: CustomIndustryRestoreStoreComponent, title: 'Retail Store', steps: 3, cards: 3, image: 'APPZPOS-Point-of-Sale-Systems-for-Retail-floorpan.png' },
    { component: CustomIndustryBeautySalonsComponent, title: 'Spa & Salon', steps: 7, cards: 5, image: 'APPZPOS-POS-System-for-Beauty-Salon-floorplan.png' }
  ]) {
    it('focuses the correct ' + page.title + ' island on scroll and keeps every description visible', fakeAsync(() => {
      const fixture = TestBed.configureTestingModule({
        imports: [CommonModule, ReactiveFormsModule, IndustryPageComponent, IndustryIslandsComponent, IndustryWorkflowDirective],
        declarations: [CustomIndustryRestoreStoreComponent, CustomIndustryBeautySalonsComponent, CustomRequestDemoComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {provide: CommonFunctionService, useValue: {BindURL_Image: (name: string) => '/images/' + name}},
          {provide: ApiService, useValue: {}}, {provide: MatDialog, useValue: {}}
        ]
      }).createComponent(page.component as typeof CustomIndustryRestoreStoreComponent);
      fixture.detectChanges();
      const flowElement = fixture.debugElement.query(By.directive(IndustryWorkflowDirective));
      const flow = flowElement.injector.get(IndustryWorkflowDirective);
      spyOn(flowElement.nativeElement, 'getBoundingClientRect').and.returnValue({top: 100, bottom: 1800});
      const items: HTMLElement[] = Array.from(flowElement.nativeElement.querySelectorAll('.restaurant-procedure'));
      const positions = items.map((item, index) => spyOn(item, 'getBoundingClientRect').and.returnValue({top: index * 1000} as DOMRect));
      tick(20); fixture.detectChanges();
      expect(flow.activeStep).toBe(0);
      positions[1].and.returnValue({top: 100} as DOMRect);
      flow.schedule(); tick(20); fixture.detectChanges();
      expect(flow.activeStep).toBe(1);
      const islands = fixture.debugElement.query(By.directive(IndustryIslandsComponent)).componentInstance as IndustryIslandsComponent;
      expect(islands.focusId).toBe(flow.compact ? '' : fixture.componentInstance.procedureFocusIds[1]);
      expect(items.every(item => !item.querySelector('[hidden]'))).toBeTrue();
      fixture.destroy();
    }));

    it('preserves ' + page.title + ' content and gives its own islands a responsive workflow', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CommonModule, ReactiveFormsModule, IndustryPageComponent, IndustryIslandsComponent, IndustryWorkflowDirective],
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
      expect(root.querySelectorAll('.restaurant-procedure').length).toBe(page.steps);
      expect(root.querySelectorAll('.restaurant-procedure [hidden]').length).toBe(0);
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
      expect(root.querySelectorAll('app-industry-islands .industry-island').length).toBeGreaterThanOrEqual(4);
      expect(root.querySelector('#requestdemo app-custom-request-demo form')).not.toBeNull();
      for (let index = 1; index <= page.steps; index++) {
        expect(root.querySelector('#ptab' + index)).not.toBeNull();
      }
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
          for (const selector of ['.restaurant-scroll__intro', '.restaurant-scroll', '.pos-solutions', '#requestdemo']) {
            const bounds = doc.querySelector(selector)!.getBoundingClientRect();
            expect(bounds.width).withContext(selector + ' at ' + width).toBeCloseTo(hero.width, 0);
          }
          if (width < 992) {
            expect(frame.contentWindow!.getComputedStyle(doc.querySelector('.restaurant-scroll__diagram')!).display).toBe('none');
          }
        }
      } finally { frame.remove(); fixture.destroy(); }
    });
  }
});
