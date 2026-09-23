import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

export interface HomeProductModule {
  id: string;
  label: string;
  title: string;
  summary: string;
  image: string;
  href: string;
  bullets: readonly string[];
}

@Component({
  selector: 'app-home-product-suite',
  templateUrl: './home-product-suite.component.html',
  styleUrls: ['./home-product-suite.component.css']
})
export class HomeProductSuiteComponent {
  readonly modules: readonly HomeProductModule[] = [
    { id: 'pos', label: 'POS / E-Waiter', title: 'POS / E-Waiter', summary: 'Cloud based POS system - access the data anywhere', image: 'APPZPOS-best-pos-system-singapore-cloud-POS-system.png', href: '/cloud-pos-point-of-sales-system', bullets: ['Easy menu setup - modifiers, promotion items or bundle', 'Report - Daily Sales, Item Sales, Customer Sales', 'CRM - collect customer data and offer loyalty programs with tier based'] },
    { id: 'website', label: 'Website Ordering', title: 'Website Ordering', summary: 'Online Ordering - Allow customers to place orders online and easily track order status', image: 'APPZPOS-best-point-of-sale-system-Website-ordering.png', href: '/f&b-restaurant-online-ordering-website', bullets: ['Order Scheduling - Allow customers reserve or schedule Future Delivery or Pickup Orders', 'Online Payment - Multiple integrated payment options for customer to pay securely through website'] },
    { id: 'qr', label: 'Table QR Ordering', title: 'Table QR Ordering', summary: 'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones', image: 'APPZPOS-best-point-of-sale-system-Table-QR-Ordering.png', href: '/f&b-restaurant-emenu-qr-code-ordering-system', bullets: ['Cost Savings - Reduce Printed Menu & dependence on manpower', 'Online Payment - Multiple integrated payment options for customer to pay securely through mobile'] },
    { id: 'kiosk', label: 'Self Ordering Kiosk', title: 'Self Ordering Kiosk', summary: 'Contactless Ordering - Allow customers to use the self-service kiosk to browse the menu, place orders, process payments, and reduce their wait times', image: 'APPZPOS-all-in-one-pos-system-Self-order-kiosk.png', href: '/self-order-kiosk-restaurant', bullets: ['Interactive Interface - User-friendly touchscreen interfaces allow customers to easily navigate through the ordering process', 'Secure Payment - Multiple payment options with integrated payment terminals & online payment gateways'] },
    { id: 'queue', label: 'Queue Number Display', title: 'Queue Number Display', summary: 'Order Management - An unique queue number is assigned to orders from all ordering portals', image: 'APPZPOS-point-of-sales-system-singapore-queue-number-display2.png', href: '/f&b-restaurant-queue-number-display-system', bullets: ['Queue Number Display - Syncs with KDS, real time queue number updates when orders are ready for pickup.'] },
    { id: 'kds', label: 'Kitchen Display System (KDS)', title: 'Kitchen Display System (KDS)', summary: 'Order Tracking - Receive real-time updates for new orders, modifications, or cancellations', image: 'APPZPOS-point-of-sales-system-Kitchen-display-system-KDS.png', href: '/f&b-restaurant-kitchen-display-system', bullets: ['Visual Alerts - Color indication to convey the status of orders (e.g., new orders, in progress, completed)', 'Error Reduction - Minimize order errors'] },
    { id: 'hub', label: 'Order Hub', title: 'Order Hub', summary: 'Centralized Order Management - Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform', image: 'APPZPOS-best-pos-system-singapore-order-hub.png', href: '/f&b-restaurant-delivery-integration', bullets: ['Order tracking - Receive real-time order status updates and directly send to POS and KDS systems', 'Real-time Overview Report - Easily monitor all your delivery, online and in-store orders in one POS system'] }
  ];
  activeIndex = 0;

  constructor(private readonly commonFunctionService: CommonFunctionService) {}

  get activeModule(): HomeProductModule { return this.modules[this.activeIndex]; }
  imageUrl(name: string): string { return this.commonFunctionService.BindURL_Image(name); }
  select(index: number): void { this.activeIndex = index; }
  handleKeys(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') this.activeIndex = 0;
    else if (event.key === 'End') this.activeIndex = this.modules.length - 1;
    else this.activeIndex = (this.activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + this.modules.length) % this.modules.length;
  }
}
