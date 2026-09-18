import { Component } from '@angular/core';
import { ConfigService } from '../../../../services/shared_data/config.service';
import { ApiService } from '../../../../services/shared_function/api.service';
import { CommonFunctionService } from '../../../../services/shared_function/common-function.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Initialize variables here
  objComponentData: any = {};

  constructor(private apiService: ApiService, private configService: ConfigService,
    private commonFunctionService: CommonFunctionService,) {
    //Initialize component
    this.initializeComponent();
  }

  ngOnInit(): void {
    this.objComponentData = { Bit_Client_Specific_Home: 1 };
  }

  private initializeComponent(): void {
    //Initialize page
    this.initComponentData();
  }

  private initComponentData(): void {
    this.commonFunctionService.initPageDefault();
    //Get configuration data
    this.getHomePageData();
  }

  private getHomePageData() {
    this.commonFunctionService.ShowLoader();
    var objResponse: any = this.apiService.apiCallPOST_Sync("/api/WebSiteController/GetHomePageDetails");
    this.commonFunctionService.HideLoader();
    var objAPIResponse: any = objResponse.__zone_symbol__value;
  }

}
