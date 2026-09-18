import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-f&b-restaurant-online-ordering-website',
  templateUrl: './f&b-restaurant-online-ordering-website.component.html',
  styleUrls: ['./f&b-restaurant-online-ordering-website.component.css']
})
export class CustomWebsiteOrderComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("Restaurant Online Ordering Website | APPZOS Website Ordering");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Customized webpage for your customer to place orders, secure online payment gateway, and seamless delivery integration. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
