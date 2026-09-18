import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHardwareComponent } from './pos-hardware-machine-receipt-printer.component'; 

describe('CustomHardwareComponent', () => {
  let component: CustomHardwareComponent;
  let fixture: ComponentFixture<CustomHardwareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomHardwareComponent]
    });
    fixture = TestBed.createComponent(CustomHardwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
