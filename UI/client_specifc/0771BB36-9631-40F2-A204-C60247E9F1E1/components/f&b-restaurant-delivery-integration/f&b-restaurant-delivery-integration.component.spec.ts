import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent } from '../solution-page/solution-page.component';

import { CustomOrderHubComponent } from './f&b-restaurant-delivery-integration.component'; 

describe('CustomOrderHubComponent', () => {
  let component: CustomOrderHubComponent;
  let fixture: ComponentFixture<CustomOrderHubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent],
      declarations: [CustomOrderHubComponent]
    });
    fixture = TestBed.createComponent(CustomOrderHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the delivery island in the shared solution hero', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('.solution-island-hero');
    expect(hero?.querySelector('img')?.getAttribute('src')).toBe('assets/images/ecosystem/ecosystem-delivery.webp');
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('Centralized Delivery Platform Integration Through APPZPOS Order Hub');
  });
});
