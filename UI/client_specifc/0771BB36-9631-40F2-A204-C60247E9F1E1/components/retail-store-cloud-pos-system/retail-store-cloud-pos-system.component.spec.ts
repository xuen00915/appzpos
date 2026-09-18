import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomIndustryRestoreStoreComponent } from './retail-store-cloud-pos-system.component';

describe('CustomIndustryRestoreStoreComponent', () => {
  let component: CustomIndustryRestoreStoreComponent;
  let fixture: ComponentFixture<CustomIndustryRestoreStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomIndustryRestoreStoreComponent]
    });
    fixture = TestBed.createComponent(CustomIndustryRestoreStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
