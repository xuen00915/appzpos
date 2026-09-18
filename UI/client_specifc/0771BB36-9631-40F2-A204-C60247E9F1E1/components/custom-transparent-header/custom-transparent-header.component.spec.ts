import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomTransparentHeaderComponent } from './custom-transparent-header.component';

describe('CustomTransparentHeaderComponent', () => {
  let component: CustomTransparentHeaderComponent;
  let fixture: ComponentFixture<CustomTransparentHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTransparentHeaderComponent]
    });
    fixture = TestBed.createComponent(CustomTransparentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
