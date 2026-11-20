# Live Google tagging audit — 20 November 2026

Scope: Google Ads and GA4 browser tagging, excluding all form-submission tagging. No site, GTM, GA4 or Ads settings were changed. No real enquiries, calls or messages were sent. Collection requests were intercepted before transmission in isolated browser tests; the existing user-opened Tag Assistant session was inspected read-only.

## Results

- 20 public pages: exactly one APPZPOS GA4 page_view per fresh page; all 14 configured Ads page labels matched exact paths; the six other pages emitted no page-specific Ads conversion as configured.
- 16 contact-click cases: floating WhatsApp, hero WhatsApp, Messenger and call links at desktop/mobile on appzpos.com and www.appzpos.com. Each produced one intended Ads conversion command and one matching APPZPOS GA4 event.
- Four homepage-to-blog client navigation cases: one GA4 page_view, no unintended homepage Ads conversion.
- Two full-page scroll cases: GA4 scroll event and zero extra Ads conversions.
- Base Ads page-view/remarketing requests and conversion-linker cookies observed. Synthetic test click ID remained in the isolated test context; measurement requests blocked.
- No G-JW8VE6FEP3 Appzgate collection hits in these checks. Its tag can still appear as detected in Tag Assistant because the shared container contains it; the per-property opt-out suppresses collection.

All 42 page/click/navigation/scroll checks passed. Current publicly delivered GTM-N7VKTGG resource is version 26. Live custom adapter owns Ads conversion commands; GTM awct tags are blocklisted to prevent legacy duplicates. Therefore GTM Tags Fired alone is not the full measurement picture: inspect AW-791515048 Hits Sent and GA4 output too.

| Action | Ads destination | GA4 event / destination |
| --- | --- | --- |
| Page view | AW-791515048, exact 14-path mapping | page_view / G-681EVHYGDY |
| WhatsApp | AW-791515048/UufyCO6P5vYYEKiftvkC | whatsapp_click / G-681EVHYGDY |
| Messenger | AW-791515048/X5zoCJfsmJ0ZEKiftvkC | messenger_click / G-681EVHYGDY |
| Call | AW-791515048/6nuZCNL96vYYEKiftvkC | Call / G-681EVHYGDY |
| Scroll | No Ads conversion | scroll / G-681EVHYGDY |

Limits: this verifies browser commands/destinations, not eventual account reporting, Ads attribution, GA4 key-event configuration or imported-conversion settings. Internal GTM container access was unavailable in Tag Assistant. Tests used Chromium desktop/mobile emulation, not physical Safari. Form-submission tags were deliberately not tested or modified. Detailed evidence and reproducible test scripts accompany this report; local full artifacts are under /Users/dmsyx/.codex/appzpos-staging-deployments/20261120-live-tag-audit.
