import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWebsiteOrderComponent } from './f&b-restaurant-online-ordering-website.component'; 

describe('CustomWebsiteOrderComponent', () => {
  let component: CustomWebsiteOrderComponent;
  let fixture: ComponentFixture<CustomWebsiteOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomWebsiteOrderComponent]
    });
    fixture = TestBed.createComponent(CustomWebsiteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
