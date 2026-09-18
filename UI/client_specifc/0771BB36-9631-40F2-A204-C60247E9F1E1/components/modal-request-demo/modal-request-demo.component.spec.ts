import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRequestDemoComponent } from './modal-request-demo.component';

describe('CustomPSGComponent', () => {
  let component: ModalRequestDemoComponent;
  let fixture: ComponentFixture<ModalRequestDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRequestDemoComponent]
    });
    fixture = TestBed.createComponent(ModalRequestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
