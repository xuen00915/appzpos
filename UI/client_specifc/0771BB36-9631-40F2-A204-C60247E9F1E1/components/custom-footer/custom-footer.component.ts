import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { environment } from 'src/environment';
import { GoogleAnalyticsHelpersService } from 'src/app/services/shared_function/google-helpers.services';
declare var $: any;

@Component({
  selector: 'app-custom-footer',
  templateUrl: './custom-footer.component.html',
  styleUrls: ['./custom-footer.component.css']
})
export class CustomFooterComponent {
 
  constructor(private commonFunctionService: CommonFunctionService) {
    GoogleAnalyticsHelpersService.LoadGoogleIFrame(environment.appzPOSTagID);
   };
  
  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  } 
}