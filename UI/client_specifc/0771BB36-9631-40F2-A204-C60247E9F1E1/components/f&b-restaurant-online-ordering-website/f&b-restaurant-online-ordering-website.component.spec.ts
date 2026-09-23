import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent } from '../solution-page/solution-page.component';

import { CustomWebsiteOrderComponent } from './f&b-restaurant-online-ordering-website.component'; 

describe('CustomWebsiteOrderComponent', () => {
  let component: CustomWebsiteOrderComponent;
  let fixture: ComponentFixture<CustomWebsiteOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent],
      declarations: [CustomWebsiteOrderComponent]
    });
    fixture = TestBed.createComponent(CustomWebsiteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the website island in the shared solution hero', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('.solution-island-hero');
    expect(hero?.querySelector('img')?.getAttribute('src')).toBe('assets/images/ecosystem/ecosystem-website-ordering.webp');
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('APPZPOS Online Website Ordering System');
  });
});
