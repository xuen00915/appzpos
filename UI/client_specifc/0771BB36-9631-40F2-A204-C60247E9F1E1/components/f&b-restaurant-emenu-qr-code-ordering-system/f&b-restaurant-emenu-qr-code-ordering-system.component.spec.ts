import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQROrderComponent } from './f&b-restaurant-emenu-qr-code-ordering-system.component'; 

describe('CustomQROrderComponent', () => {
  let component: CustomQROrderComponent;
  let fixture: ComponentFixture<CustomQROrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomQROrderComponent]
    });
    fixture = TestBed.createComponent(CustomQROrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
