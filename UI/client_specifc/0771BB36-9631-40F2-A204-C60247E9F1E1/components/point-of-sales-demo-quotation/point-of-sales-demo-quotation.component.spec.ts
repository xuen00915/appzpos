import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomContactComponent } from './point-of-sales-demo-quotation.component'; 

describe('CustomHomeComponent', () => {
  let component: CustomContactComponent;
  let fixture: ComponentFixture<CustomContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomContactComponent]
    });
    fixture = TestBed.createComponent(CustomContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
