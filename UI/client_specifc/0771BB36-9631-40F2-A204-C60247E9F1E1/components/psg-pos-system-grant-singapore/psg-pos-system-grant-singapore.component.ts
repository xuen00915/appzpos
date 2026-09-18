import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";

declare var $: any;
@Component({
  selector: 'app-psg-pos-system-grant-singapore',
  templateUrl: './psg-pos-system-grant-singapore.component.html',
  styleUrls: ['./psg-pos-system-grant-singapore.component.css']
})
export class CustomPSGComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
    this.titleService.setTitle("Get Up to 50% PSG Grant for Local SMEs | F&B POS Packages");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Affordable POS Packages with up to 50% PSG Grants for Local SMEs(F&B). Eligible for New Business. Easy to Apply & Claim. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
 
}
