import { HomePageTemplateConfig, HomeSolutionsConfig } from '../home-page-template/home-page-template.models';
import { ENGLISH_HOME_PROOF_CONFIG } from './home-page-proof.en';
import {
  ENGLISH_HOME_FEATURES_CONFIG,
  ENGLISH_HOME_GRANT_CONFIG,
  ENGLISH_HOME_GROWTH_CONFIG,
  ENGLISH_HOME_HARDWARE_CONFIG,
  ENGLISH_HOME_INDUSTRIES_CONFIG
} from './home-page-sections.en';

export const ENGLISH_HOME_SOLUTIONS_CONFIG: HomeSolutionsConfig = {
  eyebrow: 'CONNECTED APPZPOS ECOSYSTEM',
  title: 'Everything Works Together',
  description: 'From order to kitchen, pickup, delivery and management — connect the APPZPOS modules that fit your business.',
  initialItemId: 'dining',
  learnMoreLabel: 'Learn More',
  productOrder: ['admin', 'website', 'dining', 'kiosk', 'queue', 'kitchen', 'delivery'],
  items: [
    {
      id: 'admin', title: 'Admin / Back Office', moduleTitle: 'POS / E-Waiter',
      summary: 'Cloud Based POS system - Access your data anywhere', route: '/cloud-pos-point-of-sales-system',
      image: 'assets/images/ecosystem/ecosystem-dining.webp', imageAlt: 'POS / E-Waiter',
      ariaLabel: 'Explore APPZPOS admin and back office management', depth: .55,
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
      id: 'dining', title: 'Dining / Restaurant', moduleTitle: 'Table QR Ordering',
      summary: 'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones',
      route: '/f&b-restaurant-emenu-qr-code-ordering-system', image: 'assets/images/ecosystem/ecosystem-table-qr.webp',
      imageAlt: 'Table QR Ordering', ariaLabel: 'Explore Table QR Ordering and E-Waiter', depth: .35,
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
      id: 'kitchen', title: 'Kitchen', moduleTitle: 'Kitchen Display System (KDS)',
      summary: 'Order Tracking - Receive real-time updates for new orders, modifications, or cancellations',
      route: '/f&b-restaurant-kitchen-display-system', image: 'assets/images/ecosystem/ecosystem-kitchen.webp',
      imageAlt: 'Kitchen Display System (KDS)', ariaLabel: 'Explore Kitchen Display System', depth: .72,
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
      id: 'kiosk', title: 'Self Ordering Kiosk', moduleTitle: 'Self Ordering Kiosk',
      summary: 'Contactless Ordering - Allow customers to use the self-service kiosk to browse the menu, place orders, process payments, and reduce their wait times',
      route: '/self-order-kiosk-restaurant', image: 'assets/images/ecosystem/ecosystem-kiosk.webp',
      imageAlt: 'Self Ordering Kiosk', ariaLabel: 'Explore Self Ordering Kiosk', depth: .88,
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
      id: 'queue', title: 'Queue Number Display', moduleTitle: 'Queue Number Display',
      summary: 'Order Management - An unique queue number is assigned to orders from all ordering portals',
      route: '/f&b-restaurant-queue-number-display-system', image: 'assets/images/ecosystem/ecosystem-queue.webp',
      imageAlt: 'Queue Number Display', ariaLabel: 'Explore Queue Number Display', depth: .78,
      features: [
        { label: 'Order Management', description: 'An unique queue number is assigned to orders from all ordering portals' },
        { label: 'Queue Number Display', description: 'Syncs with KDS, real time queue number updates when orders are ready for pickup.' },
        { label: 'Screen Display', description: 'Available in different sizes to meet restaurant requirements' },
        { label: 'Advertising Display', description: 'Showcase promotional events, discounts, coupons, or banners alongside queue numbers to attract more customers' }
      ]
    },
    {
      id: 'website', title: 'Website Ordering', moduleTitle: 'Website Ordering',
      summary: 'Online Ordering - Allow customers to place orders online and easily track order status',
      route: '/f&b-restaurant-online-ordering-website', image: 'assets/images/ecosystem/ecosystem-website-ordering.webp',
      imageAlt: 'Website Ordering', ariaLabel: 'Explore Website Ordering on computer and mobile', depth: .68,
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
      id: 'delivery', title: 'Delivery / Order Hub', moduleTitle: 'Order Hub',
      summary: 'Centralized Order Management - Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform',
      route: '/f&b-restaurant-delivery-integration', image: 'assets/images/ecosystem/ecosystem-delivery.webp',
      imageAlt: 'Order Hub', ariaLabel: 'Explore delivery integrations and Order Hub', depth: 1,
      features: [
        { label: 'Centralized Order Management', description: 'Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform' },
        { label: 'Order tracking', description: 'Receive real-time order status updates and directly send to POS and KDS systems' },
        { label: 'Menu Management', description: 'Easily manage your menu details and availability in one centralized system' },
        { label: 'Automated Order Allocation', description: 'Assign Order automatically to specific preparation stations based on delivery date and time' },
        { label: 'Custom Order Handling', description: 'Display driver & customer contact details from each delivery platform in the POS system for easy communication' },
        { label: 'Real-time Overview Report', description: 'Easily monitor all your delivery, online and in-store orders in one POS system' }
      ]
    }
  ]
};

