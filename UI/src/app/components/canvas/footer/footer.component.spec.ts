import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { ConfigService } from '../../../services/shared_data/config.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            objConfigData: {
              Configuration: { WebsiteData: { Template: { Footer: {} } } }
            }
          }
        },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (fileName: string) => fileName } }
      ]
    });
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
