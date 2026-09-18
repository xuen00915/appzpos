import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-f&b-restaurant-queue-number-display-system',
  templateUrl: './f&b-restaurant-queue-number-display-system.component.html',
  styleUrls: ['./f&b-restaurant-queue-number-display-system.component.css']
})
export class CustomQueueSystemComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("Automate Restaurant Queue | APPZPOS Queue Number Display");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Optimize Queues with Large Screen Queue Number Display and Automated Order Updates - integrated with POS System. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
