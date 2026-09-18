import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
 
@Component({
  selector: 'app-custom-header',
  template: `
    <app-custom-trasparent-header  *ngIf="useTemplateOne; else useTemplateTwo"></app-custom-trasparent-header>
    <ng-template #useTemplateTwo>
      <app-custom-white-header></app-custom-white-header>
    <ng-template>
  `, 
  styleUrls: ['./custom-header.component.css']
})
export class CustomHeaderComponent  {
  useTemplateOne:any;

  constructor(private commonFunctionService: CommonFunctionService) { 
  this.useTemplateOne = false;
  /* var current_route = this.commonFunctionService.GetCurrentRoutName();
  if(current_route != "home" && current_route != ""){
    this.useTemplateOne=false;
  } */
  };

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

}
