import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-f&b-restaurant-kitchen-display-system',
  templateUrl: './f&b-restaurant-kitchen-display-system.component.html',
  styleUrls: ['./f&b-restaurant-kitchen-display-system.component.css']
})
export class CustomKitchenDisplaySystemComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("Restaurant Kitchen Display System | APPZPOS KDS System");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Speed Up your Kitchen Operations - Efficiently manage orders with real-time updates, enhancing turnaround times. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
