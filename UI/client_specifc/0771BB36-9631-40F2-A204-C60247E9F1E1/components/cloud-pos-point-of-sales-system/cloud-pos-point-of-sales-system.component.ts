import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import { SolutionHeroConfig } from '../solution-hero/solution-hero.component';

type HardwareCategory = 'all' | 'pos' | 'printer' | 'accessory';
type HardwareFilter = 'all' | 'tablet' | '10' | '15.6' | 'other' | 'printer' | 'customer-display';
type HardwareAttributes = '10' | 'tablet' | '15.6' | '15.6 customer-display'
  | '15.6 printer' | '15.6 printer customer-display' | 'other';

@Component({
  selector: 'app-cloud-pos-point-of-sales-system',
  templateUrl: './cloud-pos-point-of-sales-system.component.html',
  // Layout styles are shared by app-solution-page.
})
export class CustomPOSEWaiterComponent {

  hardwareCategory: HardwareCategory = 'all';
  hardwareFilter: HardwareFilter = 'all';

  readonly solutionHero: SolutionHeroConfig = {
    headingId: 'pos-solution-title',
    title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
    imageSrc: 'assets/images/ecosystem/ecosystem-pos-ewaiter-transparent.webp',
    imageAlt: 'APPZPOS waiter taking a table order beside a staffed counter POS system',
    imageWidth: 1547,
    imageHeight: 1016,
    interactive: false,
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

  setHardwareFilter(event: Event): void {
    this.hardwareFilter = (event.target as HTMLSelectElement).value as HardwareFilter;
  }

  isHardwareVisible(category: Exclude<HardwareCategory, 'all'>, attributes: HardwareAttributes): boolean {
    return (this.hardwareCategory === 'all' || this.hardwareCategory === category)
      && (this.hardwareFilter === 'all' || attributes.split(' ').includes(this.hardwareFilter));
  }

  hasVisibleHardware(): boolean {
    if (this.hardwareFilter === 'all') return true;
    if (this.hardwareFilter === 'other') return this.hardwareCategory !== 'pos';
    return this.hardwareCategory === 'all' || this.hardwareCategory === 'pos';
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Integrated POS System with Customized Software and Hardware. Powerful Cloud POS System To Grow Your Restaurant. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  
}
