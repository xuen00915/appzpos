import { SolutionBannerComponent } from '../solution-banner/solution-banner.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent } from '../solution-page/solution-page.component';

import { CustomSelfOrderKioskComponent } from './self-order-kiosk-restaurant.component'; 

describe('CustomSelfOrderKioskComponent', () => {
  let component: CustomSelfOrderKioskComponent;
  let fixture: ComponentFixture<CustomSelfOrderKioskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolutionBannerComponent, SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent],
      declarations: [CustomSelfOrderKioskComponent]
    });
    fixture = TestBed.createComponent(CustomSelfOrderKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the kiosk island in the shared solution hero', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('.solution-island-hero');
    expect(hero?.querySelector('img')?.getAttribute('src')).toBe('assets/images/ecosystem/ecosystem-kiosk.webp');
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('Self-Ordering Kiosks');
  });
});
