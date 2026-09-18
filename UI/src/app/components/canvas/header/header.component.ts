import { Component } from '@angular/core';
import { ConfigService } from '../../../services/shared_data/config.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  objConfigData: any;
  objConfigData_Header: any;

  constructor(private configService: ConfigService,private commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
    this.ReadConfigServiceData();
  }

  ReadConfigServiceData(): void {
    this.objConfigData = this.configService.objConfigData;
    this.objConfigData_Header = this.objConfigData.Configuration.WebsiteData.Template.Header;
  }

  //Bind
  BindURL_Upload(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  //If
  ngIfMenuLayer2(objParam: any): boolean {
    const filteredArray = this.objConfigData.Configuration.WebsiteData.Navigation_Menu.Layer_2.filter((item: any) => item.Master_Menu_ID == objParam.Menu_ID);
    if (filteredArray.length == 0) {
      return false;
    }
    else {
      return true;
    }
  }

  ngIfMenuLayer3(objParam: any): boolean {
    const filteredArray = this.objConfigData.Configuration.WebsiteData.Navigation_Menu.Layer_3.filter((item: any) => item.Master_Menu_ID == objParam.Menu_ID);
    if (filteredArray.length == 0) {
      return false;
    }
    else {
      return true;
    }
  }

  //Filter
  filterMenuLayer(objParam: any): (item: any) => boolean {
    return (item: any) => {
      return item.Master_Menu_ID == objParam.Menu_ID;
    };
  };
}
