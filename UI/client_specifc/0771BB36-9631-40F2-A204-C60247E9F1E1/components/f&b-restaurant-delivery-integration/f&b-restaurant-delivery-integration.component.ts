import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-f&b-restaurant-delivery-integration',
  templateUrl: './f&b-restaurant-delivery-integration.component.html',
  styleUrls: ['./f&b-restaurant-delivery-integration.component.css']
})
export class CustomOrderHubComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("Centralize Delivery Orders in One Place | APPZPOS Order Hub");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Centralize all your delivery orders into one System. Food Delivery Partner Integration like Grab, Foodpanda & Deliveroo. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
