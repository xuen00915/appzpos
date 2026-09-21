import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';

export type IndustryId = 'quick-service' | 'restaurant' | 'retail' | 'salon';
export type HeroTransitionPhase = 'settled' | 'breaking' | 'rebuilding';

export interface HeroIndustry {
  id: IndustryId;
  label: string;
  eyebrow: string;
  workspaceTitle: string;
  screenImage: string;
  modules: string[];
}

const HERO_INDUSTRIES: HeroIndustry[] = [
  {
    id: 'quick-service',
    label: 'Quick Service',
    eyebrow: 'F&B QUICK SERVICE',
    workspaceTitle: 'Counter & pickup orders',
    screenImage: 'assets/images/appzpos-screen-quick-service.png',
    modules: [
      'POS System',
      'Website Ordering',
      'Self Order Kiosk',
      'Kitchen Display System (KDS)',
      'Queue Number Display'
    ]
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    eyebrow: 'F&B RESTAURANT',
    workspaceTitle: 'Table & kitchen orders',
    screenImage: 'assets/images/appzpos-screen-restaurant.png',
    modules: [
      'POS System',
      'Website Ordering',
      'Table QR Ordering',
      'Kitchen Display System (KDS)'
    ]
  },
  {
    id: 'retail',
    label: 'Retail',
    eyebrow: 'RETAIL',
    workspaceTitle: 'Products & checkout',
    screenImage: 'assets/images/appzpos-screen-retail.png',
    modules: [
      'POS System',
      'Website Ordering',
      'Self Order Kiosk'
    ]
  },
  {
    id: 'salon',
    label: 'Salon',
    eyebrow: 'BEAUTY / SALON',
    workspaceTitle: 'Services & customers',
    screenImage: 'assets/images/appzpos-screen-salon.png',
    modules: [
      'POS System',
      'Website Ordering',
      'CRM',
      'Inventory Management',
      'Payment Integration'
    ]
  }
];

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class CustomHomeComponent implements OnInit, OnDestroy {

  readonly industryOptions = HERO_INDUSTRIES;
  activeIndustry = HERO_INDUSTRIES[0];
  activeIndustryId: IndustryId = HERO_INDUSTRIES[0].id;
  transitionPhase: HeroTransitionPhase = 'settled';

  private activeIndustryIndex = 0;
  private autoplayTimer?: ReturnType<typeof setInterval>;
  private transitionTimers: ReturnType<typeof setTimeout>[] = [];
  private autoplayStopped = false;
  private destroyed = false;

  constructor(
    private titleService: Title,
    private commonFunctionService: CommonFunctionService,
    private meta: Meta,
    public dialog: MatDialog
  ) {
    this.titleService.setTitle('APPZPOS Point of Sales | F&B, Retails & Salons | PSG Grant');
  }

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content: 'Singapore #1 Trusted Cloud POS System Provider for F&Bs, Retails & Salons. Get Up to 50% Funding of PSG Grant. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopAutoplay();
    this.clearTransitionTimers();
  }

  selectIndustry(id: IndustryId, manual = false): void {
    if (manual) {
      this.autoplayStopped = true;
      this.stopAutoplay();
    }

    const nextIndex = this.industryOptions.findIndex((industry) => industry.id === id);
    if (nextIndex < 0 || (id === this.activeIndustryId && this.transitionPhase === 'settled')) {
      return;
    }

    this.clearTransitionTimers();
    this.transitionPhase = 'breaking';

    this.scheduleTransition(() => {
      this.activeIndustryIndex = nextIndex;
      this.activeIndustry = this.industryOptions[nextIndex];
      this.activeIndustryId = this.activeIndustry.id;
      this.transitionPhase = 'rebuilding';

      this.scheduleTransition(() => {
        this.transitionPhase = 'settled';
      }, 720);
    }, 480);
  }

  trackModule(_index: number, module: string): string {
    return module;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalRequestDemoComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  private startAutoplay(): void {
    if (this.autoplayStopped || this.autoplayTimer) {
      return;
    }

    this.autoplayTimer = setInterval(() => {
      const nextIndex = (this.activeIndustryIndex + 1) % this.industryOptions.length;
      this.selectIndustry(this.industryOptions[nextIndex].id);
    }, 7000);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  private scheduleTransition(callback: () => void, delay: number): void {
    const timer = setTimeout(() => {
      this.transitionTimers = this.transitionTimers.filter((candidate) => candidate !== timer);
      if (!this.destroyed) {
        callback();
      }
    }, delay);
    this.transitionTimers.push(timer);
  }

  private clearTransitionTimers(): void {
    this.transitionTimers.forEach((timer) => clearTimeout(timer));
    this.transitionTimers = [];
  }
}
