import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { DOCUMENT } from '@angular/common';
import {Title} from "@angular/platform-browser";
import { GoogleAnalyticsHelpersService } from 'src/app/services/shared_function/google-helpers.services';
import { FacebookPixelSettingService } from 'src/app/services/shared_function/facebook-pixelsetting.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-custom-white-header',
  templateUrl: './custom-white-header.component.html',
  styleUrls: ['./custom-white-header.component.css']
})
export class CustomWhiteHeaderComponent  {

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,private titleService: Title,private commonFunctionService: CommonFunctionService) {
   
    this._document.getElementById('appFavicon')?.setAttribute('href', this.commonFunctionService.BindURL_Image('favicon.png')); 
    this.titleService.setTitle("APPZPOS Point of Sales | F&B, Retails & Salons | PSG Grant");
    GoogleAnalyticsHelpersService.LoadGoogleTag(environment.appzPOSTagID);
    FacebookPixelSettingService.LoadFacebookPixelSetting(environment.appzPOSFBPixelID);
    FacebookPixelSettingService.LoadFaceBookImgPixelCode(environment.appzPOSFBPixelID);
   }; 
  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
}
