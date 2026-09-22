import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPOSEWaiterComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component';
import { CustomOrderHubComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-delivery-integration/f&b-restaurant-delivery-integration.component';
import { CustomQROrderComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-emenu-qr-code-ordering-system/f&b-restaurant-emenu-qr-code-ordering-system.component';
import { CustomKitchenDisplaySystemComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-kitchen-display-system/f&b-restaurant-kitchen-display-system.component';
import { CustomWebsiteOrderComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-online-ordering-website/f&b-restaurant-online-ordering-website.component';
import { CustomQueueSystemComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-queue-number-display-system/f&b-restaurant-queue-number-display-system.component';
import { CustomSelfOrderKioskComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/self-order-kiosk-restaurant/self-order-kiosk-restaurant.component';
import { SolutionHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

interface HeroCase {
  component: Type<unknown>;
  image: string;
  title: string;
}

describe('solution island heroes', () => {
  const cases: readonly HeroCase[] = [
    {
      component: CustomPOSEWaiterComponent,
      image: 'assets/images/ecosystem/ecosystem-pos-ewaiter.webp',
      title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System'
    },
    {
      component: CustomQROrderComponent,
      image: 'assets/images/ecosystem/ecosystem-table-qr.webp',
      title: 'APPZPOS Table QR Code Ordering System for Restaurants'
    },
    {
      component: CustomKitchenDisplaySystemComponent,
      image: 'assets/images/ecosystem/ecosystem-kitchen.webp',
      title: 'APPZPOS Kitchen Order Display System for Restaurants'
    },
    {
      component: CustomSelfOrderKioskComponent,
      image: 'assets/images/ecosystem/ecosystem-kiosk.webp',
      title: 'APPZPOS Self Ordering System for Quick Service Restaurants'
    },
    {
      component: CustomQueueSystemComponent,
      image: 'assets/images/ecosystem/ecosystem-queue.webp',
      title: 'Restaurant Queue Management System with APPZPOS Queue Number Display'
    },
    {
      component: CustomWebsiteOrderComponent,
      image: 'assets/images/ecosystem/ecosystem-website-ordering.webp',
      title: 'APPZPOS Online Website Ordering System'
    },
    {
      component: CustomOrderHubComponent,
      image: 'assets/images/ecosystem/ecosystem-delivery.webp',
      title: 'Centralized Delivery Platform Integration Through APPZPOS Order Hub'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [...cases.map((item) => item.component), SolutionHeroComponent],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('maps all seven local ecosystem islands to their matching solution page titles', () => {
    const fixtures: ComponentFixture<unknown>[] = [];

    for (const item of cases) {
      const fixture = TestBed.createComponent(item.component);
      fixtures.push(fixture);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      const hero = host.querySelector<HTMLElement>('[data-solution-hero], .solution-island-hero');

      expect(hero).withContext(item.title).not.toBeNull();
      expect(hero?.querySelector('img')?.getAttribute('src')).withContext(item.title).toBe(item.image);
      expect(hero?.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim())
        .withContext(item.title)
        .toBe(item.title);
      expect(host.querySelectorAll('[data-solution-hero], .solution-island-hero').length)
        .withContext(item.title)
        .toBe(1);

      if (item.component === CustomPOSEWaiterComponent) {
        expect(host.querySelector('app-solution-hero')).not.toBeNull();
        expect(host.querySelectorAll('[data-solution-hero]').length).toBe(1);
        expect(hero?.querySelector('img')?.getAttribute('width')).toBe('739');
        expect(hero?.querySelector('img')?.getAttribute('height')).toBe('486');
      }
    }

    fixtures.forEach((fixture) => fixture.destroy());
  });
});
