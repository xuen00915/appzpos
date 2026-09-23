import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent } from '../solution-page/solution-page.component';

import { CustomKitchenDisplaySystemComponent } from './f&b-restaurant-kitchen-display-system.component'; 

describe('CustomKitchenDisplaySystemComponent', () => {
  let component: CustomKitchenDisplaySystemComponent;
  let fixture: ComponentFixture<CustomKitchenDisplaySystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent],
      declarations: [CustomKitchenDisplaySystemComponent]
    });
    fixture = TestBed.createComponent(CustomKitchenDisplaySystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the kitchen island in the shared solution hero', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('.solution-island-hero');
    expect(hero?.querySelector('img')?.getAttribute('src')).toBe('assets/images/ecosystem/ecosystem-kitchen.webp');
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('APPZPOS Kitchen Order Display System for Restaurants');
  });
});
