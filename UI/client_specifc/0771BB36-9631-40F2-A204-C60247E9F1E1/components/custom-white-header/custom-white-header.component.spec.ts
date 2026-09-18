import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomWhiteHeaderComponent } from './custom-white-header.component';

describe('CustomWhiteHeaderComponent', () => {
  let component: CustomWhiteHeaderComponent;
  let fixture: ComponentFixture<CustomWhiteHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomWhiteHeaderComponent]
    });
    fixture = TestBed.createComponent(CustomWhiteHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
