import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPOSEWaiterComponent } from './cloud-pos-point-of-sales-system.component'; 

describe('CustomPOSEWaiterComponent', () => {
  let component: CustomPOSEWaiterComponent;
  let fixture: ComponentFixture<CustomPOSEWaiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPOSEWaiterComponent]
    });
    fixture = TestBed.createComponent(CustomPOSEWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
