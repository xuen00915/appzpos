import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomIndustryBeautySalonsComponent } from './salon-cloud-pos-system.component';

describe('CustomIndustryBeautySalonsComponent', () => {
  let component: CustomIndustryBeautySalonsComponent;
  let fixture: ComponentFixture<CustomIndustryBeautySalonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomIndustryBeautySalonsComponent]
    });
    fixture = TestBed.createComponent(CustomIndustryBeautySalonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
