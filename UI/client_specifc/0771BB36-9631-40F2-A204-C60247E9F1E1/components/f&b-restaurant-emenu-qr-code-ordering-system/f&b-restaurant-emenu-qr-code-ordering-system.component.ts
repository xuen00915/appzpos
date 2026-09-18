import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-f&b-restaurant-emenu-qr-code-ordering-system',
  templateUrl: './f&b-restaurant-emenu-qr-code-ordering-system.component.html',
  styleUrls: ['./f&b-restaurant-emenu-qr-code-ordering-system.component.css']
})
export class CustomQROrderComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("Restaurant E-Menu | Singapore Table QR Code Ordering System");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Smart Menu: Fast, Efficient Ordering with Table QR Code. Customers scan QR code to place orders - save manpower. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
