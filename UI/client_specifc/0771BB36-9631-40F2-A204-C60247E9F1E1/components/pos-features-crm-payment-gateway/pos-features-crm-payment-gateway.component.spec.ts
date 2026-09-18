import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFeaturesComponent } from './pos-features-crm-payment-gateway.component'; 

describe('CustomFeaturesComponent', () => {
  let component: CustomFeaturesComponent;
  let fixture: ComponentFixture<CustomFeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomFeaturesComponent]
    });
    fixture = TestBed.createComponent(CustomFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
