import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AppModule } from './app.module';
import { AppComponent } from '../components/index/app/app.component';
import { CommonFunctionService } from '../services/shared_function/common-function.service';
import { GoogleAnalyticsHelpersService } from '../services/shared_function/google-helpers.services';
import { FacebookPixelSettingService } from '../services/shared_function/facebook-pixelsetting.service';

describe('Marketing startup without the POS backend', () => {
  let fixture: ComponentFixture<AppComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    (window as any).$ = { getScript: () => undefined };
    spyOn(GoogleAnalyticsHelpersService, 'LoadGoogleTag');
    spyOn(FacebookPixelSettingService, 'LoadFacebookPixelSetting');
    spyOn(FacebookPixelSettingService, 'LoadFaceBookImgPixelCode');
    // Also catch any regression back to synchronous XMLHttpRequest.
    spyOn(XMLHttpRequest.prototype, 'send').and.throwError('Backend unavailable in this test');
    await TestBed.configureTestingModule({ imports: [AppModule, HttpClientTestingModule] }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    fixture.destroy();
  });

  for (const [route, selector] of [
    ['/', 'app-index h1'],
    ['/lp/restaurant-pos-system-singapore', '#lp-hero-title'],
    ['/point-of-sales-demo-quotation', 'form'],
    ['/retail-store-cloud-pos-system', 'h1']
  ]) {
    it(`renders ${route} with no API request or saved configuration`, async () => {
      await TestBed.inject(Router).navigateByUrl(route);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(selector)).not.toBeNull();
      expect(fixture.nativeElement.querySelector('app-custom-white-header')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('app-custom-footer')).not.toBeNull();
      http.expectNone(() => true);
      expect(XMLHttpRequest.prototype.send).not.toHaveBeenCalled();
      expect(TestBed.inject(CommonFunctionService).BindURL_Image('logo.png')).toBe(
        'https://appzpos.com/admin/Upload/0771BB36-9631-40F2-A204-C60247E9F1E1/Images/logo.png'
      );
    });
  }
});
