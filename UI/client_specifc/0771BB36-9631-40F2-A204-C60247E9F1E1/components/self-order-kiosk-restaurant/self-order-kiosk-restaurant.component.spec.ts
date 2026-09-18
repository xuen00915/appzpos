import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelfOrderKioskComponent } from './self-order-kiosk-restaurant.component'; 

describe('CustomSelfOrderKioskComponent', () => {
  let component: CustomSelfOrderKioskComponent;
  let fixture: ComponentFixture<CustomSelfOrderKioskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomSelfOrderKioskComponent]
    });
    fixture = TestBed.createComponent(CustomSelfOrderKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
