import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomKitchenDisplaySystemComponent } from './f&b-restaurant-kitchen-display-system.component'; 

describe('CustomKitchenDisplaySystemComponent', () => {
  let component: CustomKitchenDisplaySystemComponent;
  let fixture: ComponentFixture<CustomKitchenDisplaySystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomKitchenDisplaySystemComponent]
    });
    fixture = TestBed.createComponent(CustomKitchenDisplaySystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
