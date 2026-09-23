import { Component, Input } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { HomeFeatureSectionConfig, HomeGrantConfig, HomeHardwareConfig } from '../home-page-template/home-page-template.models';

@Component({ selector: 'app-home-ecosystem', templateUrl: './home-ecosystem.component.html', styleUrls: ['./home-ecosystem.component.css'] })
export class HomeEcosystemComponent {
  @Input() hardware?: HomeHardwareConfig;
  @Input() grant?: HomeGrantConfig;
  @Input() features?: HomeFeatureSectionConfig;
  constructor(private readonly commonFunctionService: CommonFunctionService) {}
  imageUrl(name: string): string {
    return name.startsWith('assets/') || /^https?:\/\//.test(name) ? name : this.commonFunctionService.BindURL_Image(name);
  }
}
