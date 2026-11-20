/** APPZPOS compatibility layer promoted with the 2026-11-20 live repair. Remove only after shared GTM is reconciled. */
export const isMeasurementStaging = (): boolean => ['website.appzpos.com', 'appzpos.com', 'www.appzpos.com'].includes(location.hostname);
/** GA4 property of Appzgate (not APPZPOS). Staging traffic must never be reported to it. */
const APPZGATE_GA4_ID = 'G-JW8VE6FEP3';
const contactReceipts = new Set<string>();
let lastPage: string | undefined;

// Exact paths prevent the Chinese landing page from matching the English F&B rule.
// Labels are retained from published GTM-N7VKTGG version 26.
const pageLabels: Record<string, string> = {
  '/': '9wWMCJyzu_cYEKiftvkC',
  '/cloud-pos-point-of-sales-system': 'Wt87COKVqJ0ZEKiftvkC',
  '/psg-pos-system-grant-singapore': 'K4I1CJDbsJ0ZEKiftvkC',
  '/f&b-restaurant-cloud-pos-system': 'hFUiCNDdsZ0ZEKiftvkC',
  '/f&b-restaurant-online-ordering-website': 'plM_CKjDo50ZEKiftvkC',
  '/self-order-kiosk-restaurant': 'x3e4CP7Io50ZEKiftvkC',
  '/f&b-restaurant-kitchen-display-system': '7vEgCMfYqp0ZEKiftvkC',
  '/f&b-restaurant-queue-number-display-system': 'u9QuCMHqqp0ZEKiftvkC',
  '/f&b-restaurant-emenu-qr-code-ordering-system': 'bCITCNyKsp0ZEKiftvkC',
  '/f&b-restaurant-delivery-integration': '_oDjCLn9qp0ZEKiftvkC',
  '/retail-store-cloud-pos-system': '3Vr3CNGDq50ZEKiftvkC',
  '/salon-cloud-pos-system': 'Q1U5CKb0o50ZEKiftvkC',
  '/pos-hardware-machine-receipt-printer': '401tCPP5o50ZEKiftvkC',
  '/cn-f&b-restaurant-cloud-pos-system': '3hdFCLPr5aQZEKiftvkC'
};

export function trackStagingPageView(): void {
  if (!isMeasurementStaging() || !(window as any).appzposStagingMeasurement) return;
  const path = decodeURI(location.pathname).replace(/\/+$/, '') || '/';
  if (lastPage === path) return;
  lastPage = path;
  if (pageLabels[path]) gtag('event', 'conversion', {send_to: 'AW-791515048/' + pageLabels[path]});
}

function gtag(...args: any[]): void {
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  // gtag uses an Arguments object, not a plain array.
  (function(..._args: any[]) { w.dataLayer.push(arguments); }).apply(null, args);
}

export function initializeStagingMeasurement(): void {
  const w = window as any;
  if (!isMeasurementStaging() || w.appzposStagingMeasurement) return;
  w.appzposStagingMeasurement = true;
  w.dataLayer = w.dataLayer || [];
  // Supported GTM type blocklist, set before the shared container loads.
  // Only Ads conversion tags move here; GA4, linker and other tags stay in GTM.
  // https://developers.google.com/tag-platform/tag-manager/restrict
  w.dataLayer.push({'gtm.blocklist': ['awct']});
  // The shared container also loads a Google tag for the Appzgate GA4 property, which would send every
  // staging page view (and Call/Form events) there. Google's documented per-ID opt-out switch stops
  // all hits to that one property from this page; the APPZPOS property (G-681EVHYGDY) is untouched.
  // https://developers.google.com/analytics/devguides/collection/ga4/disable-analytics
  w['ga-disable-' + APPZGATE_GA4_ID] = true;
  gtag('js', new Date());
  gtag('config', 'AW-791515048');
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-791515048';
  document.head.appendChild(script);
  trackStagingPageView();

  // Shared GTM sends two Primary Ads actions for the same WhatsApp click.
  // Handle only APPZPOS WhatsApp anchors before its delegated click listeners.
  // Keep the native link action; do not preventDefault or open an extra window.
  document.addEventListener('click', event => {
    const anchor = (event.target as Element)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor) return;
    const url = new URL(anchor.href);
    if (url.protocol === 'tel:') {
      gtag('event', 'conversion', {send_to: 'AW-791515048/6nuZCNL96vYYEKiftvkC'});
      return; // Preserve GTM's GA4 Call events and the native action.
    }
    if (url.hostname === 'm.me' && /^(\/157417637460775|\/APPZPOS)\/?$/i.test(url.pathname)) {
      gtag('event', 'conversion', {send_to: 'AW-791515048/X5zoCJfsmJ0ZEKiftvkC'});
      gtag('event', 'messenger_click', {send_to: 'G-681EVHYGDY',
        contact_placement: anchor.closest('.appz-site-floating-contacts') ? 'floating' : 'page', source_page: location.pathname});
      return;
    }
    if (url.hostname !== 'wa.me' || url.pathname !== '/6583109631') return;
    event.stopImmediatePropagation();
    w.dataLayer.push({event: 'appzpos_whatsapp_click', contact_channel: 'whatsapp',
      contact_placement: anchor.closest('.appz-site-floating-contacts') ? 'floating' :
        anchor.closest('.appzpos-product-hero') ? 'hero' : 'page', source_page: location.pathname});
    gtag('event', 'conversion', {send_to: 'AW-791515048/UufyCO6P5vYYEKiftvkC'});
    gtag('event', 'whatsapp_click', {send_to: 'G-681EVHYGDY',
      contact_placement: anchor.closest('.appz-site-floating-contacts') ? 'floating' :
        anchor.closest('.appzpos-product-hero') ? 'hero' : 'page', source_page: location.pathname});
  }, true);
}

export function trackStagingContactSuccess(receiptId: string, type: 'contact' | 'demo' = 'contact', placement = 'page'): void {
  if (!isMeasurementStaging() || contactReceipts.has(receiptId)) return;
  contactReceipts.add(receiptId);
  const label = type === 'contact' ? 'hz96CLGcjPUYEKiftvkC' :
    placement === 'popup' ? 'OdozCPvGmJ0ZEKiftvkC' : 'TANuCOrjkPUYEKiftvkC';
  gtag('event', 'conversion', {send_to: 'AW-791515048/' + label, transaction_id: receiptId});
  // Send confirmed leads to APPZPOS, not the Appzgate property. No form-field values.
  gtag('event', 'generate_lead', {send_to: 'G-681EVHYGDY', form_type: type,
    form_placement: placement, source_page: location.pathname, submission_id: receiptId});
}
