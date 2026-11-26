import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LpIconName } from '../lp-icon/lp-icon.component';

interface LandingModule {
  readonly title: string;
  readonly summary: string;
  readonly image: string;
  readonly imageClass: string;
}

interface LandingStat {
  readonly icon: LpIconName;
  readonly value: string;
  readonly label: string;
}

interface LandingFaq {
  readonly question: string;
  readonly answer: string;
}

interface LandingPackage {
  readonly id: number;
  readonly title: string;
  readonly includes: string;
}

interface LandingStep {
  readonly title: string;
  readonly text: string;
}

const CALL_URL = 'tel:+6583109631';
const WHATSAPP_URL = "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";

/**
 * Focused Google Ads landing page. It deliberately has no site navigation and a
 * single conversion form (the shared demo form, so existing tracking applies).
 * Copy is drawn from claims already published elsewhere on the site.
 */
@Component({
  selector: 'app-landing-pos-singapore',
  templateUrl: './landing-pos-singapore.component.html',
  // Styles live in src/styles/_appzpos-landing.scss (global, `lp-` prefixed): they outgrew the per-component style budget.
  styles: []
})
export class LandingPosSingaporeComponent implements OnInit, OnDestroy {
  readonly whatsappUrl = WHATSAPP_URL;
  readonly year = new Date().getFullYear();

  readonly imdaUrl = 'https://smesgodigital.gov.sg/web/solution/20240028/appzpos-f-b-point-of-sales';
  // Static comparison transcribed from the supplied IMDA screenshot dated 18 Nov 2026.
  // These are selected listings with different package scopes, not a market-wide ranking.
  readonly priceComparison = [
    { name: 'APPZPOS F&B Point of Sales', vendor: 'APPZGATE SOLUTIONS PTE. LTD.', price: '1,660', beforeGrant: '3,320', rating: '4.6', starFill: 92, reviews: 23, years: 10, featured: true },
    { name: 'Yumstone F&B Management Solutions', vendor: 'YUMSTONE ESOLUTIONS PTE. LTD.', price: '4,025', beforeGrant: '8,050', rating: '4.9', starFill: 98, reviews: 35, years: 13, featured: false },
    { name: 'Ellie Food Services Business Suite', vendor: 'SUPPLY ELLIE PTE. LTD.', price: '3,250', beforeGrant: '6,500', rating: '4.9', starFill: 98, reviews: 45, years: 6, featured: false },
    { name: 'Getz F&B Omni Channel Solution', vendor: 'GETZ GROUP PTE. LTD.', price: '3,120', beforeGrant: '6,240', rating: '4.9', starFill: 98, reviews: 22, years: 7, featured: false }
  ] as const;

  /** Google Business Profile rating, copied by hand from the live listing on 2026-11-17. Static: update it when the listing changes. */
  readonly rating = { score: 4.8 } as const;

  readonly stats: readonly LandingStat[] = [
    { icon: 'restaurant', value: 'Restaurants', label: 'Table orders & split bills' },
    { icon: 'cafe', value: 'Cafés', label: 'Fast checkout & daily sales' },
    { icon: 'monitor', value: 'Quick service', label: 'Counter orders & kitchen flow' }
  ];

  readonly modules: readonly LandingModule[] = [
    { title: 'Cloud POS / E-Waiter', summary: 'Menu setup, split bills, table management, real-time sales reports, smart inventory and CRM in one cloud system.', image: 'assets/images/ecosystem/ecosystem-dining.webp', imageClass: 'pos' },
    { title: 'Table QR Ordering', summary: 'Customers scan a QR code, view the menu and order from their phones, reducing printed menus and reliance on manpower.', image: 'assets/images/ecosystem/ecosystem-table-qr.webp', imageClass: 'qr' },
    { title: 'Self Ordering Kiosk', summary: 'Contactless self-service ordering and payment to cut waiting time at the counter.', image: 'assets/images/ecosystem/ecosystem-kiosk.webp', imageClass: 'kiosk' },
    { title: 'Kitchen Display System', summary: 'Real-time new orders, changes and cancellations with colour-coded status for your kitchen.', image: 'assets/images/ecosystem/ecosystem-kitchen.webp', imageClass: 'kds' },
    { title: 'Website Ordering', summary: 'Let customers order online for pickup or delivery, schedule ahead and pay securely.', image: 'assets/images/ecosystem/ecosystem-website-ordering.webp', imageClass: 'website' },
    { title: 'Order Hub', summary: 'Bring GrabFood, Foodpanda and Deliveroo into one platform and send orders straight to POS and KDS.', image: 'assets/images/ecosystem/ecosystem-delivery.webp', imageClass: 'hub' }
  ];

  readonly steps: readonly LandingStep[] = [
    { title: 'Request a free demo', text: 'Share your name, email and mobile number so our Singapore team can contact you.' },
    { title: 'Walk through a restaurant order', text: 'See how staff take orders, send tickets to the kitchen and settle bills in APPZPOS.' },
    { title: 'Choose a setup for your outlet', text: 'Discuss the hardware and modules you need, request a quote and check what EDGE Grant support may apply.' }
  ];

  /** Same five EDGE Grant packages as the /psg-pos-system-grant-singapore page. */
  readonly packages: readonly LandingPackage[] = [
    { id: 1, title: 'POS + QR', includes: '1 Digital Ordering (POS) + 1 QR Ordering' },
    { id: 2, title: 'With Order Hub', includes: '1 Digital Ordering (POS) + 1 QR Ordering + 1 Order Hub' },
    { id: 3, title: 'With 1 kiosk', includes: '1 Digital Ordering (POS) + 1 QR Ordering + 1 Self-ordering Kiosk' },
    { id: 4, title: 'With 2 kiosks', includes: '1 Digital Ordering (POS) + 1 QR Ordering + 2 Self-ordering Kiosks' },
    { id: 5, title: 'Kiosk + Order Hub', includes: '1 Digital Ordering (POS) + 1 QR Ordering + 1 Order Hub + 1 Self-ordering Kiosk' }
  ];

