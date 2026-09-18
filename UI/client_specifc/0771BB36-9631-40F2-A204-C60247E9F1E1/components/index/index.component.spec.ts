import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHomeComponent } from './index.component'; 

describe('CustomHomeComponent', () => {
  let component: CustomHomeComponent;
  let fixture: ComponentFixture<CustomHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomHomeComponent]
    });
    fixture = TestBed.createComponent(CustomHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
