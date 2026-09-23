import { IndustryWorkflowDirective } from '../components/industry-page/industry-workflow.directive';
import { NgModule } from '@angular/core';
import { IndustryPageComponent, IndustryIslandsComponent } from '../components/industry-page/industry-page.component';
import { IndustryDiagramHandoffDirective } from '../components/industry-page/industry-diagram-handoff.directive';
import { CommonModule } from '@angular/common';
import { CustomAppRoutingModule } from '../modules/custom-app-routing.module';
import { CustomHeaderComponent } from '../components/custom-header/custom-header.component';
import { CustomFooterComponent } from '../components/custom-footer/custom-footer.component';
import { CustomHomeComponent } from '../components/index/index.component';
import { CustomHomeCNComponent } from '../components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component';
import { CustomPartnerIntegrationComponent } from '../components/pos-solutions-partner-integrations/pos-solutions-partner-integrations.component';
import { CustomWhiteHeaderComponent } from '../components/custom-white-header/custom-white-header.component';
import { CustomTransparentHeaderComponent } from '../components/custom-transparent-header/custom-transparent-header.component';
import { CustomRequestDemoComponent } from '../components/custom-request-demo/custom-request-demo.component';
import { CNCustomRequestDemoComponent } from '../components/cn-custom-request-demo/cn-custom-request-demo.component';
import { ModalRequestDemoComponent } from '../components/modal-request-demo/modal-request-demo.component';
import { CNModalRequestDemoComponent } from '../components/cn-modal-request-demo/cn-modal-request-demo.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule} from '@angular/forms';
import { CustomIndustryBeautySalonsComponent } from '../components/salon-cloud-pos-system/salon-cloud-pos-system.component';
import { CustomIndustryRestaurantComponent } from '../components/f&b-restaurant-cloud-pos-system/f&b-restaurant-cloud-pos-system.component';
import { CustomIndustryRestoreStoreComponent } from '../components/retail-store-cloud-pos-system/retail-store-cloud-pos-system.component';
import { CustomPSGComponent } from '../components/psg-pos-system-grant-singapore/psg-pos-system-grant-singapore.component';
import { CustomContactComponent } from '../components/point-of-sales-demo-quotation/point-of-sales-demo-quotation.component';
import { CustomPOSEWaiterComponent } from '../components/cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component';
import { CustomQROrderComponent } from '../components/f&b-restaurant-emenu-qr-code-ordering-system/f&b-restaurant-emenu-qr-code-ordering-system.component';
import { CustomWebsiteOrderComponent } from '../components/f&b-restaurant-online-ordering-website/f&b-restaurant-online-ordering-website.component';
import { CustomSelfOrderKioskComponent } from '../components/self-order-kiosk-restaurant/self-order-kiosk-restaurant.component';
import { CustomKitchenDisplaySystemComponent } from '../components/f&b-restaurant-kitchen-display-system/f&b-restaurant-kitchen-display-system.component';
import { CustomQueueSystemComponent } from '../components/f&b-restaurant-queue-number-display-system/f&b-restaurant-queue-number-display-system.component';
import { CustomOrderHubComponent } from '../components/f&b-restaurant-delivery-integration/f&b-restaurant-delivery-integration.component';
import { CustomFeaturesComponent } from '../components/pos-features-crm-payment-gateway/pos-features-crm-payment-gateway.component';
import { CustomHardwareComponent } from '../components/pos-hardware-machine-receipt-printer/pos-hardware-machine-receipt-printer.component';
import { HomeOrderFlowComponent } from '../components/home-order-flow/home-order-flow.component';
import { HomeProductSuiteComponent } from '../components/home-product-suite/home-product-suite.component';
import { HomeIndustriesComponent } from '../components/home-industries/home-industries.component';
import { HomeEcosystemComponent } from '../components/home-ecosystem/home-ecosystem.component';
import { HomeProofComponent } from '../components/home-proof/home-proof.component';
import { HomePageTemplateComponent } from '../components/home-page-template/home-page-template.component';
import { HomeHeroComponent } from '../components/home-hero/home-hero.component';
import { HomeStorySectionsComponent } from '../components/home-story-sections/home-story-sections.component';
import { MarketingRevealDirective } from '../components/marketing-reveal/marketing-reveal.directive';
import { SolutionHeroComponent } from '../components/solution-hero/solution-hero.component';
import { SolutionPageComponent, SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent } from '../components/solution-page/solution-page.component';
import { MatDialogRef } from '@angular/material/dialog';


@NgModule({
  declarations: [
    CustomHeaderComponent,
    CustomFooterComponent,
    CustomHomeComponent,
    CustomHomeCNComponent,
    CustomPartnerIntegrationComponent,
    CustomWhiteHeaderComponent,
    CustomTransparentHeaderComponent,
    CustomIndustryBeautySalonsComponent,
    CustomRequestDemoComponent,
    CNCustomRequestDemoComponent,
    ModalRequestDemoComponent,
    CNModalRequestDemoComponent,
    CustomIndustryRestaurantComponent,
    CustomIndustryRestoreStoreComponent,
    CustomPSGComponent,
    CustomContactComponent,
    CustomPOSEWaiterComponent,
    CustomQROrderComponent,
    CustomWebsiteOrderComponent,
    CustomSelfOrderKioskComponent,
    CustomKitchenDisplaySystemComponent,
    CustomQueueSystemComponent,
    CustomOrderHubComponent,
    CustomFeaturesComponent,
    CustomHardwareComponent,
    HomeOrderFlowComponent,
    HomeProductSuiteComponent,
    HomeIndustriesComponent,
    HomeEcosystemComponent,
    HomeProofComponent,
    HomePageTemplateComponent,
    HomeHeroComponent,
    HomeStorySectionsComponent,
    MarketingRevealDirective,
    SolutionHeroComponent,
  ],
  imports: [
    IndustryPageComponent, IndustryIslandsComponent, IndustryDiagramHandoffDirective, IndustryWorkflowDirective,
    SolutionPageComponent,
    SolutionFeatureHeadingComponent, SolutionHardwareFiltersComponent,
    CommonModule,
    CustomAppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CustomHeaderComponent,
    CustomFooterComponent,
    CustomHomeComponent
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
 ],
})
export class CustomAppModule { }
