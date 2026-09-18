import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CNModalRequestDemoComponent } from './cn-modal-request-demo.component';

describe('CustomPSGComponent', () => {
  let component: CNModalRequestDemoComponent;
  let fixture: ComponentFixture<CNModalRequestDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CNModalRequestDemoComponent]
    });
    fixture = TestBed.createComponent(CNModalRequestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
