import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPartnerIntegrationComponent } from './pos-solutions-partner-integrations.component'; 

describe('CustomPartnerIntegrationComponent', () => {
  let component: CustomPartnerIntegrationComponent;
  let fixture: ComponentFixture<CustomPartnerIntegrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPartnerIntegrationComponent]
    });
    fixture = TestBed.createComponent(CustomPartnerIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
