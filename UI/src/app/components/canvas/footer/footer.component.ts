import { Component } from '@angular/core';
import { ConfigService } from '../../../services/shared_data/config.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent  {
  objConfigData: any;
  objConfigData_Footer: any;

  constructor(private configService: ConfigService,private commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
    this.objConfigData = this.configService.objConfigData;
    this.objConfigData_Footer = this.objConfigData.Configuration.WebsiteData.Template.Footer;
  }

  //Bind
  BindURL_Upload(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
}