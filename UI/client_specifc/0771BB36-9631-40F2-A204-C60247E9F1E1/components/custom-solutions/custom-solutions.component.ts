import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

@Component({
  selector: 'app-custom-solutions',
  templateUrl: './custom-solutions.component.html',
  styleUrls: ['../industry-page/industry-layout.css', './custom-solutions.component.css']
})
export class CustomSolutionsComponent implements OnInit {

  constructor(
    private readonly commonFunctionService: CommonFunctionService,
    private readonly titleService: Title,
    private readonly meta: Meta
  ) {
    this.titleService.setTitle('Customized POS Solutions for Every Business | APPZPOS');
  };

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content: 'Discover customized APPZPOS software and hardware solutions for restaurants, retail stores, salons, and growing businesses in Singapore.'
    });
  }

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
}
