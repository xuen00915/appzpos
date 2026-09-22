import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import { SolutionHeroConfig } from '../solution-hero/solution-hero.component';

@Component({
  selector: 'app-cloud-pos-point-of-sales-system',
  templateUrl: './cloud-pos-point-of-sales-system.component.html',
  styleUrls: ['./cloud-pos-point-of-sales-system.component.css']
})
export class CustomPOSEWaiterComponent {

  readonly solutionHero: SolutionHeroConfig = {
    headingId: 'pos-solution-title',
    title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
    imageSrc: 'assets/images/ecosystem/ecosystem-pos-ewaiter.webp',
    imageAlt: 'APPZPOS waiter taking a table order beside a staffed counter POS system',
    imageWidth: 727,
    imageHeight: 478
  };

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("APPZPOS Cloud POS System | Best Point of Sales in Singapore");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Integrated POS System with Customized Software and Hardware. Powerful Cloud POS System To Grow Your Restaurant. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
