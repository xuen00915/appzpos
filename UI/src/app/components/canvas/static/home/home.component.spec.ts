import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ApiService } from '../../../../services/shared_function/api.service';
import { ConfigService } from '../../../../services/shared_data/config.service';
import { CommonFunctionService } from '../../../../services/shared_function/common-function.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: ApiService, useValue: { apiCallPOST_Sync: () => ({ __zone_symbol__value: {} }) } },
        { provide: ConfigService, useValue: { objConfigData: {} } },
        {
          provide: CommonFunctionService,
          useValue: { initPageDefault: () => undefined, ShowLoader: () => undefined, HideLoader: () => undefined }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
