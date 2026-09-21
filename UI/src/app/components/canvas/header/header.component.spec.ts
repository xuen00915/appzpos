import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ConfigService } from '../../../services/shared_data/config.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            objConfigData: {
              Configuration: {
                WebsiteData: {
                  Template: { Header: {} },
                  Navigation_Menu: { Layer_2: [], Layer_3: [] }
                }
              }
            }
          }
        },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (fileName: string) => fileName } }
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
