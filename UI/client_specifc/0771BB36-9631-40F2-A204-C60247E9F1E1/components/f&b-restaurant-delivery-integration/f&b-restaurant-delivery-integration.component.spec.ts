import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderHubComponent } from './f&b-restaurant-delivery-integration.component'; 

describe('CustomOrderHubComponent', () => {
  let component: CustomOrderHubComponent;
  let fixture: ComponentFixture<CustomOrderHubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomOrderHubComponent]
    });
    fixture = TestBed.createComponent(CustomOrderHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
