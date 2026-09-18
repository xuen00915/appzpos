import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomRequestDemoComponent } from './custom-request-demo.component';

describe('CustomPSGComponent', () => {
  let component: CustomRequestDemoComponent;
  let fixture: ComponentFixture<CustomRequestDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomRequestDemoComponent]
    });
    fixture = TestBed.createComponent(CustomRequestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
