import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

@Component({
  selector: 'app-custom-trasparent-header',
  templateUrl: './custom-transparent-header.component.html',
  styleUrls: ['./custom-transparent-header.component.css']
})
export class CustomTransparentHeaderComponent  {
  
  constructor(private commonFunctionService: CommonFunctionService) { };

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
}
