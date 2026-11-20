import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({selector:'app-thank-you',standalone:true,imports:[CommonModule],template: `
<main class="thank-you" aria-labelledby="thank-you-title">
  <span class="thank-you__mark" aria-hidden="true">✓</span>
  <h1 id="thank-you-title" tabindex="-1">{{ confirmed ? 'Thank you!' : 'Get in touch with APPZPOS' }}</h1>
  <p *ngIf="confirmed">{{ type === 'demo' ? 'Your demo request has been received.' : 'Your enquiry has been received.' }} Our team will contact you soon.</p>
  <p *ngIf="!confirmed">Please submit the enquiry form to receive confirmation of your request.</p>
  <a class="thank-you__home" href="/">Back to Home</a>
  <a *ngIf="!confirmed" href="/point-of-sales-demo-quotation">Contact Us</a>
</main>`,styles:[`
.thank-you{width:min(calc(100% - 32px),760px);margin:70px auto;min-height:45vh;padding:48px 24px;text-align:center;background:#f5faff;border:1px solid #dce8f3;border-radius:20px;color:#142d48}.thank-you__mark{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 24px;border-radius:50%;background:#e2f5ea;color:#176b35;font-size:32px}.thank-you h1{font-size:clamp(28px,4vw,42px);margin:0 0 18px}.thank-you p{font-size:18px;line-height:1.7;margin-bottom:28px}.thank-you__home{display:inline-block;padding:14px 24px;background:#0875bc;color:white;border-radius:9px;margin:0 12px 12px} @media(max-width:600px){.thank-you{margin:32px auto;padding:32px 20px}}
`]})
export class ThankYouComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      window.scrollTo({top: 0, behavior: 'instant'});
      document.getElementById('thank-you-title')?.focus({preventScroll: true});
    });
  }
  type = inject(ActivatedRoute).snapshot.data['leadType'];
  confirmed = false;
  constructor() {
    inject(Title).setTitle('Thank You | APPZPOS');
    inject(Meta).updateTag({name:'robots',content:'noindex, nofollow'});
    try {
      const receipt = JSON.parse(sessionStorage.getItem('appzpos-lead-receipt') || 'null');
      this.confirmed = !!receipt && receipt.id === history.state?.appzReceipt && receipt.type === this.type && Date.now() - receipt.submittedAt < 86400000;
    } catch {}
  }
}
