import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHomeCNComponent } from './cn-f&b-restaurant-cloud-pos-system.component'; 

describe('CustomHomeCNComponent', () => {
  let component: CustomHomeCNComponent;
  let fixture: ComponentFixture<CustomHomeCNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomHomeCNComponent]
    });
    fixture = TestBed.createComponent(CustomHomeCNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
