import { Pipe, PipeTransform } from '@angular/core';
import { CommonFunctionService } from '../services/shared_function/common-function.service';

//Format date
@Pipe({
  name: 'FormatDatePipe'
})
export class FormatDatePipe implements PipeTransform {

  constructor(private commonFunctionService: CommonFunctionService) { };

  transform(value: any, format: number): string {
    return this.commonFunctionService.FormatDate(value, format);
  }
}

