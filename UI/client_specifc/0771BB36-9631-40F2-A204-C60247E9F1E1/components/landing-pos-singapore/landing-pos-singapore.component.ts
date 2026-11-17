import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

interface LandingModule {
  readonly title: string;
  readonly summary: string;
  readonly image: string;
  readonly imageClass: string;
}

interface LandingFaq {
  readonly question: string;
  readonly answer: string;
}

const WHATSAPP_URL = "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";

/**
 * Focused Google Ads landing page. It deliberately has no site navigation and a
 * single conversion form (the shared demo form, so existing tracking applies).
 * Copy is drawn from claims already published elsewhere on the site.
 */
@Component({
  selector: 'app-landing-pos-singapore',
  templateUrl: './landing-pos-singapore.component.html',
  styleUrls: ['./landing-pos-singapore.component.css']
})
export class LandingPosSingaporeComponent implements OnInit, OnDestroy {
  readonly whatsappUrl = WHATSAPP_URL;
  readonly year = new Date().getFullYear();

  readonly benefits: readonly string[] = [
    'Up to 50% EDGE Grant support for eligible companies*',
    'GrabFood, Foodpanda and Deliveroo orders in one place',
    'Cloud-based: manage menus and sales from anywhere',
    'Local support from our Singapore team'
  ];

  readonly modules: readonly LandingModule[] = [
    { title: 'Cloud POS / E-Waiter', summary: 'Menu setup, split bills, table management, real-time sales reports, smart inventory and CRM in one cloud system.', image: 'assets/images/ecosystem/ecosystem-dining.webp', imageClass: 'pos' },
    { title: 'Table QR Ordering', summary: 'Customers scan a QR code, view the menu and order from their phones, reducing printed menus and reliance on manpower.', image: 'assets/images/ecosystem/ecosystem-table-qr.webp', imageClass: 'qr' },
    { title: 'Self Ordering Kiosk', summary: 'Contactless self-service ordering and payment to cut waiting time at the counter.', image: 'assets/images/ecosystem/ecosystem-kiosk.webp', imageClass: 'kiosk' },
    { title: 'Kitchen Display System', summary: 'Real-time new orders, changes and cancellations with colour-coded status for your kitchen.', image: 'assets/images/ecosystem/ecosystem-kitchen.webp', imageClass: 'kds' },
    { title: 'Website Ordering', summary: 'Let customers order online for pickup or delivery, schedule ahead and pay securely.', image: 'assets/images/ecosystem/ecosystem-website-ordering.webp', imageClass: 'website' },
    { title: 'Order Hub', summary: 'Bring GrabFood, Foodpanda and Deliveroo into one platform and send orders straight to POS and KDS.', image: 'assets/images/ecosystem/ecosystem-delivery.webp', imageClass: 'hub' }
  ];

  readonly steps: readonly { title: string; text: string }[] = [
    { title: 'Tell us about your outlet', text: 'Share your contact details and business name. It takes under a minute.' },
    { title: 'See APPZPOS in a free demo', text: 'We get in touch to walk you through the modules that suit your F&B business.' },
    { title: 'Set up with local support', text: 'Choose your modules and hardware, and check your EDGE Grant eligibility with our team.' }
  ];

  readonly faqs: readonly LandingFaq[] = [
    { question: 'Which businesses is APPZPOS built for?', answer: 'APPZPOS is an all-in-one POS for F&B businesses such as restaurants, cafés and quick-service outlets, with versions for retail stores and beauty salons as well.' },
    { question: 'Does it work with GrabFood, Foodpanda and Deliveroo?', answer: 'Yes. Order Hub brings these platforms into one centralised system, with real-time order status sent directly to your POS and kitchen display.' },
    { question: 'Can I check my sales when I am not in the shop?', answer: 'Yes. APPZPOS is cloud-based, so you can access your data, menus and real-time reports from anywhere.' },
    { question: 'Is the EDGE Grant available to me?', answer: 'Eligible Singapore companies can receive EDGE Grant support for qualifying APPZPOS digitalisation projects, up to 50%. Support levels vary by activity, so we will confirm eligibility with you.' },
    { question: 'What hardware do I need?', answer: 'APPZPOS combines software with POS terminals, receipt printers and cash drawers. Self-ordering kiosks come in 15.6", 21", 24" and 32" sizes. We will recommend a set-up that fits your outlet.' }
  ];

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly commonFunctionService: CommonFunctionService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Cloud POS System for Singapore Restaurants & Cafés | APPZPOS');
    this.meta.updateTag({
      name: 'description',
      content: 'All-in-one cloud POS for Singapore F&B: ordering, kitchen display, delivery integration and reports. Up to 50% EDGE Grant support for eligible companies. Book a free demo.'
    });
    // Paid-traffic page: keep it out of organic results so it does not compete with the main site.
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    // Paid-traffic landing page: global styles hide the site header and footer while this class is set.
    document.body.classList.add('appz-landing');
  }

  ngOnDestroy(): void {
    this.meta.removeTag("name='robots'");
    document.body.classList.remove('appz-landing');
  }

  BindURL_Image(fileName: string): string {
    return this.commonFunctionService.BindURL_Image(fileName);
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