export const ENGLISH_HOME_PAGE_CONFIG: HomePageTemplateConfig = {
  language: 'en',
  layout: 'english-landing',
  hero: {
    headingId: 'appzpos-hero-title',
    title: 'All-In-One POS System',
    titleAccent: 'in Singapore with PSG Grant',
    description: 'Transform your F&B, Retail, & Salon Businesses with APPZPOS Cutting-Edge Point of Sales Software',
    industryTabLabel: 'Preview APPZPOS by business type',
    industryStatusPrefix: 'Showing APPZPOS for',
    visual: {
      kind: 'product-showcase',
      hardwareImage: 'assets/images/appzpos-pos-terminal-hardware-only.png',
      hardwareAlt: 'APPZPOS touchscreen POS terminal with receipt printer',
      hardwareWidth: 1672,
      hardwareHeight: 941,
      brandImage: 'https://appzpos.com/admin/Upload/0771BB36-9631-40F2-A204-C60247E9F1E1/Images/APPZPOS-300X150px.png',
      industries: [
        {
          id: 'quick-service', label: 'Quick Service', eyebrow: 'F&B QUICK SERVICE',
          workspaceTitle: 'Counter & pickup orders', screenImage: 'assets/images/appzpos-screen-quick-service.png',
          modules: ['POS System', 'Website Ordering', 'Self Order Kiosk', 'Kitchen Display System (KDS)', 'Queue Number Display']
        },
        {
          id: 'restaurant', label: 'Restaurant', eyebrow: 'F&B RESTAURANT',
          workspaceTitle: 'Table & kitchen orders', screenImage: 'assets/images/appzpos-screen-restaurant.png',
          modules: ['POS System', 'Website Ordering', 'Table QR Ordering', 'Kitchen Display System (KDS)']
        },
        {
          id: 'retail', label: 'Retail', eyebrow: 'RETAIL',
          workspaceTitle: 'Products & checkout', screenImage: 'assets/images/appzpos-screen-retail.png',
          modules: ['POS System', 'Website Ordering', 'Self Order Kiosk']
        },
        {
          id: 'salon', label: 'Salon', eyebrow: 'BEAUTY / SALON',
          workspaceTitle: 'Services & customers', screenImage: 'assets/images/appzpos-screen-salon.png',
          modules: ['POS System', 'Website Ordering', 'CRM', 'Inventory Management', 'Payment Integration']
        }
      ]
    },
    ctas: [
      { kind: 'action', action: 'request-demo', label: 'Request a Demo' },
      {
        kind: 'link', label: 'WhatsApp Us',
        href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
        target: '_blank', rel: 'noopener noreferrer'
      }
    ]
  },
  solutions: ENGLISH_HOME_SOLUTIONS_CONFIG,
  hardware: ENGLISH_HOME_HARDWARE_CONFIG,
  growth: ENGLISH_HOME_GROWTH_CONFIG,
  grant: ENGLISH_HOME_GRANT_CONFIG,
  features: ENGLISH_HOME_FEATURES_CONFIG,
  industries: ENGLISH_HOME_INDUSTRIES_CONFIG,
  proof: ENGLISH_HOME_PROOF_CONFIG,
  conversion: { locale: 'en', sectionId: 'requestdemo' }
};
