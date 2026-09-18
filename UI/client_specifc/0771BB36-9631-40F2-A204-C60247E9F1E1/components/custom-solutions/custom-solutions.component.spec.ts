import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSolutionsComponent } from './custom-solutions.component';

describe('CustomTransparentHeaderComponent', () => {
  let component: CustomSolutionsComponent;
  let fixture: ComponentFixture<CustomSolutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomSolutionsComponent]
    });
    fixture = TestBed.createComponent(CustomSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
