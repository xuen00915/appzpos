import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
//Third party modules
import { AngularDeviceInformationService } from 'angular-device-information';
//Module
import { AppRoutingModule } from './app-routing.module';
//Component
import { RootComponent } from '../components/canvas/root/root.component';
import { AppComponent } from '../components/index/app/app.component';
import { HeaderComponent } from '../components/canvas/header/header.component';
import { FooterComponent } from '../components/canvas/footer/footer.component';
import { HomeComponent } from '../components/canvas/static/home/home.component';
//Pipes
import { GenericFilterPipe } from '../pipes/generic-filter.pipe';
import { FormatDatePipe } from '../pipes/format-data.pipe';
//Service
import { ConfigService } from '../services/shared_data/config.service';
import { GlobalVariableService } from '../services/shared_data/global-variable.service';
import { CommonFunctionService } from '../services/shared_function/common-function.service';
import { ApiService } from '../services/shared_function/api.service';
//Custom modules
import { CustomAppModule } from '../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module';
 
import {  ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    RootComponent,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GenericFilterPipe,
    FormatDatePipe,
  ],
  imports: [ 
    AppRoutingModule,
    HttpClientModule,
    CustomAppModule,
    BrowserModule, 
    ReactiveFormsModule,
    FormsModule
  ], 
  providers: [
    ConfigService,
    GlobalVariableService,
    CommonFunctionService,
    ApiService,
    AngularDeviceInformationService,
    provideAnimationsAsync() 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    private apiService: ApiService, private configService: ConfigService,
    private commonFunctionService: CommonFunctionService,
    private globalVariableService: GlobalVariableService
  ) {
    //Initialize app module
    this.initializeModule();
  }

  private initializeModule(): void {
    //Initialize page
    this.initPage();
  }

  private initPage(): void {
    this.commonFunctionService.initPageDefault();
    //Get configuration data
    this.getConfigurationData();
  }

  private getConfigurationData() {
    this.commonFunctionService.ShowLoader();
    var objParam: any = {};
    objParam.Device = "38";//Web
    objParam.UserDeviceInfo = this.commonFunctionService.CheckForNull(localStorage.getItem("UserDeviceInfo"));
    objParam.QR_Image_Scanned_DateTime = this.commonFunctionService.CheckForNull(localStorage.getItem("QR_Image_Scanned_DateTime"));
    //objParam.DomainName = "192.168.1.69:8005";
    var objResponse: any = this.apiService.apiCallPOST_Sync("/api/IndexController/GetConfigurationValues", objParam);
    var objAPIResponse: any = objResponse.__zone_symbol__value;
    this.BindConfigurationData(objAPIResponse);
  }

  BindConfigurationData(objAPIResponse: any) {
    console.log(objAPIResponse);
    //Update device info
    this.configService.objConfigData.DeviceInfo = this.commonFunctionService.GetDeviceInfo();
    //Update app info
    this.configService.objConfigData.AppInfo = { AppVersion: this.commonFunctionService.GetEnvironmentValues("version") };
    //Update system configuration
    this.configService.objConfigData.Configuration = objAPIResponse.Configuration;
    this.configService.objConfigData.Configuration.Outlet_List = JSON.parse(this.configService.objConfigData.Configuration.Outlet_List);
    this.configService.objConfigData.Configuration.PaymentMethodList = JSON.parse(this.configService.objConfigData.Configuration.PaymentMethodList);
    this.configService.objConfigData.Configuration.Customer_Group_List = JSON.parse(this.configService.objConfigData.Configuration.Customer_Group_List);
    this.configService.objConfigData.Configuration.WebDesign.Web_Design_Template = JSON.parse(this.configService.objConfigData.Configuration.WebDesign.Web_Design_Template);
    this.configService.objConfigData.Configuration.WebDesign.QR_Web_Design_Template = JSON.parse(this.configService.objConfigData.Configuration.OutletDetails.QR_Web_Design_Template);
    if (this.commonFunctionService.CheckForNull(this.configService.objConfigData.Configuration.WebDesign.Web_Design_Template.Design) == "") {
      this.configService.objConfigData.Configuration.WebDesign.Web_Design_Template.Design = {};
    }
    if (this.commonFunctionService.CheckForNull(this.configService.objConfigData.Configuration.WebDesign.QR_Web_Design_Template.Design) == "") {
      this.configService.objConfigData.Configuration.WebDesign.QR_Web_Design_Template.Design = {};
    }
    //Update theme

    //Navigation menu
    this.configService.objConfigData.Configuration.WebsiteData.Navigation_Menu = {
      Layer_1: [
        { Menu_ID: 1, Menu_Name: "HOME", Path: "/home", Master_Menu_ID: "" },
        { Menu_ID: 2, Menu_Name: "ABOUT US", Path: "/about-us", Master_Menu_ID: "" },
        { Menu_ID: 3, Menu_Name: "CONTACT US", Path: "/contact-us", Master_Menu_ID: "" },
        { Menu_ID: 4, Menu_Name: "RESERVATION", Path: "/reservation", Master_Menu_ID: "" },
        { Menu_ID: 5, Menu_Name: "ORDER", Path: "/order", Master_Menu_ID: "" }
      ],
      Layer_2: [],
      Layer_3: []
    }
  }
}
