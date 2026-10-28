import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../../../src/app/services/shared_function/api.service';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { CustomRequestDemoComponent } from '../custom-request-demo/custom-request-demo.component';
import { IndustryPageComponent } from '../industry-page/industry-page.component';
import { CustomIndustryRestaurantComponent } from './f&b-restaurant-cloud-pos-system.component';

describe('F&B industry page static service modes', () => {
  let fixture: ComponentFixture<CustomIndustryRestaurantComponent>;
  let root: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
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
    root = fixture.nativeElement;
  });

  afterEach(() => fixture.destroy());

  it('shows Restaurant and Quick Service steps without mode graphics or animation handoff', () => {
    expect(root.querySelector('.restaurant-scroll__mode')?.textContent).toContain('Restaurant Mode');
    expect(root.querySelector('.quick-service-desktop')?.textContent).toContain('Quick Service Mode');
    expect(root.querySelectorAll('.restaurant-scroll .restaurant-procedure').length).toBe(5);
    expect(root.querySelectorAll('.quick-service-desktop .restaurant-procedure').length).toBe(5);

    for (const selector of [
      '.restaurant-overview__visual',
      '.restaurant-scroll__diagram',
      '.quick-service-diagram',
      '.restaurant-mode__markers',
      '.quick-service-markers'
    ]) {
      expect(root.querySelector(selector)).withContext(`${selector} is removed`).toBeNull();
    }

    for (const selector of ['.restaurant-scroll__mode', '.quick-service-desktop']) {
      const mode = root.querySelector(selector)!;
      expect(mode.querySelector('img')).withContext(`${selector} has no graphic`).toBeNull();
      expect(mode.querySelector('svg')).withContext(`${selector} has no graphic`).toBeNull();
      expect(mode.querySelector('app-industry-islands')).withContext(`${selector} has no interactive map`).toBeNull();
    }

    expect(getComputedStyle(root.querySelector('.restaurant-mode__timeline')!).position).toBe('static');
    expect(getComputedStyle(root.querySelector('.quick-service-timeline')!).position).toBe('static');
  });
});
