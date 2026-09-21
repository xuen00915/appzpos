import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

@Component({ selector: 'app-home-ecosystem', templateUrl: './home-ecosystem.component.html', styleUrls: ['./home-ecosystem.component.css'] })
export class HomeEcosystemComponent {
  readonly features = [
    { title: 'Customer Relationship Management(CRM)', image: 'APPZPOS-Point-of-Sale-Software-Customer-Relationship-Management.png' },
    { title: 'Local Based Support and Cloud POS System', image: 'APPZPOS-Best-Point-of-Sale-System-Local-Based-Support.png' },
    { title: 'Payment Gateway and Terminal Integration', image: 'APPZPOS-Best-Point-of-Sale-System-Payment-Integration.png' },
    { title: 'Inventory Management', image: 'APPZPOS-Best-Point-of-Sale-System-Inventory-Management.png' },
    { title: 'Delivery & Marketplace Management', image: 'APPZPOS-Point-of-Sale-Software-Delivery-Management.png' },
    { title: 'Data Security', image: 'APPZPOS-Point-of-Sale-Software-Data-Security.png' }
  ];
  constructor(private readonly commonFunctionService: CommonFunctionService) {}
  imageUrl(name: string): string { return this.commonFunctionService.BindURL_Image(name); }
}