  readonly faqs: readonly LandingFaq[] = [
    { question: 'Does APPZPOS work for cafés and quick-service outlets?', answer: 'Yes. Restaurants can manage tables and split bills. Cafés and quick-service outlets can take counter orders and track daily sales.' },
    { question: 'Does it work with GrabFood, Foodpanda and Deliveroo?', answer: 'Yes. Order Hub brings these platforms into one centralised system, with real-time order status sent directly to your POS and kitchen display.' },
    { question: 'Can I check my sales when I am not in the shop?', answer: 'Yes. APPZPOS is cloud-based, so you can access your data, menus and real-time reports from anywhere.' },
    { question: 'Is the EDGE Grant available to me?', answer: 'Eligible Singapore companies can receive EDGE Grant support for qualifying APPZPOS digitalisation projects, up to 50%. Support levels vary by activity. Ask our team which options may apply to your outlet.' },
    { question: 'What hardware do I need?', answer: 'APPZPOS combines software with POS terminals, receipt printers and cash drawers. Self-ordering kiosks come in 15.6", 21", 24" and 32" sizes. We will recommend a set-up that fits your outlet.' },
    { question: 'What is included in the EDGE Grant packages?', answer: 'Every package includes 1 Digital Ordering System (POS) and 1 QR Ordering system. Packages then add an Order Hub and/or 1 or 2 self-ordering kiosks, and all five include a 1-year subscription and the Central Admin Portal with unlimited users.' },
    { question: 'Can customers order from their own phones?', answer: 'Yes. With Table QR Ordering, customers scan a QR code, view the menu and order from their phones, which reduces printed menus and reliance on manpower.' },
    { question: 'Can I take online orders for pickup or delivery?', answer: 'Yes. Website Ordering lets customers order online for pickup or delivery, schedule ahead and pay securely.' },
    { question: 'How does the kitchen see new orders?', answer: 'The Kitchen Display System shows new orders, changes and cancellations in real time, with colour-coded status for your kitchen.' },
    { question: 'How do I get started?', answer: 'Book a free demo with your name, email and mobile number. Our Singapore team will contact you to arrange the demo and discuss the modules and hardware that suit your outlet.' }
  ];

  /**
   * Two side-by-side columns of five questions each. A field, not a getter: a getter returns new arrays on
   * every change detection, which makes ngFor rebuild the <details> elements and instantly closes any open answer.
   */
  readonly faqColumns: readonly (readonly LandingFaq[])[] = [this.faqs.slice(0, 5), this.faqs.slice(5)];

  constructor(
    private readonly title: Title,
    private readonly meta: Meta
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Restaurant POS System Singapore | Cloud F&B POS | APPZPOS');
    this.meta.updateTag({
      name: 'description',
      content: 'Cloud POS for Singapore restaurants, cafés and quick-service outlets. Manage orders, kitchen tickets, payments and sales. Book a free APPZPOS demo.'
    });
    // Paid-traffic page: keep it out of organic results so it does not compete with the main site.
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    // Paid-traffic landing page: global styles hide the site header and footer while this class is set.
    document.body.classList.add('appz-landing');
    this.swapMessengerForCall();
  }

  ngOnDestroy(): void {
    this.meta.removeTag("name='robots'");
    document.body.classList.remove('appz-landing');
    this.restoreMessenger();
  }

  private messengerLink: HTMLAnchorElement | null = null;
  private messengerOriginal: { href: string | null; target: string | null; rel: string | null; label: string | null } | null = null;

  /**
   * The sitewide floating rail has a Messenger bubble. On this ad landing page it becomes a phone-call
   * bubble (same number as the header's Call Us link). The shared shell element is reused so size and
   * position match the other bubbles, and it is restored when the visitor leaves the page.
   */
  private swapMessengerForCall(): void {
    const link = document.querySelector<HTMLAnchorElement>('.appz-site-floating-contacts .btn-fb');
    if (!link || this.messengerLink) return;
    this.messengerLink = link;
    this.messengerOriginal = { href: link.getAttribute('href'), target: link.getAttribute('target'), rel: link.getAttribute('rel'), label: link.getAttribute('aria-label') };
    link.setAttribute('href', CALL_URL);
    link.removeAttribute('target');
    link.removeAttribute('rel');
    link.setAttribute('aria-label', 'Call APPZPOS');
    link.classList.add('lp-call');
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-phone lp-call__icon';
    icon.setAttribute('aria-hidden', 'true');
    link.appendChild(icon);
  }

  private restoreMessenger(): void {
    const link = this.messengerLink;
    const original = this.messengerOriginal;
    if (!link || !original) return;
    link.classList.remove('lp-call');
    link.querySelector('.lp-call__icon')?.remove();
    const put = (name: string, value: string | null) => value === null ? link.removeAttribute(name) : link.setAttribute(name, value);
    put('href', original.href);
    put('target', original.target);
    put('rel', original.rel);
    put('aria-label', original.label);
    this.messengerLink = null;
    this.messengerOriginal = null;
  }

  packageQuote(id: number): string {
    return "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20EDGE%20Grant%20Package%20" + id;
  }

  scrollToForm(): void {
    const target = document.querySelector<HTMLElement>('#requestdemo');
    if (!target) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    const firstField = target.querySelector<HTMLInputElement>('input[name="name"]');
    firstField?.focus({ preventScroll: true });
  }
}
