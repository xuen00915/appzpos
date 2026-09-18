import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomHomeComponent } from '../components/index/index.component';
import { CustomHomeCNComponent } from '../components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component';
import { CustomPartnerIntegrationComponent } from '../components/pos-solutions-partner-integrations/pos-solutions-partner-integrations.component';
import { NoPageFoundComponent } from 'src/app/components/canvas/static/no-page-found/no-page-found.component';
import { CustomContactComponent } from '../components/point-of-sales-demo-quotation/point-of-sales-demo-quotation.component';
import { CustomIndustryRestaurantComponent } from '../components/f&b-restaurant-cloud-pos-system/f&b-restaurant-cloud-pos-system.component';
import { CustomSolutionsComponent } from '../components/custom-solutions/custom-solutions.component';
import { CustomIndustryRestoreStoreComponent } from '../components/retail-store-cloud-pos-system/retail-store-cloud-pos-system.component';
import { CustomIndustryBeautySalonsComponent } from '../components/salon-cloud-pos-system/salon-cloud-pos-system.component';
import { CustomPSGComponent } from '../components/psg-pos-system-grant-singapore/psg-pos-system-grant-singapore.component';
import { CustomPOSEWaiterComponent } from '../components/cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component';
import { CustomQROrderComponent } from '../components/f&b-restaurant-emenu-qr-code-ordering-system/f&b-restaurant-emenu-qr-code-ordering-system.component';
import { CustomWebsiteOrderComponent } from '../components/f&b-restaurant-online-ordering-website/f&b-restaurant-online-ordering-website.component';
import { CustomSelfOrderKioskComponent } from '../components/self-order-kiosk-restaurant/self-order-kiosk-restaurant.component';
import { CustomKitchenDisplaySystemComponent } from '../components/f&b-restaurant-kitchen-display-system/f&b-restaurant-kitchen-display-system.component';
import { CustomQueueSystemComponent } from '../components/f&b-restaurant-queue-number-display-system/f&b-restaurant-queue-number-display-system.component';
import { CustomOrderHubComponent } from '../components/f&b-restaurant-delivery-integration/f&b-restaurant-delivery-integration.component';
import { CustomFeaturesComponent } from '../components/pos-features-crm-payment-gateway/pos-features-crm-payment-gateway.component';
import { CustomHardwareComponent } from '../components/pos-hardware-machine-receipt-printer/pos-hardware-machine-receipt-printer.component';
import { BlogMainPageComponent } from '../components/blogs/blog-main-page/blog-main-page.component';
import { BlogBcrsComponent } from '../components/blogs/blog-bcrs/blog-bcrs.component';

const routes: Routes = [
  { path: '', component: CustomHomeComponent },
  { path: 'cn-f&b-restaurant-cloud-pos-system', component: CustomHomeCNComponent },
  { path: 'custom-solutions', component: CustomSolutionsComponent },
  { path: 'point-of-sales-demo-quotation', component: CustomContactComponent },
  { path: 'f&b-restaurant-cloud-pos-system', component: CustomIndustryRestaurantComponent },
  { path: 'retail-store-cloud-pos-system', component: CustomIndustryRestoreStoreComponent },
  { path: 'salon-cloud-pos-system', component: CustomIndustryBeautySalonsComponent },
  { path: 'pos-features-crm-payment-gateway', component: CustomFeaturesComponent },
  { path: 'psg-pos-system-grant-singapore', component: CustomPSGComponent },
  { path: 'cloud-pos-point-of-sales-system', component: CustomPOSEWaiterComponent },
  { path: 'f&b-restaurant-emenu-qr-code-ordering-system', component: CustomQROrderComponent },
  { path: 'f&b-restaurant-online-ordering-website', component: CustomWebsiteOrderComponent },
  { path: 'self-order-kiosk-restaurant', component: CustomSelfOrderKioskComponent },
  { path: 'f&b-restaurant-kitchen-display-system', component: CustomKitchenDisplaySystemComponent },
  { path: 'f&b-restaurant-queue-number-display-system', component: CustomQueueSystemComponent },
  { path: 'f&b-restaurant-delivery-integration', component: CustomOrderHubComponent },
  { path: 'pos-hardware-machine-receipt-printer', component: CustomHardwareComponent },
  { path: 'pos-solutions-partner-integrations', component: CustomPartnerIntegrationComponent },
  { path: 'blog', component: BlogMainPageComponent },
  { path: 'blog-bcrs', component: BlogBcrsComponent },
  { path: '**', component: NoPageFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomAppRoutingModule { }
