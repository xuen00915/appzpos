import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { HomeStorySectionConfig } from '../home-page-template/home-page-template.models';

@Component({
  selector: 'app-home-story-sections',
  templateUrl: './home-story-sections.component.html',
  styleUrls: ['./home-story-sections.component.css']
})
export class HomeStorySectionsComponent {
  @Input() sections: readonly HomeStorySectionConfig[] = [];
  @Output() requestDemo = new EventEmitter<void>();

  constructor(private readonly commonFunctionService: CommonFunctionService) {}

  imageUrl(name: string): string {
    return name.startsWith('assets/') || /^https?:\/\//.test(name)
      ? name
      : this.commonFunctionService.BindURL_Image(name);
  }
}
