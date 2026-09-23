import {
  HomeFeatureSectionConfig,
  HomeGrantConfig,
  HomeGrowthSectionConfig,
  HomeHardwareConfig,
  HomeIndustrySectionConfig
} from '../home-page-template/home-page-template.models';

export const ENGLISH_HOME_HARDWARE_CONFIG: HomeHardwareConfig = {
  eyebrow: 'Software + Hardware',
  title: 'Integrated POS System with Customized Software and Hardware',
  paragraphs: [
    'APPZPOS delivers comprehensive POS solutions, featuring flexible software and hardware setups designed to meet your specific business requirements. Our system provides complete restaurant management, equipped with powerful tools for third-party integrations, contactless ordering, delivery, inventory management, data analytics, and more.'
  ],
  image: 'APPZPOS-Pos-Point-of-Sales-System-Customized-Software-and-Hardware.png',
  imageAlt: 'APPZPOS Integrated POS System with Customized Software and Hardware',
  imageWidth: 900,
  imageHeight: 760,
  cta: {
    kind: 'link',
    href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
    label: 'WhatsApp Us',
    target: '_blank',
    rel: 'noopener'
  }
};

export const ENGLISH_HOME_GRANT_CONFIG: HomeGrantConfig = {
  title: 'Up to 50% Monetary Support',
  secondaryTitle: 'To Kickstart To Your F&B Business',
  paragraphs: [
    'SMEs are eligible for up to 50% Productivity Solutions Grant (PSG) support for the adoption of APPZPOS F&B Point of Sales, a Pre-Approved Solution under the IMDA SMEs Go Digital programme.'
  ],
  image: 'assets/images/smes-go-digital-lockup-vertical.png',
  imageAlt: 'IMDA pre-approved solution eligible for up to 50% business grant support under SMEs Go Digital',
  imageWidth: 1273,
  imageHeight: 1251,
  cta: { kind: 'link', href: '/psg-pos-system-grant-singapore', label: 'Learn More' }
};

export const ENGLISH_HOME_GROWTH_CONFIG: HomeGrowthSectionConfig = {
  eyebrow: 'GROW YOUR BUSINESS',
  title: 'Grow Your Business Revenue with APPZPOS Solution',
  items: [
    {
      label: 'Powerful Cloud POS',
      text: 'Boost revenue, delight customers, enhance restaurant operations, all managed on one platform.',
      iconClass: 'bi-cloud-check'
    },
    {
      label: 'Analytics & Reporting',
      text: 'A powerful business dashboard that provides real-time, valuable insights into your restaurant’s performance anytime, anywhere.',
      iconClass: 'bi-graph-up-arrow'
    },
    {
      label: 'Third-party Integrations',
      text: 'Partnered with leading food ordering platforms, delivery partners, payment gateways, accounting software, and mall management systems.',
      iconClass: 'bi-diagram-3'
    },
    {
      label: 'Multiple Outlets',
      text: 'If you are expanding to more locations, our system ensures a smooth and intuitive transition, allowing you to easily manage them from one simple dashboard.',
      iconClass: 'bi-buildings'
    }
  ]
};

export const ENGLISH_HOME_FEATURES_CONFIG: HomeFeatureSectionConfig = {
  eyebrow: 'Key Features',
  title: 'Key Features',
  items: [
    {
      id: 'crm', title: 'Customer Relationship Management(CRM)',
      icon: 'APPZPOS-Point-of-Sale-Software-Customer-Relationship-Management.png', iconAlt: '',
      points: ['Build-in Loyalty Membership Features', 'Reward Points and Voucher', 'Membership Tier System', 'Promotions based on tier, birthday and more']
    },
    {
      id: 'local-support', title: 'Local Based Support and Cloud POS System',
      icon: 'APPZPOS-Best-Point-of-Sale-System-Local-Based-Support.png', iconAlt: '',
      points: ['Singapore based developers and technical support team with prompt response', 'Manage your restaurant chains from a centralized admin with multi-outlets management']
    },
    {
      id: 'payment', title: 'Payment Gateway and Terminal Integration',
      icon: 'APPZPOS-Best-Point-of-Sale-System-Payment-Integration.png', iconAlt: '',
      points: ['Online payment gateway partners integration with option of multiple mode of payments', 'Onsite payment terminal integration to Kiosk and POS system']
    },
    {
      id: 'inventory', title: 'Inventory Management',
      icon: 'APPZPOS-Best-Point-of-Sale-System-Inventory-Management.png', iconAlt: '',
      points: ['Track inventory easily with alerts', 'Generate reports for stock taking', 'Real time item sales report with advanced data analytics']
    },
    {
      id: 'delivery', title: 'Delivery & Marketplace Management',
      icon: 'APPZPOS-Point-of-Sale-Software-Delivery-Management.png', iconAlt: '',
      points: ['Fully automated delivery management with PandaGo, Grabexpress, & Lalamove', 'Manage Grabfood, Foodpanda and Deliveroo orders in one POS System']
    },
    {
      id: 'security', title: 'Data Security',
      icon: 'APPZPOS-Point-of-Sale-Software-Data-Security.png', iconAlt: '',
      points: ['ISO27001 certified', 'APT certified by CREST approved vendor']
    }
  ]
};

export const ENGLISH_HOME_INDUSTRIES_CONFIG: HomeIndustrySectionConfig = {
  eyebrow: 'INDUSTRIES',
  title: 'POS Integration Across Diverse Sectors',
  description: 'Find the sector that fits your business and see the connected APPZPOS modules built around it.',
  moreInfoLabel: 'More Info',
  stories: [
    { id: 'quick-service', title: 'F&B Quick Service', description: 'Adapt to Customer Demand Effectively in Quick Service Restaurant', image: 'APPZPOS-All-in-One-Pos-System-quick-service.png', alt: 'APPZPOS All-in-One POS System for quick service', href: '/f&b-restaurant-cloud-pos-system', modules: ['pos', 'website', 'kiosk', 'queue', 'kds', 'hub'] },
    { id: 'restaurant', title: 'F&B Restaurant', description: 'Deliver an All-in-One POS Solution for Streamlined Restaurant Operations', image: 'APPZPOS-All-in-One-Pos-System-restaurant.png', alt: 'APPZPOS All-in-One POS System for restaurant', href: '/f&b-restaurant-cloud-pos-system', modules: ['pos', 'website', 'table', 'kds', 'hub'] },
    { id: 'retail', title: 'Retail Stores & Boutiques', description: 'Boost Your Retail Sales, Enhance Service, and Improve Efficiency.', image: 'APPZPOS-All-in-One-Pos-System-retail.png', alt: 'APPZPOS All-in-One POS System for retail', href: '/retail-store-cloud-pos-system', modules: ['pos', 'website', 'kiosk'] },
    { id: 'salon', title: 'Beauty Salons, SPA & Wellness', description: 'Expand and Retain Your Beauty Store Customer Base with a Powerful CRM', image: 'APPZPOS-All-in-One-Pos-System-beauty-salon.png', alt: 'APPZPOS All-in-One POS System for beauty salon', href: '/salon-cloud-pos-system', modules: ['pos', 'website'] }
  ],
  modules: [
    { id: 'pos', title: 'POS / E-Waiter' },
    { id: 'website', title: 'Website Ordering' },
    { id: 'table', title: 'Table QR Ordering' },
    { id: 'kiosk', title: 'Self Ordering Kiosk' },
    { id: 'queue', title: 'Queue Number Display' },
    { id: 'kds', title: 'Kitchen Display System' },
    { id: 'hub', title: 'Order Hub' }
  ]
};
