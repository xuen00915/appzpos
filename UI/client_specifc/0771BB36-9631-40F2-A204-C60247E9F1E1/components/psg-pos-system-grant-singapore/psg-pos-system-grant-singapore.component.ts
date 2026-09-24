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
  selectedPackageFilters: string[] = [];

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta) {
    this.titleService.setTitle("EDGE Grant Support for Singapore Businesses | F&B POS Packages");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  togglePackageFilter(filter: string): void {
    if (filter === 'all') {
      this.selectedPackageFilters = [];
      return;
    }

    this.selectedPackageFilters = this.selectedPackageFilters.includes(filter)
      ? this.selectedPackageFilters.filter((selectedFilter) => selectedFilter !== filter)
      : [...this.selectedPackageFilters, filter];
  }

  isPackageFilterActive(filter: string): boolean {
    return filter === 'all'
      ? this.selectedPackageFilters.length === 0
      : this.selectedPackageFilters.includes(filter);
  }

  shouldShowPackage(features: string[]): boolean {
    return this.selectedPackageFilters.every((filter) => features.includes(filter));
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Affordable APPZPOS packages for qualifying EDGE Grant digitalisation projects in Singapore. Explore eligibility and application information. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
 
}
