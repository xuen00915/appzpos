import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomIndustryRestaurantComponent } from './f&b-restaurant-cloud-pos-system.component';

describe('CustomTransparentHeaderComponent', () => {
  let component: CustomIndustryRestaurantComponent;
  let fixture: ComponentFixture<CustomIndustryRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomIndustryRestaurantComponent]
    });
    fixture = TestBed.createComponent(CustomIndustryRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
