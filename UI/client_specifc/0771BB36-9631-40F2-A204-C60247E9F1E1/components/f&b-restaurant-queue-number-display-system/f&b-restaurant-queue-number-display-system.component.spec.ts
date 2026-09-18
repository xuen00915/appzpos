import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQueueSystemComponent } from './f&b-restaurant-queue-number-display-system.component'; 

describe('CustomQueueSystemComponent', () => {
  let component: CustomQueueSystemComponent;
  let fixture: ComponentFixture<CustomQueueSystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomQueueSystemComponent]
    });
    fixture = TestBed.createComponent(CustomQueueSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
