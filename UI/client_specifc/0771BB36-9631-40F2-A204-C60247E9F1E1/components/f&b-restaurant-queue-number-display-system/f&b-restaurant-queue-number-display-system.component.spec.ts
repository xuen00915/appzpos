import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent } from '../solution-page/solution-page.component';

import { CustomQueueSystemComponent } from './f&b-restaurant-queue-number-display-system.component'; 

describe('CustomQueueSystemComponent', () => {
  let component: CustomQueueSystemComponent;
  let fixture: ComponentFixture<CustomQueueSystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent],
      declarations: [CustomQueueSystemComponent]
    });
    fixture = TestBed.createComponent(CustomQueueSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the queue island in the shared solution hero', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('.solution-island-hero');
    expect(hero?.querySelector('img')?.getAttribute('src')).toBe('assets/images/ecosystem/ecosystem-queue.webp');
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('Restaurant Queue Management System with APPZPOS Queue Number Display');
  });
});
