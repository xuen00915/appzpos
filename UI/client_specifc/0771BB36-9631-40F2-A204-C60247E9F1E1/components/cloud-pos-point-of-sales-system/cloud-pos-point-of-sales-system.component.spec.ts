import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPOSEWaiterComponent } from './cloud-pos-point-of-sales-system.component';
import { SolutionHeroComponent } from '../solution-hero/solution-hero.component';

describe('CustomPOSEWaiterComponent', () => {
  let component: CustomPOSEWaiterComponent;
  let fixture: ComponentFixture<CustomPOSEWaiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPOSEWaiterComponent, SolutionHeroComponent]
    });
    fixture = TestBed.createComponent(CustomPOSEWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the POS island in the shared solution hero', () => {
    const hero = (fixture.nativeElement as HTMLElement).querySelector('[data-solution-hero]');
    expect(hero?.querySelector('img')?.getAttribute('src')).toBe('assets/images/ecosystem/ecosystem-pos-ewaiter.webp');
    expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('APPZPOS Cutting-Edge POS Point of Sales and E-Menu System');
  });
});
