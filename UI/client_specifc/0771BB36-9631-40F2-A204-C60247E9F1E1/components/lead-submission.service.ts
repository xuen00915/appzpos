import { LeadSpamGuard } from './lead-spam-guard';
import { isMeasurementStaging, trackStagingContactSuccess } from '../../../src/app/services/shared_function/staging-measurement';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';
import { ApiService } from '../../../src/app/services/shared_function/api.service';

export type LeadType = 'contact' | 'demo';
export type LeadPlacement = 'page' | 'embedded' | 'popup';

@Injectable({providedIn: 'root'})
export class LeadSubmissionService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly spamGuard = new LeadSpamGuard((() => { try { return window.sessionStorage; } catch { return undefined; } })());

  async send(fields: Record<string, string>, type: LeadType, placement: LeadPlacement, trap = ''): Promise<void> {
    const guarded = isMeasurementStaging();
    if (guarded) this.spamGuard.begin(trap);
    let confirmed = false;
    try {
    // Retain the backend's ContactUs envelope and field names. No personal data enters analytics.
    let response: any = await firstValueFrom(this.api.apiCallPOST_Async('/api/WebSiteController/SendEmail', {
      ContactUs: {...fields, FormType: type, FormPlacement: placement, SourcePage: location.pathname}
    }).pipe(timeout(20000)));
    for (let depth = 0; depth < 3 && typeof response === 'string'; depth++) response = JSON.parse(response);
    if (!response?.APIResponse || response.APIResponse.Message !== '') throw new Error('Submission not confirmed');
    confirmed = true;
    } finally {
      if (guarded) this.spamGuard.finish(confirmed);
    }
  }

  async complete(type: LeadType, placement: LeadPlacement, host: HTMLElement, close: () => void = () => {}): Promise<void> {
    const id = crypto.randomUUID();
    const receipt = {id, type, placement, sourcePage: location.pathname, submittedAt: Date.now()};
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    // Context is available when the existing GTM visibility triggers run.
    w.dataLayer.push({event: 'appzpos_form_success', form_type: type, form_placement: placement,
      form_source_page: receipt.sourcePage, form_submission_id: id});
    trackStagingContactSuccess(id, type, placement);
    try { sessionStorage.setItem('appzpos-lead-receipt', JSON.stringify(receipt)); } catch { /* Storage can be unavailable. */ }
    // Staging records Ads/GA4 directly above; client-side navigation keeps those queued events alive.
    if (isMeasurementStaging()) {
      close();
      await this.router.navigate(['/thank-you', type], {state: {appzReceipt: id}});
      return;
    }
    // Let Angular render the original success element before scrolling it into GTM's visibility threshold.
    await new Promise(resolve => setTimeout(resolve, 80));
    const success = host.querySelector<HTMLElement>('.alert-success, .appz-contact-success');
    success?.scrollIntoView({block: 'center', behavior: 'instant'});
    success?.setAttribute('tabindex', '-1');
    success?.focus({preventScroll: true});
    // Preserve current conversion tags on the source page. Thank-you pages emit no additional conversion.
    await new Promise(resolve => setTimeout(resolve, 1500));
    close();
    await this.router.navigate(['/thank-you', type], {state: {appzReceipt: id}});
  }
}
