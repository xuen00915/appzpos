import { Component, ElementRef, HostListener, Inject, OnDestroy } from '@angular/core';
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
export class CustomWhiteHeaderComponent implements OnDestroy {
  openMenu: 'solutions' | 'industries' | 'contact' | null = null;
  mobileMenuOpen = false;

  private readonly sectionRoutes = {
    solutions: [
      '/cloud-pos-point-of-sales-system',
      '/f&b-restaurant-online-ordering-website',
      '/f&b-restaurant-emenu-qr-code-ordering-system',
      '/self-order-kiosk-restaurant',
      '/f&b-restaurant-kitchen-display-system',
      '/f&b-restaurant-queue-number-display-system',
      '/f&b-restaurant-delivery-integration',
      '/pos-hardware-machine-receipt-printer',
      '/pos-features-crm-payment-gateway'
    ],
    industries: [
      '/f&b-restaurant-cloud-pos-system',
      '/retail-store-cloud-pos-system',
      '/salon-cloud-pos-system'
    ]
  } as const;

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private titleService: Title,
    private commonFunctionService: CommonFunctionService,
    private elementRef: ElementRef<HTMLElement>
  ) {

    const favicon = this._document.getElementById('appFavicon');
    favicon?.setAttribute('href', 'assets/images/appzpos-favicon-circle.svg');
    favicon?.setAttribute('type', 'image/svg+xml');
    favicon?.setAttribute('sizes', 'any');
    this.titleService.setTitle("APPZPOS Point of Sales | F&B, Retails & Salons | EDGE Grant");
    GoogleAnalyticsHelpersService.LoadGoogleTag(environment.appzPOSTagID);
    FacebookPixelSettingService.LoadFacebookPixelSetting(environment.appzPOSFBPixelID);
    FacebookPixelSettingService.LoadFaceBookImgPixelCode(environment.appzPOSFBPixelID);
   };

  toggleMenu(menu: 'solutions' | 'industries' | 'contact', event?: MouseEvent): void {
    if (!this.mobileMenuOpen && this.openMenu === menu && event && event.detail > 0) return;
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  openMenuOnHover(menu: 'solutions' | 'industries' | 'contact'): void {
    if (!this.mobileMenuOpen) this.openMenu = menu;
  }

  closeMenuOnHover(): void {
    if (!this.mobileMenuOpen) this.openMenu = null;
  }

  openMenuFromKeyboard(event: Event, menu: 'solutions' | 'industries' | 'contact'): void {
    event.preventDefault();
    this.openMenu = menu;
  }

  closeMenuOnFocus(event: FocusEvent): void {
    const group = event.currentTarget as HTMLElement;
    if (!this.mobileMenuOpen && !group.contains(event.relatedTarget as Node | null)) {
      this.openMenu = null;
    }
  }

  isCurrentPage(path: string): boolean {
    const current = this.currentPath();
    return current === path || (path === '/blog' && current.startsWith('/blog/'));
  }

  isCurrentSection(menu: 'solutions' | 'industries'): boolean {
    return this.sectionRoutes[menu].some((path) => this.isCurrentPage(path));
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.openMenu = this.mobileMenuOpen ? this.currentSection() : null;
    this.syncScrollLock();
  }

  handleNavigationClick(event: MouseEvent): void {
    if ((event.target as Element | null)?.closest('a')) this.closeMenus();
  }

  closeMenus(): void {
    this.openMenu = null;
    this.mobileMenuOpen = false;
    this.syncScrollLock();
  }

  ngOnDestroy(): void {
    this._document.body.style.removeProperty('overflow');
  }

  private syncScrollLock(): void {
    if (this.mobileMenuOpen) this._document.body.style.overflow = 'hidden';
    else this._document.body.style.removeProperty('overflow');
  }

  private currentSection(): 'solutions' | 'industries' | null {
    if (this.isCurrentSection('solutions')) return 'solutions';
    if (this.isCurrentSection('industries')) return 'industries';
    return null;
  }

  private currentPath(): string {
    const pathname = this._document.location?.pathname || '/';
    const baseHref = this._document.querySelector('base')?.getAttribute('href') || '/';
    let basePath = '/';

    try {
      basePath = new URL(baseHref, this._document.location?.origin || 'http://localhost').pathname;
    } catch {
      basePath = '/';
    }

    basePath = basePath.replace(/\/$/, '') || '/';
    const pathWithoutBase = basePath !== '/' && (pathname === basePath || pathname.startsWith(`${basePath}/`))
      ? pathname.slice(basePath.length) || '/'
      : pathname;

    return pathWithoutBase.replace(/\/$/, '') || '/';
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    const trigger = this.mobileMenuOpen ? '.appzpos-header__mobile-toggle'
      : this.openMenu ? `[aria-controls="${this.openMenu}-menu"]` : null;
    this.closeMenus();
    if (trigger) this.elementRef.nativeElement.querySelector<HTMLElement>(trigger)?.focus();
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (window.innerWidth > 1100 && this.mobileMenuOpen) this.closeMenus();
  }

  @HostListener('document:keydown.tab', ['$event'])
  keepMobileFocus(event: KeyboardEvent): void {
    if (!this.mobileMenuOpen) return;
    const controls = Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>('a[href], button'))
      .filter(node => node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.closeMenus();
  }

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
}
