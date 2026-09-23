import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

interface EcosystemIsland {
  id: string;
  title: string;
  modules: readonly IslandModuleSummary[];
  route: string;
  image: string;
  ariaLabel: string;
  depth: number;
}

interface IslandModuleSummary {
  moduleId: string;
  title: string;
  summary: string;
}

interface ProductFeature {
  label: string;
  description: string;
}

interface ProductModule {
  id: string;
  title: string;
  route: string;
  image: string;
  features: readonly ProductFeature[];
}

@Component({
  selector: 'app-home-order-flow',
  templateUrl: './home-order-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOrderFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ecosystemSection') private sectionRef?: ElementRef<HTMLElement>;
  @ViewChild('ecosystemStage') private stageRef?: ElementRef<HTMLElement>;

  readonly islands: readonly EcosystemIsland[] = [
    {
      id: 'admin',
      title: 'Admin / Back Office',
      modules: [{
        moduleId: 'pos',
        title: 'POS / E-Waiter',
        summary: 'Cloud Based POS system - Access your data anywhere'
      }],
      route: '/cloud-pos-point-of-sales-system',
      image: 'assets/images/ecosystem/ecosystem-admin.webp',
      ariaLabel: 'Explore APPZPOS admin and back office management',
      depth: .55
    },
    {
      id: 'dining',
      title: 'Dining / Restaurant',
      modules: [{
        moduleId: 'qr',
        title: 'Table QR Ordering',
        summary: 'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones'
      }],
      route: '/f&b-restaurant-emenu-qr-code-ordering-system',
      image: 'assets/images/ecosystem/ecosystem-dining.webp',
      ariaLabel: 'Explore Table QR Ordering and E-Waiter',
      depth: .35
    },
    {
      id: 'kitchen',
      title: 'Kitchen',
      modules: [{
        moduleId: 'kds',
        title: 'Kitchen Display System (KDS)',
        summary: 'Order Tracking - Receive real-time updates for new orders, modifications, or cancellations'
      }],
      route: '/f&b-restaurant-kitchen-display-system',
      image: 'assets/images/ecosystem/ecosystem-kitchen.webp',
      ariaLabel: 'Explore Kitchen Display System',
      depth: .72
    },
    {
      id: 'kiosk',
      title: 'Self Ordering Kiosk',
      modules: [{
        moduleId: 'kiosk',
        title: 'Self Ordering Kiosk',
        summary: 'Contactless Ordering - Allow customers to use the self-service kiosk to browse the menu, place orders, process payments, and reduce their wait times'
      }],
      route: '/self-order-kiosk-restaurant',
      image: 'assets/images/ecosystem/ecosystem-kiosk.webp',
      ariaLabel: 'Explore Self Ordering Kiosk',
      depth: .88
    },
    {
      id: 'queue',
      title: 'Queue Number Display',
      modules: [{
        moduleId: 'queue',
        title: 'Queue Number Display',
        summary: 'Order Management - An unique queue number is assigned to orders from all ordering portals'
      }],
      route: '/f&b-restaurant-queue-number-display-system',
      image: 'assets/images/ecosystem/ecosystem-queue.webp',
      ariaLabel: 'Explore Queue Number Display',
      depth: .78
    },
    {
      id: 'website',
      title: 'Website Ordering',
      modules: [{
        moduleId: 'website',
        title: 'Website Ordering',
        summary: 'Online Ordering - Allow customers to place orders online and easily track order status'
      }],
      route: '/f&b-restaurant-online-ordering-website',
      image: 'assets/images/ecosystem/ecosystem-website-ordering.webp',
      ariaLabel: 'Explore Website Ordering on computer and mobile',
      depth: .68
    },
    {
      id: 'delivery',
      title: 'Delivery / Order Hub',
      modules: [{
        moduleId: 'hub',
        title: 'Order Hub',
        summary: 'Centralized Order Management - Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform'
      }],
      route: '/f&b-restaurant-delivery-integration',
      image: 'assets/images/ecosystem/ecosystem-delivery.webp',
      ariaLabel: 'Explore delivery integrations and Order Hub',
      depth: 1
    }
  ];

  readonly productModules: readonly ProductModule[] = [
    {
      id: 'pos',
      title: 'POS / E-Waiter',
      route: '/cloud-pos-point-of-sales-system',
      image: 'APPZPOS-best-pos-system-singapore-cloud-POS-system.png',
      features: [
        { label: 'Cloud Based POS system', description: 'Access your data anywhere' },
        { label: 'Simple menu setup', description: 'Menu items, modifiers, sale items or bundles' },
        { label: 'Real Time Report', description: 'Daily Sales, Item Sales, Customer Sales' },
        { label: 'Smart Inventory', description: 'Monitor item balances & set up alerts' },
        { label: 'Table Management', description: 'Monitor table occupancy status with floorplan view' },
        { label: 'CRM', description: 'Collect customer data & reward loyalty with tier based' },
        { label: 'Delivery Integration', description: 'Integrated with Grab, Foodpanda, and Deliveroo apps' },
        { label: 'Multiple Languages', description: 'Menus in different languages to serve a diverse clientele' },
        { label: 'Other Features', description: 'Split bill and order, transfer order, employee clock-in, etc..' }
      ]
    },
    {
      id: 'website',
      title: 'Website Ordering',
      route: '/f&b-restaurant-online-ordering-website',
      image: 'APPZPOS-best-point-of-sale-system-Website-ordering.png',
      features: [
        { label: 'Online Ordering', description: 'Allow customers to place orders online and easily track order status' },
        { label: 'Order Scheduling', description: 'Allow customers reserve or schedule Future Delivery or Pickup Orders' },
        { label: 'Menu Customization', description: 'Easily update your menu details & availability in real-time through the portal' },
        { label: 'Online Payment', description: 'Multiple integrated payment options for customer to pay securely through website' },
        { label: 'Multiple Languages', description: 'Menus in different languages to serve a diverse clientele' },
        { label: 'Advertising Display', description: 'Showcase promotional events, discounts, coupons, or banners to attract more customers' },
        { label: 'Delivery Management', description: 'Integrated with Grabexpress, Lalamove, Pandago for delivery' }
      ]
    },
    {
      id: 'qr',
      title: 'Table QR Ordering',
      route: '/f&b-restaurant-emenu-qr-code-ordering-system',
      image: 'APPZPOS-best-point-of-sale-system-Table-QR-Ordering.png',
      features: [
        { label: 'E-Menu Ordering', description: 'Customers scan a QR code to view the menu, and place orders from their phones' },
        { label: 'Cost Savings', description: 'Reduce Printed Menu & dependence on manpower' },
        { label: 'Menu Customization', description: 'Easily update your menu details & availability in real-time through the portal' },
        { label: 'Online Payment', description: 'Multiple integrated payment options for customer to pay securely through mobile' },
        { label: 'Advertising Display', description: 'Showcase promotional events, discounts, coupons, or banners to attract more customers' },
        { label: 'Multiple Languages', description: 'Menus in different languages to serve a diverse clientele' }
      ]
    },
    {
      id: 'kiosk',
      title: 'Self Ordering Kiosk',
      route: '/self-order-kiosk-restaurant',
      image: 'APPZPOS-all-in-one-pos-system-Self-order-kiosk.png',
      features: [
        { label: 'Contactless Ordering', description: 'Allow customers to use the self-service kiosk to browse the menu, place orders, process payments, and reduce their wait times' },
        { label: 'Cost Savings', description: 'Reduce Printed Menu & dependence on manpower' },
        { label: 'Interactive Interface', description: 'User-friendly touchscreen interfaces allow customers to easily navigate through the ordering process' },
        { label: 'Kiosk Options', description: '15.6”, 21”, 24” and 32” monitor with countertop or pedestal mounting' },
        { label: 'Customization', description: 'easily update menu details, update availability, and run promotions' },
        { label: 'Advertising Idle Page', description: 'Showcase promotional events, discounts, coupons, or banners to attract more customers' },
        { label: 'Secure Payment', description: 'Multiple payment options with integrated payment terminals & online payment gateways' },
        { label: 'Multiple Languages', description: 'Menus in different languages to serve a diverse clientele' }
      ]
    },
    {
      id: 'queue',
      title: 'Queue Number Display',
      route: '/f&b-restaurant-queue-number-display-system',
      image: 'APPZPOS-point-of-sales-system-singapore-queue-number-display2.png',
      features: [
        { label: 'Order Management', description: 'An unique queue number is assigned to orders from all ordering portals' },
        { label: 'Queue Number Display', description: 'Syncs with KDS, real time queue number updates when orders are ready for pickup.' },
        { label: 'Screen Display', description: 'Available in different sizes to meet restaurant requirements' },
        { label: 'Advertising Display', description: 'Showcase promotional events, discounts, coupons, or banners alongside queue numbers to attract more customers' }
      ]
    },
    {
      id: 'kds',
      title: 'Kitchen Display System (KDS)',
      route: '/f&b-restaurant-kitchen-display-system',
      image: 'APPZPOS-point-of-sales-system-Kitchen-display-system-KDS.png',
      features: [
        { label: 'Order Tracking', description: 'Receive real-time updates for new orders, modifications, or cancellations' },
        { label: 'Custom Interface', description: 'Customize the KDS interface to match your kitchen workflow' },
        { label: 'Visual Alerts', description: 'Color indication to convey the status of orders (e.g., new orders, in progress, completed)' },
        { label: 'Integration', description: "Linked with Queue Number Display to show 'In-Process' and 'Ready for Collection' orders" },
        { label: 'Order Timing', description: 'Allow kitchen staff to coordinate order preparations with estimated cooking times' },
        { label: 'Error Reduction', description: 'Minimize order errors' }
      ]
    },
    {
      id: 'hub',
      title: 'Order Hub',
      route: '/f&b-restaurant-delivery-integration',
      image: 'APPZPOS-best-pos-system-singapore-order-hub.png',
      features: [
        { label: 'Centralized Order Management', description: 'Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform' },
        { label: 'Order tracking', description: 'Receive real-time order status updates and directly send to POS and KDS systems' },
        { label: 'Menu Management', description: 'Easily manage your menu details and availability in one centralized system' },
        { label: 'Automated Order Allocation', description: 'Assign Order automatically to specific preparation stations based on delivery date and time' },
        { label: 'Custom Order Handling', description: 'Display driver & customer contact details from each delivery platform in the POS system for easy communication' },
        { label: 'Real-time Overview Report', description: 'Easily monitor all your delivery, online and in-store orders in one POS system' }
      ]
    }
  ];

  activeIslandId: string | null = null;
  activeDetailsIslandId: string | null = 'dining';
  isVisible = false;
  reducedMotion = false;

  private coarsePointer = false;
  private intersectionObserver?: IntersectionObserver;
  private animationFrameId?: number;
  private pointerFrameId?: number;
  private frameRunning = false;
  private destroyed = false;
  private pointerX = 0;
  private pointerY = 0;
  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const canQueryMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    this.reducedMotion = !canQueryMedia
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.coarsePointer = canQueryMedia
      && window.matchMedia('(pointer: coarse)').matches;
    this.isVisible = this.reducedMotion || typeof window.IntersectionObserver !== 'function';
  }

  ngAfterViewInit(): void {
    if (!this.sectionRef || this.reducedMotion || typeof window.IntersectionObserver !== 'function') {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.intersectionObserver = new window.IntersectionObserver((entries) => {
        this.handleIntersection(entries.some((entry) => entry.isIntersecting));
      }, { threshold: .08, rootMargin: '8% 0px 8% 0px' });
      this.intersectionObserver.observe(this.sectionRef!.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.frameRunning = false;
    this.intersectionObserver?.disconnect();
    if (this.animationFrameId !== undefined) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.pointerFrameId !== undefined) {
      window.cancelAnimationFrame(this.pointerFrameId);
    }
  }

  setActiveIsland(id: string): void {
    this.activeIslandId = id;
    this.changeDetectorRef.markForCheck();
  }

  clearActiveIsland(): void {
    this.activeIslandId = null;
    this.changeDetectorRef.markForCheck();
  }

  get activeDetailsIsland(): EcosystemIsland | undefined {
    return this.islands.find((island) => island.id === this.activeDetailsIslandId);
  }

  get activeDetailsModules(): readonly ProductModule[] {
    const moduleIds = this.activeDetailsIsland?.modules.map((module) => module.moduleId) ?? [];
    return moduleIds
      .map((moduleId) => this.productModules.find((module) => module.id === moduleId))
      .filter((module): module is ProductModule => Boolean(module));
  }

  openIslandDetails(event: Event, islandId: string): false {
    event.preventDefault();
    event.stopPropagation();
    this.activeDetailsIslandId = islandId;
    this.activeIslandId = islandId;
    this.changeDetectorRef.markForCheck();
    return false;
  }

  handlePointerMove(event: PointerEvent): void {
    const stage = this.stageRef?.nativeElement;
    if (!stage || this.reducedMotion || this.coarsePointer) {
      return;
    }

    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) {
      return;
    }

    this.pointerX = this.clamp((((event.clientX - bounds.left) / bounds.width) - .5) * 10, -5, 5);
    this.pointerY = this.clamp((((event.clientY - bounds.top) / bounds.height) - .5) * 10, -5, 5);
    this.schedulePointerRender();
  }

  resetPointerParallax(): void {
    this.pointerX = 0;
    this.pointerY = 0;
    this.applyTransforms();
  }

  private handleIntersection(isIntersecting: boolean): void {
    if (isIntersecting && !this.isVisible) {
      this.ngZone.run(() => {
        this.isVisible = true;
        this.changeDetectorRef.markForCheck();
      });
    }

    if (!isIntersecting) {
      this.stopFrameLoop();
      return;
    }

    if (!this.reducedMotion && !this.frameRunning && !this.destroyed) {
      this.frameRunning = true;
      this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
    }
  }

  private readonly renderFrame = (): void => {
    if (!this.frameRunning || this.destroyed) {
      return;
    }
    this.applyTransforms();
    this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
  };

  private schedulePointerRender(): void {
    if (this.pointerFrameId !== undefined) {
      return;
    }
    this.pointerFrameId = window.requestAnimationFrame(() => {
      this.pointerFrameId = undefined;
      this.applyTransforms();
    });
  }

  private applyTransforms(): void {
    const stage = this.stageRef?.nativeElement;
    const section = this.sectionRef?.nativeElement;
    if (!stage || !section) {
      return;
    }

    const bounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const travel = this.clamp(
      ((viewportHeight - bounds.top) / (viewportHeight + Math.max(bounds.height, 1))) - .5,
      -.5,
      .5
    );

    stage.querySelectorAll<HTMLElement>('[data-ecosystem-island]').forEach((island) => {
      const depth = Number(island.dataset['depth']) || 0;
      const direction = island.classList.contains('appz-ecosystem__island--lower') ? -1 : 1;
      island.style.setProperty('--pointer-x', `${this.round(this.pointerX * depth)}px`);
      island.style.setProperty('--pointer-y', `${this.round(this.pointerY * depth)}px`);
      island.style.setProperty('--scroll-y', `${this.round(travel * 24 * depth * direction)}px`);
    });
  }

  private stopFrameLoop(): void {
    this.frameRunning = false;
    if (this.animationFrameId !== undefined) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, value));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
