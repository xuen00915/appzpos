import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

export interface HomeIndustryStory { title: string; description: string; image: string; alt: string; href: string; modules: readonly string[]; }

@Component({ selector: 'app-home-industries', templateUrl: './home-industries.component.html', styleUrls: ['./home-industries.component.css'] })
export class HomeIndustriesComponent {
  readonly stories: readonly HomeIndustryStory[] = [
    { title: 'F&B Quick Service', description: 'Adapt to Customer Demand Effectively in Quick Service Restaurant', image: 'APPZPOS-All-in-One-Pos-System-quick-service.png', alt: 'APPZPOS All-in-One POS System for quick service', href: '/f&b-restaurant-cloud-pos-system', modules: ['POS System', 'Website Order', 'Self Order Kiosk', 'Queue Number Display', 'Kitchen Display System (KDS)'] },
    { title: 'F&B Restaurant', description: 'Deliver an All-in-One POS Solution for Streamlined Restaurant Operations', image: 'APPZPOS-All-in-One-Pos-System-restaurant.png', alt: 'APPZPOS All-in-One POS System for restaurant', href: '/f&b-restaurant-cloud-pos-system', modules: ['POS System', 'Website Order', 'Table QR Order', 'Kitchen Display System (KDS)'] },
    { title: 'Retail Stores & Boutiques', description: 'Boost Your Retail Sales, Enhance Service, and Improve Efficiency.', image: 'APPZPOS-All-in-One-Pos-System-retail.png', alt: 'APPZPOS All-in-One POS System for retail', href: '/retail-store-cloud-pos-system', modules: ['POS System', 'Website Order', 'Self Order Kiosk'] },
    { title: 'Beauty Salons, SPA & Wellness', description: 'Expand and Retain Your Beauty Store Customer Base with a Powerful CRM', image: 'APPZPOS-All-in-One-Pos-System-beauty-salon.png', alt: 'APPZPOS All-in-One POS System for beauty salon', href: '/salon-cloud-pos-system', modules: ['POS System', 'Website Order'] }
  ];
  constructor(private readonly commonFunctionService: CommonFunctionService) {}
  imageUrl(name: string): string { return this.commonFunctionService.BindURL_Image(name); }
}
