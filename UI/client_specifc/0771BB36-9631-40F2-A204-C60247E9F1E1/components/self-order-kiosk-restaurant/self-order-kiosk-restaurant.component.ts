import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-self-order-kiosk-restaurant',
  templateUrl: './self-order-kiosk-restaurant.component.html',
  styleUrls: ['./self-order-kiosk-restaurant.component.css']
})
export class CustomSelfOrderKioskComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("Self Order Kiosk for Restaurants | Self-service Kiosk Singapore");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Wall-mounted, counter-top, or self ordering kiosk with stand. Quick Service - Perfect for high-traffic restaurants. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
