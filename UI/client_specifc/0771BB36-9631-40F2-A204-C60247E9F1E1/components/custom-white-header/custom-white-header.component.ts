import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { DOCUMENT } from '@angular/common';
import {Title} from "@angular/platform-browser";
import { GoogleAnalyticsHelpersService } from 'src/app/services/shared_function/google-helpers.services';
import { FacebookPixelSettingService } from 'src/app/services/shared_function/facebook-pixelsetting.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-custom-white-header',
  templateUrl: './custom-white-header.component.html',
  styleUrls: ['./custom-white-header.component.css']
})
export class CustomWhiteHeaderComponent  {
  openMenu: 'solutions' | 'industries' | 'resources' | null = null;
  mobileMenuOpen = false;

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private titleService: Title,
    private commonFunctionService: CommonFunctionService,
    private elementRef: ElementRef<HTMLElement>
  ) {
   
    this._document.getElementById('appFavicon')?.setAttribute('href', this.commonFunctionService.BindURL_Image('favicon.png')); 
    this.titleService.setTitle("APPZPOS Point of Sales | F&B, Retails & Salons | PSG Grant");
    GoogleAnalyticsHelpersService.LoadGoogleTag(environment.appzPOSTagID);
    FacebookPixelSettingService.LoadFacebookPixelSetting(environment.appzPOSFBPixelID);
    FacebookPixelSettingService.LoadFaceBookImgPixelCode(environment.appzPOSFBPixelID);
   };

  toggleMenu(menu: 'solutions' | 'industries' | 'resources'): void {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) this.openMenu = null;
  }

  closeMenus(): void {
    this.openMenu = null;
    this.mobileMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeMenus();
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.closeMenus();
  }

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
}
