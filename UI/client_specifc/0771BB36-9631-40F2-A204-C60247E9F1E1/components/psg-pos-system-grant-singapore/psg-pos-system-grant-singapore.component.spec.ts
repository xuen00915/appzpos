import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomPSGComponent } from './psg-pos-system-grant-singapore.component';

describe('CustomPSGComponent', () => {
  let component: CustomPSGComponent;
  let fixture: ComponentFixture<CustomPSGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPSGComponent]
    });
    fixture = TestBed.createComponent(CustomPSGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
