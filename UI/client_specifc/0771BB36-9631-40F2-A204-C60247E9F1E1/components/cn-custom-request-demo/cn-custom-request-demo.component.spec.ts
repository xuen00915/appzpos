import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CNCustomRequestDemoComponent } from './cn-custom-request-demo.component';

describe('CustomPSGComponent', () => {
  let component: CNCustomRequestDemoComponent;
  let fixture: ComponentFixture<CNCustomRequestDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CNCustomRequestDemoComponent]
    });
    fixture = TestBed.createComponent(CNCustomRequestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
