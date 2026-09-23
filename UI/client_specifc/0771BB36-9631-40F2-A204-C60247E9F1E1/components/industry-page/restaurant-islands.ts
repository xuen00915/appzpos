import { IndustryIsland } from './industry-page.component';

export const RESTAURANT_ISLANDS: readonly IndustryIsland[] = [
  {
    id: 'management', title: 'Management',
    floorArea: 'polygon(19.4% 30.4%, 36% 12.3%, 47.6% 22.8%, 30.5% 40.8%)',
    hitArea: 'polygon(19% 7%, 29% 7%, 29% 14%, 36% 11%, 48% 22%, 48% 29%, 42% 31%, 42% 37%, 31% 43%, 19% 33%)',
    description: 'Manage your restaurant from the connected admin portal.',
    solutions: [{ title: 'Admin Portal', href: '/cloud-pos-point-of-sales-system#pos-cloud' }]
  },
  {
    id: 'dining', title: 'Dining',
    floorArea: 'polygon(36% 48.2%, 53.1% 30.2%, 74% 51%, 55.9% 68.7%)',
    hitArea: 'polygon(36% 48%, 44% 37%, 44% 24%, 52% 24%, 52% 29%, 54% 29%, 63% 39%, 63% 30%, 72% 30%, 72% 39%, 68% 45%, 70% 50%, 70% 57%, 63% 62%, 57% 70%, 55% 70%, 36% 50%)',
    description: 'Connect table ordering with your front-of-house team.',
    solutions: [
      { title: 'Table QR Ordering', href: '/f&b-restaurant-emenu-qr-code-ordering-system' },
      { title: 'E-Waiter / E-Menu', href: '/cloud-pos-point-of-sales-system#pos-tablet' }
    ]
  },
  {
    id: 'kitchen', title: 'Kitchen',
    floorArea: 'polygon(59.1% 23.3%, 70.4% 11.2%, 90.3% 31.7%, 79% 43.8%)',
    hitArea: 'polygon(59% 23%, 70% 11%, 78% 19%, 78% 4%, 91% 4%, 91% 16%, 83% 20%, 91% 31%, 91% 33%, 79% 46%, 69% 39%, 71% 38%, 71% 29%, 63% 29%, 59% 25%)',
    description: 'Keep incoming orders and kitchen preparation connected.',
    solutions: [{ title: 'Kitchen Display System', href: '/f&b-restaurant-kitchen-display-system' }]
  },
  {
    id: 'counter', title: 'Counter & Pickup',
    floorArea: 'polygon(12.6% 73%, 29.8% 54.7%, 49.6% 75.3%, 32.5% 93.5%)',
    hitArea: 'polygon(10% 44%, 21% 44%, 21% 57%, 24% 60%, 24% 47%, 32% 47%, 32% 56%, 36% 60%, 44% 60%, 44% 71%, 50% 76%, 50% 78%, 33% 96%, 12% 75%, 12% 72%, 17% 67%, 17% 60%, 10% 56%)',
    description: 'Bring ordering, payment and collection together at the counter.',
    solutions: [
      { title: 'POS System', href: '/cloud-pos-point-of-sales-system' },
      { title: 'Self Ordering Kiosk', href: '/self-order-kiosk-restaurant' },
      { title: 'Queue Number Display', href: '/f&b-restaurant-queue-number-display-system' }
    ]
  },
  {
    id: 'online', title: 'Online & Delivery',
    hitArea: 'polygon(70% 46%, 78% 46%, 78% 58%, 74% 66%, 73% 72%, 65% 76%, 61% 86%, 54% 86%, 54% 75%, 57% 72%, 57% 63%, 64% 63%, 69% 57%)',
    description: 'Connect website orders and delivery platforms to your restaurant.',
    solutions: [
      { title: 'Website Ordering', href: '/f&b-restaurant-online-ordering-website' },
      { title: 'Order Hub', href: '/f&b-restaurant-delivery-integration' }
    ]
  }
];
