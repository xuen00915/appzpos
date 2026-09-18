import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

@Component({
  selector: 'app-custom-solutions',
  templateUrl: './custom-solutions.component.html',
  styleUrls: ['./custom-solutions.component.css']
})
export class CustomSolutionsComponent {

  constructor(private commonFunctionService: CommonFunctionService) { 
  };

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
}
