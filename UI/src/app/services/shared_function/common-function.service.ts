import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { ConfigService } from '../shared_data/config.service';
import { AngularDeviceInformationService } from 'angular-device-information';


@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
  objConfigData: any;

  constructor(
    private configService: ConfigService,
    private deviceInformationService: AngularDeviceInformationService
  ) {
    this.InitComponent();
  }

  InitComponent() {
    this.ReadConfigServiceData();
  }

  ReadConfigServiceData(): void {
    this.objConfigData = this.configService.objConfigData;
  }

  //Reset page to default
  initPageDefault(): void {
    this.PageScrollToTop();
    this.HideLoader();
  }

  //Scroll menu to top of the page
  PageScrollToTop(): void {

  }

  //Show page loader
  ShowLoader(): void {

  }

  //Hide page loader
  HideLoader(): void {

  }

  //Check for NULL
  CheckForNull(objData: any): string {
    if (objData == "NULL" || objData == null || typeof (objData) == "undefined") {
      return "";
    }
    else {
      return objData.toString();
    }
  }

  //Bind API URL
  BindURL_API(strPath: string): string {
    if (this.CheckIncludes(strPath, "http")) {
      return strPath;
    }
    else {
      var strServerDomain = this.GetEnvironmentValues("serverDomain");
      return strServerDomain + strPath;
    }
  }

  //Bind image Files URL
  BindURL_Image(strFileName: string): string {
    var strServerDomain = this.GetEnvironmentValues("serverDomain");
    var strUploadPath = "/admin/Upload/" + this.objConfigData.Configuration.CompanyDetails.Company_Ref_No + "/Images/";
    var strURL = strServerDomain + strUploadPath + strFileName;
    return strURL;
  }

  //Check the string has specific keyword or not
  CheckIncludes(strInput: string, strKey: string): boolean {
    if (strInput.includes(strKey)) {
      return true;
    } else {
      return false;
    }
  }

  //Convert number to boolean
  FormatIntToBool(value: number): boolean {
    return value !== 0;
  }

  //Convert boolean to number
  FormatBoolToInt(value: boolean): number {
    return value ? 1 : 0;
  }

  //Format Date
  FormatDate(value: any, format: number): string {
    if (value instanceof Date) {
      if (format == 1) {//yyyy-mm-dd
        const year = value.getFullYear();
        const month = (value.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
        const day = value.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    return value;
  }

  //Get device information
  GetDeviceInfo(): any {
    var objDeviceInfo: any = {};
    var objGetDeviceInfo: any = this.deviceInformationService.getDeviceInfo();
    objDeviceInfo["Device_Type"] = this.deviceInformationService.getDeviceType();//Returns if the app is running on a Desktop browser
    objDeviceInfo["Mobile"] = this.deviceInformationService.isMobile();//Returns if the device is a mobile device (android / iPhone / windows-phone etc)
    objDeviceInfo["Tablet"] = this.deviceInformationService.isTablet();//Returns if the device is a tablet (tablet iPad etc)
    objDeviceInfo["Desktop"] = this.deviceInformationService.isDesktop();//Returns if the app is running on a Desktop browser
    objDeviceInfo["Device_OS"] = objGetDeviceInfo.os;//Returns os name like Windows/Andtoid/iOS/Linux/Mac OS X etc
    objDeviceInfo["Device_OS_Version"] = objGetDeviceInfo.osVersion;//Returns os version like 10/8.1/7 ...etc
    objDeviceInfo["Browser"] = objGetDeviceInfo.browser;//Returns browser name like chrome/firefox ...etc
    objDeviceInfo["Browser_Version"] = objGetDeviceInfo.browserVersion;//Returns browser version as number
    objDeviceInfo["Browser_Major_Version"] = objGetDeviceInfo.browserMajorVersion;//Returns full browser version as number
    objDeviceInfo["Screen_Resolution"] = objGetDeviceInfo.screen_resolution;//Returns screnn size like 1390x860/640x800 ...etc
    objDeviceInfo["Cookies"] = objGetDeviceInfo.cookies;//Returns cookies enabled or no
    objDeviceInfo["User_Agent"] = objGetDeviceInfo.userAgent;//Returns userAgent
    return objDeviceInfo;
  }

  GetEnvironmentValues(key: string): any {
    if (key == "serverDomain") {
      return environment.serverDomain;
    }
    else if (key == "version") {
      return environment.version;
    }
    return "";
  }
}
