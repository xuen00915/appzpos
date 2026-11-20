import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { CustomIndustryRestaurantComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-cloud-pos-system/f&b-restaurant-cloud-pos-system.component';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';
import { IndustryPageComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-page.component';
import { ApiService } from '../../../services/shared_function/api.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('F&B industry page static service modes', () => {
  it('keeps both five-step modes with step icons and no scroll handoff', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, IndustryPageComponent],
      declarations: [CustomIndustryRestaurantComponent, CustomRequestDemoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiService, useValue: {} },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) }) } }
      ]
    }).createComponent(CustomIndustryRestaurantComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.restaurant-scroll__mode')?.textContent).toContain('Restaurant Mode');
    expect(root.querySelector('.quick-service-desktop')?.textContent).toContain('Quick Service Mode');
    expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure').length).toBe(5);
    expect(root.querySelectorAll('.quick-service-desktop .restaurant-procedure').length).toBe(5);
    const modeGrid = root.querySelector('.service-mode-grid')!;
    expect(modeGrid.children.length).toBe(2);
    expect(modeGrid.children[0].classList).toContain('restaurant-scroll');
    expect(modeGrid.children[1].classList).toContain('quick-service-desktop');

    expect(root.querySelector<HTMLImageElement>('.restaurant-overview__diagram')?.getAttribute('src'))
      .toContain('APPZPOS-Restaurant-POS-System- Singapore-floorplan.png');
    expect(root.querySelectorAll('.restaurant-mode__timeline .restaurant-procedure__icon').length).toBe(5);
    expect(root.querySelectorAll('.quick-service-timeline .restaurant-procedure__icon').length).toBe(5);
    expect(root.querySelector('.service-mode__picture')).toBeNull();

    for (const selector of [
      '.restaurant-scroll__diagram',
      '.quick-service-diagram',
      '.restaurant-mode__markers',
      '.quick-service-markers'
    ]) {
      expect(root.querySelector(selector)).withContext(`${selector} is removed`).toBeNull();
    }

    for (const selector of ['.restaurant-scroll__mode', '.quick-service-desktop']) {
      const mode = root.querySelector(selector)!;
      expect(mode.querySelectorAll('.restaurant-procedure__icon').length)
        .withContext(`${selector} has one icon per step`).toBe(5);
      expect(mode.querySelector('svg')).withContext(`${selector} has no graphic`).toBeNull();
      expect(mode.querySelector('app-industry-islands')).withContext(`${selector} has no map`).toBeNull();
    }

    expect(getComputedStyle(root.querySelector('.restaurant-mode__timeline')!).position).toBe('static');
    expect(getComputedStyle(root.querySelector('.quick-service-timeline')!).position).toBe('static');
    expect(getComputedStyle(root.querySelector('.restaurant-procedure.is-active')!).backgroundColor)
      .toBe('rgb(255, 255, 255)');
    fixture.destroy();
  });
});
