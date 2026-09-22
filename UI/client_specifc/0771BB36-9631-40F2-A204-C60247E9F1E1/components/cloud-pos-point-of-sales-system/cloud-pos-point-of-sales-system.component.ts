import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import { SolutionHeroConfig } from '../solution-hero/solution-hero.component';

type HardwareCategory = 'all' | 'pos' | 'printer' | 'accessory';
type HardwareSize = 'all' | 'tablet' | '10' | '15.6' | 'other';

@Component({
  selector: 'app-cloud-pos-point-of-sales-system',
  templateUrl: './cloud-pos-point-of-sales-system.component.html',
  styleUrls: ['./cloud-pos-point-of-sales-system.component.css']
})
export class CustomPOSEWaiterComponent {

  hardwareCategory: HardwareCategory = 'all';
  hardwareSize: HardwareSize = 'all';

  readonly solutionHero: SolutionHeroConfig = {
    headingId: 'pos-solution-title',
    title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
    imageSrc: 'assets/images/ecosystem/ecosystem-pos-ewaiter-transparent.webp',
    imageAlt: 'APPZPOS waiter taking a table order beside a staffed counter POS system',
    imageWidth: 1547,
    imageHeight: 1016,
    scrollTargetId: 'content',
    scrollLabel: 'Explore APPZPOS POS and E-Waiter features',
    integrationTargetId: 'pos-integrations',
    integrationMobileTargetId: 'pos-integrations-mobile',
    integrationLabel: 'Explore APPZPOS integrations with leading third-party platforms',
    deviceLinks: [
      {
        id: 'tablet',
        targetId: 'pos-tablet',
        mobileTargetId: 'pos-tablet-mobile',
        label: 'Explore Tablet POS System on iPad and E-Waiter'
      },
      {
        id: 'cloud',
        targetId: 'pos-cloud',
        mobileTargetId: 'pos-cloud-mobile',
        label: 'Explore Powerful Cloud POS System for restaurants'
      }
    ]
  };

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
       this.titleService.setTitle("APPZPOS Cloud POS System | Best Point of Sales in Singapore");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  setHardwareCategory(category: HardwareCategory): void {
    this.hardwareCategory = category;
  }

  setHardwareSize(event: Event): void {
    this.hardwareSize = (event.target as HTMLSelectElement).value as HardwareSize;
  }

  isHardwareVisible(category: Exclude<HardwareCategory, 'all'>, size: Exclude<HardwareSize, 'all'>): boolean {
    return (this.hardwareCategory === 'all' || this.hardwareCategory === category)
      && (this.hardwareSize === 'all' || this.hardwareSize === size);
  }

  hasVisibleHardware(): boolean {
    if (this.hardwareCategory === 'all' && this.hardwareSize === 'all') return true;
    if (this.hardwareSize === 'other') return this.hardwareCategory !== 'pos';
    if (this.hardwareSize !== 'all') return this.hardwareCategory === 'all' || this.hardwareCategory === 'pos';
    return true;
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Integrated POS System with Customized Software and Hardware. Powerful Cloud POS System To Grow Your Restaurant. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
