# Live repair authorization — 2026-11-20

The user explicitly requested fixing the blank live appzpos.com page and making it show the website.appzpos.com design after IT changed DNS. This supersedes the staging-only restriction below for this live repair. Both live names now resolve to Vodien 101.100.228.105; do not assume writes in this document root are staging-only. Preserve existing backend/account settings and do not send real test enquiries.

Live exact public routes now serve /_forms-review-20261113/live.html with main.edf77d588efaa7c5.js. Staging still serves site.html unchanged. API and uploaded-image origin for the live build is https://website-api.appzpos.com (backend remains at 4.193.116.8); fixed hardcoded uploaded-image URLs too. Existing corrected measurement/form hostname guard now includes appzpos.com and www.appzpos.com in the live bundle. No shared GTM account settings changed.

Routing rollback: .htaccess.pre-live-20261120 in /home2/appzgate/public_html/appzpos.com. Restoring it reverts live routing to the old fallback and its known blank-page problem; use only for incident rollback. Live repair artifacts: /Users/dmsyx/.codex/appzpos-staging-deployments/20261120-live-repair. Earlier staging-only history follows.

# Mandatory staging-only scope

The user requires all website changes to be confined to `website.appzpos.com`. Strictly do not modify the live `appzpos.com` or `www.appzpos.com` website.

- Local development is permitted, but deploy or upload changes only to the verified staging target: Vodien, IP `101.100.228.105`, cPanel user `appzgate`, document root `/home2/appzgate/public_html/appzpos.com`.
- The folder name `appzpos.com` on Vodien is the staging folder; do not infer deployment scope from its name alone. Verify the destination host and absolute path before any remote write.
- At verification on 2026-11-12, public DNS for `appzpos.com` and `www.appzpos.com` resolved to `4.193.116.8`; `website.appzpos.com` resolved to `101.100.228.105`. Recheck routing before deployment. If routing changes or the target is ambiguous, stop remote writes and clarify.
- Do not modify production files, databases, APIs, hosting settings, DNS, nameservers, redirects, or production deployment pipelines. Do not run synchronization or promotion actions that could update production.
- Do not submit staging forms to production APIs, send real WhatsApp messages, initiate calls, or trigger production writes as part of testing. The inspected staging bundle uses `https://appzpos.com` for API calls, including `/api/WebSiteController/SendEmail`; it is not a fully isolated backend environment.
- Staging also shares production tracking IDs. Prefer tests that block or mock production API requests and analytics. Never modify production analytics settings to accommodate staging tests.
- Keep design/layout edits and any staging-specific safeguards within the local project and verified staging destination. A general request to deploy, publish, update, or test does not authorize production changes.
- Only a new, explicit user instruction changing this restriction can authorize production work.

## Staging deployment state (2026-11-12)

- Staging Contact Us route `/point-of-sales-demo-quotation` uses the latest Git design build in `/_contact-review-6a1e1cf/`, via a host-restricted `.htaccess` rule. Other page bodies retain their existing application build.
- Staging root `index.html` loads `/_shared-shell-6a1e1cf/shell.css` and `shell.js` for the shared Git-design header, footer, and floating contacts. Preserve these when updating individual pages. The Contact Us build includes these components natively.
- Server backups: `index.pre-shared-shell-20261112.html` and `.htaccess.pre-contact-20261112` in the staging document root. Keep `.htaccess` permissions at 0644.
- Shared-shell build scripts, deployment archives, and verification evidence are saved locally at `/Users/dmsyx/.codex/appzpos-staging-deployments/20261112-shared-shell`.
- Verified 20 page bodies preserved; desktop/mobile shared navigation and mocked call/WhatsApp tracking checks passed. Production HTML hashes matched before/after at both production hostnames on three routes. Testing did not send real messages or forms.

## Homepage review deployment (2026-11-12)

- Staging `/` now serves `/_home-review-6a1e1cf/home.html` via an exact empty-path, staging-host-only `.htaccess` rewrite. Root `index.html` still serves the existing application for other routes; do not replace it with the homepage build.
- Homepage uses the latest Git design plus local compatibility adjustments to `custom-request-demo` and `modal-request-demo` markup to match existing GTM inline and modal success selectors (trigger IDs `31990414_30` and `31990414_32`). Shared header/footer/floating contacts are native in this build.
- Routing backup before activation: `.htaccess.pre-home-20261112`. Deployment package and desktop/mobile mocked tracking evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261112-home`.
- Deployed homepage passed 1440px and 390px rendering, product-tab interaction, mocked inline/modal form success tracking, WhatsApp link events, logo visibility, and Meta Pixel initialization checks. No actual enquiries or analytics were transmitted. Production hashes and staging Contact Us/shared-shell files remained unchanged.

## POS / E-Waiter review deployment (2026-11-12)

- The first Solutions menu page, `/cloud-pos-point-of-sales-system`, now serves `/_solutions-review-6a1e1cf/solutions.html` through an exact, staging-host-only rewrite. All nine Solutions menu routes were subsequently activated; see the later deployment note.
- The Solutions build reuses the verified homepage compilation (including GTM form-selector compatibility), with a separate asset namespace. Homepage and Contact Us rewrites are preserved.
- Routing backup: `.htaccess.pre-solutions-20261112`. Artifacts and QA evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261112-solutions`.

## Content width standardization (2026-11-12)

- Homepage and POS / E-Waiter use the same 1240px maximum content width and responsive gutters for their section shells, header, and footer. POS overview no longer has its narrower 1120px inner cap; homepage Everything Works Together and mobile hero align with the other sections.
- CSS source is appended to `UI/src/styles/_appzpos-marketing-pages.scss`; staging entry HTML files contain the equivalent `review-content-alignment` style block until the next full build. Preserve this override when repackaging these pages.
- CSS-only update and prior entry-file backups: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261112-width-alignment`. No markup, analytics scripts, or tracking selectors were changed.

## Floating contact icon consistency (2026-11-12)

- Staging contact buttons retain equal 52px desktop / 48px mobile circles. WhatsApp and Messenger now both use Font Awesome brand symbols with matching 40px/38px boxes and 33px/31px font sizes. Messenger's original image stays in the DOM for compatibility but is visually hidden; its symbol is a CSS pseudo-element.
- Source CSS is appended to `UI/src/styles/_appzpos-design-system.scss`. Equivalent staging override lives in the Home, Contact Us and Solutions entry files (`consistent-contact-icons`) and shared-shell CSS. Preserve those overrides until rebuilding.
- Only CSS changed; existing links, accessible names and analytics markup/scripts were preserved. Backups and checks: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261112-contact-icons`.

## All Solutions pages and outer bubbles (2026-11-12)

- All nine Solutions menu pages now use `/_solutions-review-6a1e1cf/solutions.html`: POS / E-Waiter, Website Ordering, Table QR Ordering, Self Ordering Kiosk, Kitchen Display System, Queue Number Display, Order Hub, Hardware, and Features. Exact route alternatives in `.htaccess` are restricted to `website.appzpos.com`. Homepage and Contact Us rewrites remain intact.
- All three floating outer bubbles, including `#gotoTop`, are 52px on desktop and 48px on mobile. Source styles are in `_appzpos-design-system.scss`; the `equal-floating-bubbles` entry-file overrides and shared-shell CSS carry the same staging adjustment. Existing contact links and tracking markup remain unchanged.
- Routing backup: `.htaccess.pre-all-solutions-20261112`. All-Solutions package and bubble-check evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261112-all-solutions`. Full route QA screenshots/results also originate from `/tmp/appzpos-solutions-review`.

- Final verification: 18 deployed route/viewport checks passed with no runtime errors, missing images, or horizontal overflow; mocked form success tracking was observed on all nine Solutions pages. Eight deployed floating-bubble checks passed, and the back-to-top click returned to the top. Production hashes remained unchanged.

## Remaining public pages deployment (2026-11-12)

- The remaining nine public marketing routes now serve `/_remaining-review-6a1e1cf/remaining.html`: Chinese homepage, custom solutions, F&B industry, retail industry, salon industry, EDGE Grant, partner integrations, blog listing, and BCRS article.
- All 20 explicitly defined public routes in the repository are now on the latest design builds. Existing homepage, Contact Us, and Solutions namespaces/rewrites are preserved. The old root index remains as the fallback for undefined routes; no admin/backend was copied or modified.
- The remaining-pages build reuses the tested compilation with GTM form-selector fixes, plus the contact-symbol and equal-outer-bubble CSS overrides. No production API, tracking settings, or hosting configuration was changed.
- Routing backup: `.htaccess.pre-remaining-20261112`. Package, prior routing and verification evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261112-remaining-pages`.

- Final checks: all 18 remaining-page desktop/mobile checks passed; all six pages containing forms produced mocked success tracking events. Three pages without forms passed rendering/link checks. All 30 HTTP/hash checks passed, including unchanged production snapshots. No real enquiries or analytics events were sent.


## Unified forms deployment (2026-11-13)

- All 20 public marketing routes and `/thank-you/contact`, `/thank-you/demo` now serve `/_forms-review-20261113/site.html` through exact, staging-host-only rewrites. Root fallback and previous namespaces are retained. Routing rollback: `.htaccess.pre-forms-20261113`; keep permissions 0644.
- Contact Us retains its separate enquiry form. All other embedded and popup forms, including Chinese variants and the Features page, share the four-field demo template (name, email, phone, optional business name). Demo forms have no enquiry-type or message field.
- The original SendEmail endpoint and ContactUs payload envelope remain. The existing backend is shared with production: do not send actual test enquiries. Only confirmed API success redirects to the corresponding thank-you route; failures preserve input and duplicate submissions are blocked.
- Legacy GTM success selectors remain intact. Popup IDs stay `mat-mdc-dialog-0` after reopening. Success is rendered and exposed to the existing visibility triggers before navigation. `appzpos_form_success` adds non-personal form type, placement, source path and submission ID context; no additional GA/Meta conversion tag is configured.
- Thank-you pages use a session receipt and router state, contain no success-selector element and emit no conversion event. Refresh/direct entry must not count again. Confirmation scroll/focus starts at its heading.
- Build and verification artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-unified-forms`. Previous width and floating-bubble styles are included in this compilation. No admin/backend or production analytics configuration was modified.

- Verification: eight deployed desktop/mobile contact, embedded and popup scenarios passed with mocked API responses and blocked analytics transmission. Existing success triggers fired exactly once; failed/malformed responses, repeat clicks, reopened popups, direct thank-you entry and refresh guards passed. All 22 staging entry hashes matched the release, and six production HTML snapshots remained unchanged. Actual email delivery and analytics reporting were not exercised.
- Final deployed inventory: all 20 public routes passed at desktop and mobile (40 checks), with only the approved form types, no runtime errors and no horizontal overflow.


## Floating contact tracking correction (2026-11-13)

- The sitewide WhatsApp bubble now contains visually hidden `WhatsApp Us` text, required by the existing GTM Click Text predicate. The Messenger bubble now uses `https://m.me/157417637460775` with its existing message query. Both the APPZPOS username URL and numeric URL were verified to redirect to Facebook conversation ID 157417637460775.
- Source: `UI/src/app/components/index/app/app.component.html`. No production GTM settings were changed. Shared staging namespace remains `/_forms-review-20261113/`; rollback entry is `site.pre-floating-tracking-20261113.html` in that directory.
- Desktop/mobile deployed tests observed expected Google Ads conversion requests for WhatsApp label `UufyCO6P5vYYEKiftvkC` and Messenger label `X5zoCJfsmJ0ZEKiftvkC`, blocked before transmission. Current published GTM version 26 matched the test configuration. All 22 staging route hashes and six unchanged production snapshots passed. No messages were sent; reporting delivery was not tested.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-floating-tracking`. Preserve these source changes in future builds.


## Staging-only measurement correction (2026-11-13)

- Verified Google Ads account AppzPOS 740-384-8225 read-only. Shared conversion ID is 791515048. Verified labels: WhatsApp `UufyCO6P5vYYEKiftvkC`, Messenger `X5zoCJfsmJ0ZEKiftvkC`, Contact Us `hz96CLGcjPUYEKiftvkC`, embedded demo `TANuCOrjkPUYEKiftvkC`, popup demo `OdozCPvGmJ0ZEKiftvkC`.
- Shared GTM version 26 fires APPZPOS and Appzgate WhatsApp Primary actions together; it also sends Contact Us to obsolete/different label `cP_zCOqtmOIBEKiftvkC`. Do not treat preservation of its trigger alone as proof of correct account mapping.
- `staging-measurement.ts` runs ONLY when hostname exactly equals `website.appzpos.com`. It queues AW-791515048 configuration before GTM starts. A capture listener handles only links to wa.me/6583109631, leaves native link navigation intact, and stops the duplicate legacy delegated click handling. It emits `appzpos_whatsapp_click` and one direct APPZPOS Ads conversion. These direct conversions are inspected under AW Hits Sent, not GTM Tags Fired.
- Staging Contact Us renders `.appz-contact-success` instead of `.alert-success` to avoid the old GTM label. Confirmed API success sends the verified Contact Us label with receipt transaction ID and preserves the GA4 `Form` event for G-JW8VE6FEP3. Production hostnames retain original markup/behavior; no production deployment or shared GTM changes were made. Demo and Messenger mappings remain with existing GTM.
- Remove this temporary compatibility layer only after shared GTM is corrected with explicit production authorization, otherwise duplicate conversions can return. All backend/email routing remains unchanged and unverified; this fixes measurement only.
- Rollback entry: `/_forms-review-20261113/site.pre-staging-measurement-20261113.html`. Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-staging-measurement`.
- Deployed desktop/mobile checks: floating/hero WhatsApp correct label and duplicate Appzgate label absent; Messenger preserved; Contact Us correct label and old label absent; GA4 Form preserved; failed submissions and thank-you refresh do not convert. Embedded/popup mocked form regression checks passed. Production-host guard checks passed; 22 staging entry hashes match and six production snapshots are unchanged. All test measurement transmissions and actual email submissions were blocked/mocked.

- Subsequent read-only page-view audit: all 20 public staging pages emit one page_view to each existing GA4 ID (G-JW8VE6FEP3 and G-681EVHYGDY); Home-to-Blog navigation also emits one to each after the collection batching delay. Measurement transmission was blocked. Outstanding shared Ads defects: verified action Appzpos Home Page View (6692985244, label 9wWMCJyzu_cYEKiftvkC) fires on every page via logo visibility; Chinese route also matches F&B page-view URL substring predicate and sends both Chinese/F&B labels. These page-view defects have NOT been corrected. Do not claim all Ads page-specific rules are correct.
## Staging page-view correction (2026-11-13)

- Current entry remains `/_forms-review-20261113/site.html`, now referencing `main.d4af4c44b143186d.js`. Uploaded only the incremental compilation to the verified Vodien staging directory; no `.htaccess` or production changes.
- `staging-measurement.ts` applies Google's documented `gtm.blocklist: ['awct']` before the shared GTM container loads, only on `website.appzpos.com`. GA4, Conversion Linker and other tag types remain in GTM. The staging adapter now owns Ads conversions, retaining the published version-26 APPZPOS labels for all 14 mapped page paths, contact/demo successes and WhatsApp/Messenger/call clicks. Future Ads-label changes need to be reflected in this staging adapter; do not publish changes to the shared container as part of staging work.
- Exact path matching confines Home Page View to `/` and prevents the Chinese homepage from also firing the English F&B conversion. Angular NavigationEnd handles internal navigation, with duplicate initialization suppressed. Contact, embedded demo and popup demo retain separate Ads labels; receipt IDs deduplicate successful submissions. GA4 page views are not manually added.
- All 20 deployed public routes passed exact Ads-label comparisons and one `page_view` per existing GA4 property. Home-to-Blog navigation passed. Desktop/mobile WhatsApp, Messenger, call and contact checks passed, including both GA4 Call events. Six demo scenarios passed, including Chinese embedded/popup forms, failure/malformed-response guards, duplicate submission and thank-you refresh/direct-entry guards. Analytics and backend submissions were intercepted; no actual enquiries, messages, calls or reporting events were sent.
- All 22 staging HTML hashes matched the package; six production snapshots remained unchanged. Production-host adapter guards and the tracking-preservation contract passed. Build passed with existing CSS/bundle budget warnings.
- Rollback entry: `/_forms-review-20261113/site.pre-pageview-fix-20261113.html`; prior hashed assets remain available. Evidence, incremental ZIP, source snapshots and scripts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-pageview-fix`.


## APPZPOS GA4 lead alignment (2026-11-13)

- User clarified: exclude Appzgate Google Ads conversions from APPZPOS staging; both live websites remain unchanged.
- Staging now serves `main.1f10a4abc44ed619.js` via the same `/_forms-review-20261113/site.html`. GA4 `generate_lead` is sent only after confirmed contact/demo success, and `whatsapp_click`/`messenger_click` are sent for the matching contact links, explicitly to APPZPOS `G-681EVHYGDY`. Contact no longer sends `Form` to Appzgate `G-JW8VE6FEP3`. Existing GA4 page views and Call events remain unchanged. No customer-entered form fields enter these events.
- Existing exact Ads page-view mapping and APPZPOS form/click labels are retained. The staging-only `awct` blocklist prevents legacy Appzgate Ads actions from firing; deployed network checks verified only APPZPOS labels across tested interactions, including absence of Appzgate call and WhatsApp labels.
- Deployed desktop/mobile contact and click checks passed. Six embedded/popup demo scenarios passed, including Chinese forms, invalid/failed responses, duplicate submission and thank-you refresh/direct-entry guards. Observed outgoing APPZPOS GA4 requests for contact success, both WhatsApp placements and Messenger. All 20 route page-view comparisons and 28 HTML/hash checks passed; production snapshots remained unchanged. All API submissions were mocked and analytics requests intercepted before transmission.
- No shared GTM, Google Ads or GA4 account settings changed. New GA4 events have NOT been marked as key events or imported into Ads. Existing Appzgate reporting statuses are deliberately not repaired by firing its tags on APPZPOS.
- Rollback: `/_forms-review-20261113/site.pre-ga4-alignment-20261113.html`. Evidence and package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-ga4-alignment`.

## Responsive menu, equal bubbles and customer marquee (2026-11-13)

- Deployed staging entry `/_forms-review-20261113/site.html` now references `main.350c7d5d0b67ac6a.js` and `styles.6ecdb6f44f2e42c0.css`. No root routing, production, backend or analytics settings changed.
- Mobile/tablet header CSS removes Canvas sticky transform on `#header-wrap` at widths <=1100px. The transform made the fixed open menu use the 76px header as its containing block, collapsing navigation to 56px after scrolling. Menu now covers the viewport below the header.
- Shared CSS variables enforce 52px desktop / 48px mobile outside bubble dimensions, 2px borders and equal 12px/16px gaps. Messenger has a clearer outer outline; icon sizes and existing link/tracking markup remain unchanged. Active state no longer scales circles down.
- HomeProof row ngFor now uses `trackCustomerRow` by stable row index. The getter returns fresh row arrays during change detection; previously Angular destroyed and rebuilt animated tracks, resetting motion. Stable rows preserve animation identity and time through updates, scrolling and Show all interaction.
- Deployed QA: 320/390/768/1024px homepage menus at top and two scroll depths; 1440px desktop navigation; eight representative Home/Contact/POS/Blog cases at 390/820px; English phone/tablet and Chinese phone logo animation continuity over 13 seconds. No runtime errors or horizontal overflow. Equal circle dimensions/spacing, submenu interaction, close/Escape/body unlock and back-to-top passed where controls are visible. Contact controls can intentionally hide near forms; hidden controls are excluded from geometry assertions. All 22 staging hashes and six unchanged production snapshots passed. Tracking source byte-identical to prior release and preservation contract passed.
- Browser plugin unavailable: used Playwright/Chromium device emulation, with analytics and APIs blocked/mocked. Actual iOS Safari was not tested. Existing build budget warnings remain. Static broken-image detector falsely flagged Angular [src] bindings; narrow file-scoped suppression recorded in .impeccable/config.json.
- Rollback: `/_forms-review-20261113/site.pre-menu-fix-20261113.html`. Artifacts, before/after screenshots and evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-menu-bubbles-logos`.

## Compact mobile/tablet dropdown (2026-11-13)

- User clarified the menu should NOT fill the screen: use a compact dropdown with its own scroller. This supersedes the earlier full-height visual requirement; retain the sticky transform fix.
- Staging entry now references `main.33a547f20d164afe.js`. Only responsive header CSS changed: right-aligned panel under header, max width 420px on tablet and 16px mobile side gutters, content-driven height capped at min(60dvh,480px,100dvh - 108px), rounded border/shadow, independent vertical scroll and contained overscroll. Primary rows use 48px targets; submenus use one column. Existing toggle, Escape, outside click and body scroll lock remain.
- Deployed QA passed at 320x700, 390x844, 820x900, 1024x768 and landscape 667x375, at top and two scrolled states. Verified capped bounds, page visible below dropdown, expanded submenu overflow/internal scroll without background scroll, close/Escape, no runtime errors/overflow, and preserved equal bubbles. 1440px desktop navigation passed. All 22 staging entries matched release and six production hashes remained unchanged. Tracking source remained byte-identical.
- Rollback: `/_forms-review-20261113/site.pre-compact-menu-20261113.html`. Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-compact-menu`. Browser plugin unavailable, used Playwright/Chromium with APIs/analytics blocked. Actual iOS Safari not tested.


## F&B restaurant ecosystem image (2026-11-13)

- Added the user-supplied transparent PNG directly under “Transform Your Restaurants: Maximize Profits with APPZPOS Restaurant Point of Sale Systems” on `/f&b-restaurant-cloud-pos-system`. Full-width responsive image preserves its 1920:1080 aspect ratio; explicit dimensions reserve layout space.
- Staging entry references `main.9953425d187e072c.js`; image is `/_forms-review-20261113/assets/staging/restaurant-pos-ecosystem.png` with 0644 permissions. Source asset: `UI/src/assets/staging/restaurant-pos-ecosystem.png`. Root routing unchanged.
- Verified deployed image loading, placement, aspect ratio, no horizontal overflow or runtime errors at 1440/820/390px. Tracking preservation contract passed. All 22 staging entry hashes matched and six production snapshots remained unchanged. APIs and analytics blocked during rendering tests. Existing build budget warnings remain.
- Rollback: `/_forms-review-20261113/site.pre-fnb-image-20261113.html`. Package, source snapshots and screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261113-fnb-image`.


## Immediate thank-you navigation (2026-11-16 — DEPLOYED)

- User requested no success-message wait before thank-you navigation. Local LeadSubmissionService now navigates immediately on the exact staging hostname after queuing the existing direct Ads/GA4 events and storing the receipt. Contact and shared demo components suppress the intermediate success message on staging. Non-staging legacy visibility-trigger flow retains its previous timing.
- Build and eight mocked desktop/mobile contact, embedded, popup and Chinese scenarios passed, including single Ads/GA4 lead events, no intermediate success element, failed/malformed-response retention, duplicate-submission prevention and refresh/direct-entry guards. Production requests and analytics were intercepted. Tracking preservation contract passed.
- Deployed on 2026-11-16 after Chrome native access recovered. Verified public DNS, cPanel user appzgate and dedicated IP 101.100.228.105, absolute destination /home2/appzgate/public_html/appzpos.com, and current staging entry matching saved site.before.html before upload. Extracted appzpos-instant-thanks.zip only there; no root index, .htaccess, backend or production writes.
- Current staging entry references main.59cdf79c64619d6a.js. Rollback entry: /_forms-review-20261113/site.pre-instant-thanks-20261116.html.
- Deployed QA passed eight desktop/mobile contact, embedded, popup and Chinese form scenarios, including immediate navigation without intermediate success, one Ads/GA4 lead event, failed/malformed responses, duplicate submissions and refresh/direct-entry guards. Tracking contract passed. All 22 route hashes and nine package file hashes matched; six production URLs returned 200.
- Verification limitation: restart removed temporary fixtures and the original production hash baseline. Restored tests using synthetic configuration and archived GTM; historical production hash comparisons could not be repeated. Production was not modified. All test API submissions were mocked and analytics blocked. Chromium emulation used; actual iOS Safari not tested.
- Persistent evidence, fixtures, screenshots, deployed-forms.log, deployed-forms-qa.json, final-hashes.json and verify-deployed.cjs are in /Users/dmsyx/.codex/appzpos-staging-deployments/20261116-instant-thanks. forms.cjs now uses persistent paths. Use verify-deployed.cjs instead of the old hashes.cjs, which requires the missing historical baseline.

## Homepage category tab clearance (2026-11-16)

- Fixed the terminal/printer artwork overlapping homepage category tabs by removing its negative top margin. Source: UI/src/styles/_appzpos-home-hero.scss. English and Chinese homepages share the fix.
- Staging entry /_forms-review-20261113/site.html carries the CSS-only hero-tab-clearance-20261116 override; preserve it until the next full stylesheet compilation. Existing main.59cdf79c64619d6a.js and styles.6ecdb6f44f2e42c0.css remain. No markup, tracking, backend or root routing changes.
- Deployed only to verified Vodien IP 101.100.228.105, cPanel appzgate, /home2/appzgate/public_html/appzpos.com after DNS and current-entry checks. Rollback: /_forms-review-20261113/site.pre-hero-tabs-20261116.html.
- Passed 64 tab/viewport checks across two homepages and eight viewport sizes, without overlap, missing terminal images, horizontal overflow or page errors. All 22 staging route hashes matched and six production snapshots remained unchanged. Tracking contract passed. APIs mocked and analytics blocked; Chromium emulation, not physical Safari.
- Evidence/package: /Users/dmsyx/.codex/appzpos-staging-deployments/20261116-hero-tabs.

## Desktop hero viewport fit (2026-11-16)

- User found the previous clearance-only adjustment left excessive whitespace and clipped the device below the desktop fold. Desktop (>1024px) hero now uses viewport height minus header, a grid allocating remaining height to the terminal, and 125% artwork height aligned to the grid row bottom to compensate for the PNG's transparent top padding. Full hardware and module buttons fit in the tested desktop viewports with clear tab separation. Mobile/tablet flow remains unchanged.
- Source appended to UI/src/styles/_appzpos-home-hero.scss. Staging entry carries hero-viewport-fit-20261116 CSS override after hero-tab-clearance-20261116; preserve both until full compilation. No image, script, form or tracking markup changes.
- Uploaded only entry and rollback to verified /home2/appzgate/public_html/appzpos.com on Vodien 101.100.228.105, cPanel appzgate, after DNS and entry comparison. Rollback: /_forms-review-20261113/site.pre-hero-fit-20261116.html. Root routing untouched.
- Preview: 56 settled-tab checks on English/Chinese homepages at seven viewports. Deployed: 32 checks at 1440x900, 1470x752, 1600x732 and 390x844 on both languages. Verified visible artwork/tab clearance, full desktop device and module buttons inside viewport, loaded images, no horizontal overflow/page errors. APIs mocked and analytics blocked; Chromium emulation, not physical Safari.
- All 22 staging route hashes matched release; six production hashes unchanged; tracking preservation contract passed. Evidence/package: /Users/dmsyx/.codex/appzpos-staging-deployments/20261116-hero-fit.

## Sitewide spacing and Website Ordering WhatsApp style (2026-11-16)

- Staging `/_forms-review-20261113/site.html` now includes CSS-only `ordering-whatsapp-spacing-20261116`; existing scripts, markup, hero overrides and routing are preserved.
- Corrected obsolete five-row subgrid spans on Solutions detail cards, which created empty rows after conversion to alternating image/text sections. Cards now use one natural-height row. Shared section/card gaps and legacy marketing container margins use responsive 32–56px spacing; removed stacked showcase padding.
- Website Ordering detail WhatsApp CTA uses the homepage green style, including hover/focus. Link, label, icon and tracking remain unchanged.
- Persistent source: `UI/src/styles/_appzpos-spacing-corrections.scss`, imported last in `UI/src/custom-theme.scss` so legacy catalogue rules cannot restore the gaps. Preserve this override until rebuilding.
- Verified all 20 public routes at 390/820/1440px (60 deployed checks), no horizontal overflow or runtime errors. Solutions cards have no multi-row spans and adjacent card gaps stay within 60px. CTA normal/hover/focus, link/icon and hardware gap passed at all three widths. Preview Contact Us reported existing jQuery errors also reproduced against the prior entry; deployed checks did not report these errors.
- All 22 staging entry hashes match; six production snapshots are unchanged. Tracking preservation contract and spacing SCSS compilation passed. Tests mocked APIs and blocked analytics; no enquiries/messages sent.
- DNS rechecked: staging 101.100.228.105, production 4.193.116.8. Uploaded only namespaced entry and rollback to verified `/home2/appzgate/public_html/appzpos.com` via Vodien cPanel. Rollback: `/_forms-review-20261113/site.pre-ordering-whatsapp-20261116.html`.
- Evidence, screenshots, regression audit and package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-ordering-whatsapp`.

## Rectangular buttons and unified WhatsApp style (2026-11-16)

- User requested all rounded buttons become rectangular, including WhatsApp. Staging entry includes CSS-only `rectangular-buttons-20261116`; prior spacing and hero corrections remain intact.
- Action buttons, form/popup buttons, header CTAs and floating contact/back-to-top controls have square corners. WhatsApp links share green #438b55, white text/icons, subtle green shadow and darker #357144 hover/focus. Text-only WhatsApp CTAs receive a Font Awesome brand icon via CSS. Existing links, labels, markup and tracking scripts remain byte-identical.
- Source: `UI/src/styles/_appzpos-button-corrections.scss`, imported last by `UI/src/custom-theme.scss`. Cards and images retain their existing geometry.
- Staging destination and DNS reverified before uploading namespaced entry plus rollback only. Production HTML hashes unchanged on six checks; all 22 staging routes match the package. SCSS compilation and tracking preservation contract passed; mocked mobile/desktop popup and hover checks passed.
- Evidence and page/style audit: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-rectangular-buttons`. Rollback: `/_forms-review-20261113/site.pre-rectangular-buttons-20261116.html`. API requests mocked and analytics blocked during browser tests; no messages, calls or form submissions sent.

## Soft rectangular button corners and missed homepage CTAs (2026-11-16)

- User clarified rectangular buttons should retain a small radius and flagged remaining pill-shaped Learn More, More Info, review and WhatsApp links. The button correction now uses 6px corners instead of zero; custom homepage CTA selectors (`appz-ecosystem__details-learn-more`, `ecosystem__grant-link`, `industries__more-info`, `proof__review-link`) are explicitly included, covering English and Chinese variants.
- Source remains `_appzpos-button-corrections.scss`, imported last. Staging entry adds `button-radius-20261116` after the previous override. Preserve the latest rule when repackaging; no markup, tracking, links, spacing or image/card shapes changed.
- Read-only inventory inspected all 20 public routes. Preview passed at 390/1440px with exact 6px action corners, consistent WhatsApp green and a separate scan of all visible short links/buttons for remaining pill shapes. Popup corners and WhatsApp hover passed; SCSS compilation and tracking contract passed.
- Verified staging IP 101.100.228.105 and absolute deployment folder `/home2/appzgate/public_html/appzpos.com`; production stays 4.193.116.8. Uploaded entry and rollback only. All 22 staging hashes match, and six production hashes remain unchanged.
- Evidence, expanded regression audit and CTA screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-button-radius`. Rollback: `/_forms-review-20261113/site.pre-button-radius-20261116.html`. Browser tests mock APIs and block analytics; no real submissions, calls or messages.

- Final deployed verification: all 40 page/viewport checks passed, with no runtime errors, horizontal overflow or remaining pill-shaped short action links. Exact 6px button corners, WhatsApp colours and two popup/hover scenarios passed.

## Homepage text-only WhatsApp and larger Solutions icons (2026-11-16)

- English/Chinese homepage hero WhatsApp buttons no longer show the CSS-generated logo. Other WhatsApp buttons retain their icons. Solutions-page inline CTA icons are now 24px; global floating controls are unchanged.
- CSS-only `hero-text-only-20261116` appended to staging entry; persistent rules appended to `_appzpos-button-corrections.scss`. Green colours, 6px corners, all links, markup and tracking remain intact.
- Preview checks passed for both home languages at 390/1440px and all nine Solutions routes at both widths. SCSS compilation and tracking contract passed. Destination/DNS/baseline reverified before namespaced upload to Vodien staging. No production writes or real backend/analytics transmissions.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-hero-text-only`; rollback `/_forms-review-20261113/site.pre-hero-text-only-20261116.html`.

- Deployed verification passed: four homepage language/viewport checks, 18 Solutions route/viewport checks, 22 matching staging hashes and six unchanged production hashes. Screenshots confirm text-only home heroes and enlarged Solutions icons.

## Floating contact controls available sitewide (2026-11-16)

- User requested floating icons sitewide. Shared WhatsApp/Messenger rail remains owned by the application shell, with one pair per page. The CSS-only `sitewide-floating-20261116` override now keeps that rail visible and interactive on all public routes, including mobile Solutions/Grant pages and when embedded forms are visible/focused. This supersedes earlier mobile hiding exceptions for the contact rail; back-to-top and separate Request Demo shortcut retain their existing behavior.
- Source appended to `_appzpos-button-corrections.scss`. High-specificity selectors deliberately override legacy groups containing `#gotoTop`, while restricting the change to `.appz-site-floating-contacts`. Existing 48/52px dimensions, spacing, 6px corners, icons, destinations and measurement hooks remain unchanged.
- Preview audit passed all 22 public/thank-you routes at 390/1440px, checking top/middle/bottom/form-focus states, one shared rail, two correct contact links, minimum 48px controls, viewport bounds and visible/interactable CSS. SCSS compilation and tracking contract passed.
- Staging DNS, entry baseline and absolute Vodien destination were verified before namespaced upload. Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-sitewide-floating`; rollback `/_forms-review-20261113/site.pre-sitewide-floating-20261116.html`. Backend and analytics blocked in browser QA; no actual messages or enquiries.

- Final deployed verification: 44 page/viewport checks and 176 visibility states passed. All 22 staging entry hashes match and six production snapshots remain unchanged. Mobile Grant screenshot confirms visible controls while an input is focused.

## Pending Grant FAQ inline contact fix (2026-11-16 — NOT DEPLOYED)

- User requested removing green highlight from `Contact` in the Grant FAQ sentence. Local `_appzpos-button-corrections.scss` now restores transparent background/border, no shadow, original purple text and no injected WhatsApp icon on `.psg-faq__contact a`, including hover/focus. Actual WhatsApp buttons remain green.
- Desktop/mobile preview checks passed for normal/hover/focus, unchanged href and preserved floating WhatsApp green. Screenshot inspected; SCSS compilation passed.
- NOT uploaded: Chrome native accessibility calls timed out three times, including reconnect by application bundle ID. `cua.getState()` works but reports browser access host unavailable; no remote files changed.
- Ready package/evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-inline-contact/appzpos-inline-contact.zip`. Intended rollback: `/_forms-review-20261113/site.pre-inline-contact-20261116.html`. Before resuming, recheck DNS, absolute destination and current staging entry against `site.before.html`. Upload/extract then run `DEPLOYED=1 node audit.cjs` and `node hashes.cjs` in that folder.

## Grant FAQ inline contact fix deployed (2026-11-16)

- Retry succeeded after browser recovery. Supersedes the pending note above: `inline-contact-20261116` is now active in `/_forms-review-20261113/site.html`. Grant FAQ Contact link has no green highlight, shadow or injected icon; original purple inline text and destination preserved. Actual WhatsApp buttons remain green.
- Rechecked staging/production DNS and matched current entry to the saved baseline before upload. Namespaced entry and rollback only extracted at verified `/home2/appzgate/public_html/appzpos.com`.
- All 22 staging entry hashes match and six production snapshots remain unchanged. Evidence and deployed desktop/mobile normal/hover/focus checks: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-inline-contact`. Rollback: `site.pre-inline-contact-20261116.html`. Tests mock APIs and block analytics.

## All hero WhatsApp logos and contact dropdown cleanup (2026-11-16)

- User expanded text-only WhatsApp requirement to all hero sections, including Blog/F&B/Retail. CSS now suppresses generated/inline icons only inside known hero containers; body CTA icons and shared floating controls remain intact.
- Header contact dropdown WhatsApp row restored to neutral transparent background, original dark text and no shadow; hover/focus uses the same pale row feedback as other contact entries. All menu icons use equal 24px boxes, with WhatsApp/Messenger fonts enlarged to 24px to optically match the unchanged 20px solid phone glyph.
- Source appended to `_appzpos-button-corrections.scss`; staging entry contains `hero-menu-20261116`. CSS-only package preserves all markup, links, tracking scripts and previous overrides.
- Preview passed all 20 public routes at 390/1440px: hero buttons text-only, menu opens, neutral WhatsApp row, equal icon boxes. SCSS compilation and tracking contract passed. DNS and baseline reverified; only namespaced entry and rollback uploaded to verified Vodien staging directory.
- Evidence/package/screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-hero-menu`; rollback `/_forms-review-20261113/site.pre-hero-menu-20261116.html`. Automated browser checks mock APIs and block analytics; no contact links followed.

- Deployed verification passed all 40 route/viewport hero/menu checks. All 22 staging hashes matched and six production snapshots remained unchanged.

## Consistent industry WhatsApp green and compact hero actions (2026-11-16)

- User requested Salon WhatsApp match other industry pages and shorter Blog/Solutions hero buttons. Added `hero-button-size-20261116` CSS-only staging override. Industry WhatsApp class now explicitly gets shared #438b55 normal / #357144 hover green, including Salon's legacy desktop variant that did not match the href-based rule.
- Industry, Blog, Features/Hardware/Partners hero action groups and Solutions overview actions use 44px height/min-height, zero vertical padding and centred labels (42px line-height), preserving 6px corners. Homepage hero sizing unchanged. No display override, so Salon desktop/mobile link visibility remains correct and only one WhatsApp CTA is displayed.
- Source appended to `_appzpos-button-corrections.scss`. Staging entry/rollback only uploaded to verified Vodien staging after DNS/baseline checks; markup and links unchanged. Pre-existing Salon desktop WhatsApp-labelled anchor points to brochure; this CSS-only task did not alter that destination.
- Preview measurements and final targeted 390/1440px Blog/Salon/POS checks passed; screenshots inspected for centred labels and no duplicate Salon action. SCSS and tracking-preservation checks passed.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-hero-button-size`; rollback `/_forms-review-20261113/site.pre-hero-button-size-20261116.html`. QA mocked APIs and blocked analytics.

- Final deployed checks: all 40 public route/viewport cases passed, with no runtime errors or overflow; target actions measure 44px and Salon has one matching-green WhatsApp action. All 22 staging hashes match; six production snapshots unchanged.

## Actual Solutions banner button height correction (2026-11-16)

- User reported Solutions hero controls still too tall. Root cause: actual shared component uses `.product-banner__actions`, which earlier hero selectors missed; its minimum was 52px and demo padding 14px vertically. The prior patch covered overview actions below the banner.
- Source corrected in `solution-banner.component.css`: 44px height/min-height, border-box and zero demo vertical padding. `_appzpos-button-corrections.scss` carries the equivalent final override. Staging entry adds `solution-hero-height-20261116`, setting both banner demo and explore controls to exactly 44px, preserving their layout, icons and actions.
- Preview passed both controls on all nine Solutions routes at 390/1440px; POS demo and explore scroll interactions passed. Screenshot inspected. Feature-page popup was observed working, but a generic post-close scroll assertion was unsuitable due its different interaction sequence; final geometry checks cover it without changing behavior.
- Verified DNS, current entry baseline and absolute Vodien staging folder before uploading entry plus rollback only. SCSS compilation/tracking preservation passed. No markup, script, backend or production changes.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-solution-hero-height`; rollback `/_forms-review-20261113/site.pre-solution-hero-height-20261116.html`. Tests block analytics and mock API calls.

- Final deployed verification: all 18 Solutions page/viewport checks passed with exact 44px banner controls and no runtime errors. POS demo/explore scroll interactions passed. All 22 staging hashes match; six production snapshots unchanged.

## Uniform 44px hero CTA heights including both homepages (2026-11-16)

- User requested all hero buttons share one height. Homepage English/Chinese primary and WhatsApp actions now use exactly 44px height/min-height with zero vertical padding, completing the prior Blog/Industry/Solutions adjustments. Text remains centred; colours, 6px corners, links, icons and actions unchanged.
- Source appended to `_appzpos-button-corrections.scss`; CSS-only staging entry override is `uniform-hero-height-20261116`. Existing overrides preserved. Source styling compilation and tracking contract passed.
- Full preview audit covered all 20 public pages at 390/820/1440px (60 route/viewport cases), checks actual visible hero/action controls including the shared `product-banner` and scans for missed demo/WhatsApp hero controls. Exact 44px heights and no overflow passed.
- Reverified DNS, staging baseline, absolute Vodien upload/extraction folder. Only namespaced entry and rollback uploaded. Evidence/package/screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-uniform-hero-height`; rollback `/_forms-review-20261113/site.pre-uniform-hero-height-20261116.html`. Browser QA mocks APIs and blocks analytics.

- Final deployed audit passed all 60 route/viewport checks: all visible hero CTA controls measure 44px at 390/820/1440px, no missed demo/WhatsApp hero controls, runtime errors or horizontal overflow. All 22 staging hashes match and six production snapshots remain unchanged.

## Hardware and Features hero form navigation (2026-11-16)

- Both pages now explicitly use `demoMode="scroll"` in their solution-banner markup. Hero Request a demo scrolls and focuses the existing `#requestdemo` bottom form instead of opening a dialog.
- Staging entry now references `main.de8707ddd3ecabd2.js`. Existing entry CSS overrides, asset namespace, routing and measurement code remain preserved. Rollback: `/_forms-review-20261113/site.pre-hero-scroll-20261116.html`.
- Verified both deployed routes at 390/820/1440px: bottom form in view, focus moved to requestdemo, no popup or runtime errors. Both embedded form failure/success/duplicate and thank-you guards passed with mocked APIs and blocked analytics. Tracking preservation contract passed. All 22 staging entries match; six production snapshots unchanged.
- Evidence and release archive: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-hero-scroll`. Build passed with existing budget warnings. Only staging was uploaded.

## Industry hero form navigation (2026-11-16)

- F&B, Retail and Salon hero Request a Demo buttons now call `scrollToDemo()` to scroll/focus the existing bottom `#requestdemo` section, respecting reduced motion, instead of opening a popup. Other page forms and links remain unchanged.
- Staging entry references `main.6ce3b5db7499249e.js`; existing inline style overrides and routing preserved. Rollback: `/_forms-review-20261113/site.pre-industry-scroll-20261116.html`.
- All nine deployed route/viewport checks at 390/820/1440px passed: form visible, focus moved, zero dialogs or runtime errors. Build and tracking preservation passed. All 22 staging entries match and six production snapshots remain unchanged. APIs and analytics blocked during checks.
- Package and evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-industry-scroll`. Staging only.

## Chinese custom POS section spacing (2026-11-16)

- Scoped CSS reduces `#cn-custom-pos` bottom padding to 24px and its following story section top padding to 32px. Combined content gap is now 56px (previously 144px desktop, 112px tablet, 76px mobile).
- Source appended to `_appzpos-spacing-corrections.scss`; staging entry carries matching `cn-section-spacing-20261116` inline override. Current main remains `main.6ce3b5db7499249e.js`. Rollback: `/_forms-review-20261113/site.pre-cn-section-spacing-20261116.html`.
- Deployed 390/820/1440px geometry checks passed with no overflow/runtime errors, APIs and analytics blocked. All 22 staging entry hashes match and six production snapshots unchanged. CSS only; no form or tracking changes.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-cn-section-spacing`.

## Chinese custom POS top spacing (2026-11-16)

- Reduced only `#cn-custom-pos` top padding to `clamp(24px, 3vw, 40px)`, from 72px to 40px at desktop; existing bottom spacing preserved. Source `_appzpos-spacing-corrections.scss`; matching staging inline block `cn-section-top-20261116`.
- Verified deployed 390/820/1440px geometry with no overflow/errors, blocked APIs/analytics. All 22 staging hashes match and six production snapshots unchanged. CSS-only staging update; current JS unchanged.
- Rollback: `/_forms-review-20261113/site.pre-cn-section-top-20261116.html`. Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-cn-section-top`.

## Blog article shared content width (2026-11-16)

- BCRS article heading panel, image and body now fill the existing shared site shell (1240px maximum with responsive gutters), removing separate 900px and 72ch caps. Source updated in blog-bcrs component CSS and appended marketing-pages SCSS; staging equivalent inline block `blog-width-20261116`.
- Deployed width/edge alignment checks passed at 390/820/1440px with no overflow/errors and blocked APIs/analytics. All 22 staging entry hashes match; six production snapshots unchanged. CSS-only; JS/routing/tracking unchanged.
- Rollback: `/_forms-review-20261113/site.pre-blog-width-20261116.html`. Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-blog-width`.

## Blog tablet alignment and compact featured image (2026-11-16)

- Blog article header/footer now use the same responsive shell/gutters as its text, fixing their tablet edge mismatch. Featured image is centered and capped at 800px desktop/laptop and 640px at 768–1100px, fluid below 768px; natural image ratio retained without cropping.
- Source override appended to `_appzpos-marketing-pages.scss`; staging inline block `blog-responsive-20261116` supersedes image width from earlier blog-width override. Main JS unchanged. Rollback: `/_forms-review-20261113/site.pre-blog-responsive-20261116.html`.
- Deployed checks at 390/768/820/1024/1366/1440 passed header/text alignment, image loading/size, no overflow/runtime errors. API and analytics blocked; read-only production static image downloads allowed. All 22 staging hashes match and six production snapshots unchanged.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-blog-responsive`.

## Homepage industry/function label visibility (2026-11-16)

- English/Chinese hero business-type and function rows wrap instead of centered horizontal overflow that clipped edge labels. Industry controls use two columns at <=640px; module labels wrap naturally and retain their full text.
- Source appended to `_appzpos-home-hero.scss`; staging inline `hero-tags-20261116`. CSS only; main JS and tracking unchanged. Rollback: `/_forms-review-20261113/site.pre-hero-tags-20261116.html`.
- All 64 preview and 64 deployed checks passed: both languages, four industries, 320/390/600/768/820/1024/1366/1440px; label containment, hero containment and industry changes checked, no runtime errors. APIs/analytics blocked. All 22 staging hashes match and six production snapshots unchanged.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-hero-tags`.

## Mobile section heading width and contact number (2026-11-16)

- English `#integrated-pos-title` and Chinese `#cn-custom-pos-title` use full copy-column width at <=767px, removing character-width caps without changing desktop sizing.
- Contact Us WhatsApp number (`.contact-channel--whatsapp .subtitle a`) is a normal blue inline link: no green background, shadow or generated duplicate icon, including hover/focus. Existing href retained.
- Source in marketing-pages and button-corrections SCSS; staging combined inline `mobile-title-width-20261116`. Rollback: `/_forms-review-20261113/site.pre-mobile-title-width-20261116.html`.
- 12 deployed heading viewport checks and nine contact normal/hover/focus checks passed. All 22 staging entry hashes match; six production snapshots unchanged. APIs and analytics blocked. CSS only.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-mobile-title-width`.

## Mobile body text alignment and green contact number (2026-11-16)

- At <=767px, content headings and paragraphs within the marketing content areas align left; heading character-width caps removed. Hero sections explicitly excluded, desktop/tablet alignment retained. Source appended to marketing-pages SCSS.
- Contact Us WhatsApp phone number now uses dark green #357144 in normal/hover/focus states, with transparent background and no duplicate generated icon. Source appended to button-corrections SCSS.
- Staging combined inline block `contact-number-green-20261116`; current JS unchanged. Rollback: `/_forms-review-20261113/site.pre-contact-number-green-20261116.html`.
- All 20 deployed public pages passed mobile text alignment and no-overflow/runtime-error checks; nine contact colour/background state checks passed. APIs/analytics blocked. All 22 staging entries match and six production snapshots unchanged.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-contact-number-green`.

## Everything Works Together mobile alignment (2026-11-16)

- Homepage `[data-home-section="island"]` is outside `main.appz-home-story`; added explicit <=767px left alignment for its headings/paragraphs and full heading/intro width. English and Chinese supported; hero and larger breakpoints unaffected.
- Source appended to marketing-pages SCSS; staging inline `ecosystem-left-20261116`. Rollback: `/_forms-review-20261113/site.pre-ecosystem-left-20261116.html`.
- Twelve deployed viewport checks passed with no overflow/errors, APIs/analytics blocked. All 22 staging entry hashes match and six production snapshots unchanged.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-ecosystem-left`.

## Industry hero typography matched to Solutions (2026-11-16)

- Only F&B, Retail and Salon hero title IDs now use the Solutions font scale: clamp(44px,4.7vw,68px), 46px at <=1000px, clamp(38px,10vw,54px) at <=767px; Manrope, weight 700, line-height 1.04, letter-spacing -.035em. Existing colours and layout retained; Custom Solutions not targeted.
- Source appended to marketing-pages SCSS; staging inline `industry-hero-type-20261116`. Rollback: `/_forms-review-20261113/site.pre-industry-hero-type-20261116.html`.
- Thirty-two deployed typography checks passed across the three industries and Solutions reference at 320/390/600/768/820/1024/1366/1440px, no overflow/runtime errors. APIs/analytics blocked. All 22 staging entry hashes match; six production snapshots unchanged.
- Artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-industry-hero-type`.

## All hero titles follow homepage (2026-11-16)

- All 20 public page hero titles now use the English homepage typography: Manrope/700, responsive desktop clamp(2.35rem,min(4.4vw,7.2dvh),4rem), tablet clamp(2rem,5.6vw,3.25rem), mobile clamp(1.85rem,8.5vw,2.45rem), line-height 1.12 and letter-spacing -.03em. Includes Chinese homepage, all Solutions/Industries, Blog/article, EDGE Grant and Contact. Existing hero alignment and content remain.
- Source appended to `_appzpos-marketing-pages.scss`; equivalent `home-hero-type-20261116` entry override preserves all previous staging styles. Same JS/assets/routing. Rollback `/_forms-review-20261113/site.pre-home-hero-type-20261116.html`.
- 60 preview and 60 deployed checks passed across 20 routes at 390/820/1440px: matching sizes, weight, line height, no horizontal overflow/runtime errors. Tracking preservation passed; 22 staging HTML hashes matched and six production snapshots unchanged. API and analytics blocked during browser QA. Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-home-hero-type`.

## EDGE and Blog mobile hero order (2026-11-16)

- At <=767px, EDGE Grant and Blog listing heroes display copy before artwork. Blog buttons remain with the copy; tablet/desktop ordering unchanged. Source appended to `_appzpos-marketing-pages.scss`, staging entry override `mobile-hero-order-20261116`; no JS/routing/tracking changes.
- 12 preview and 12 deployed checks passed at 320/390/600/767/820/1440px, asserting mobile copy above image and no horizontal overflow/runtime errors. All 22 staging hashes matched; six production snapshots unchanged. APIs/analytics blocked. Rollback `/_forms-review-20261113/site.pre-mobile-hero-order-20261116.html`; evidence `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-mobile-hero-order`.

## Staging browser-side form spam safeguards (2026-11-16)

- Current staging entry references `main.81a7145b89191a77.js`. Previous inline CSS overrides retained; no routing/styles asset/backend/production changes. Rollback `/_forms-review-20261113/site.pre-antispam-20261116.html`.
- Shared English/Chinese embedded/popup demo and Contact templates include an offscreen, aria-hidden, tabindex=-1, autocomplete-off `website_url` honeypot. It is excluded from the API payload. On exact staging hostname, LeadSubmissionService applies a shared in-flight lock, five-attempt rolling one-minute cap and one-minute successful-submission cooldown. Session storage stores timestamps only and survives refresh in the same tab; storage denial falls back to in-memory enforcement. Failures release the lock and preserve input. English/Chinese messages explain waits. No minimum form-completion time or CAPTCHA added.
- This is bypassable client-side friction, not server-side spam protection. Direct API calls/new browser sessions bypass it. Backend enforcement requires separate scope; production API and shared analytics unchanged.
- Build passed with existing budget/CSS warnings. Unit guard checks passed (trap, concurrent request, attempts, expiration, persisted success cooldown, denied storage); repository test `UI/scripts/lead-spam-guard.test.cjs`. Eight preview/deployed mocked form scenarios passed for English/Chinese, embedded/popup/Contact at desktop/mobile, including trap rejection before API, no trap conversion, invalid/failure/malformed handling, duplicate protection, single success Ads/GA4 events and thank-you guards. Separate deployed contact cooldown-after-reload test passed. Tracking contract passed; all 22 staging entry hashes matched and six production snapshots unchanged. No real enquiries/analytics sent. Evidence `/Users/dmsyx/.codex/appzpos-staging-deployments/20261116-antispam`.

## Compact footer and wider hero description (2026-11-17)

- Staging entry `/_forms-review-20261113/site.html` includes CSS-only `footer-height-and-hero-description-20261117`. Footer top/bottom spacing is reduced; mobile copyright retains 80px bottom padding for the floating demo CTA. All 22 footer links remain intact. Desktop homepage description uses full available hero width and fits one line from 1025px; headline typography is unchanged and mobile/tablet description wrapping is retained.
- Source: `UI/src/styles/_appzpos-footer-corrections.scss` imported last in `custom-theme.scss`, and appended desktop description rules in `_appzpos-home-hero.scss`. Preserve the entry override until rebuilding.
- Uploaded only namespaced entry plus rollback after checking staging DNS 101.100.228.105, cPanel appzgate/dedicated IP, absolute destination `/home2/appzgate/public_html/appzpos.com`, and entry comparison. Root routing and production untouched. Rollback: `/_forms-review-20261113/site.pre-footer-height-20261117.html`.
- Deployed 390/820/1025/1280/1440px checks passed: reduced footer spacing, all footer links, single-line desktop hero description, no horizontal overflow or page errors. All 22 staging HTML hashes matched and six production snapshots remained unchanged. Tracking preservation contract passed. APIs mocked and analytics blocked; Chromium emulation used.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-footer-height`.

## Solution illustration spacing and Chinese management width (2026-11-17)

- Staging entry includes CSS-only `solution-image-spacing-20261117`. Selected illustrations in the homepage solution selector no longer scale beyond their layout columns; width is capped at 320px desktop, 300px tablet and 260px mobile, with 32/28/24px grid gaps. Applies to all seven tabs on English/Chinese homepages, including POS, QR ordering and queue display. Source appended to `_appzpos-order-flow.scss`.
- Chinese `#cn-unified-management` uses the shared 1240px shell and responsive gutters. Its card list no longer has the narrower 1120px cap; heading uses full content width. Source appended to `_appzpos-marketing-pages.scss`.
- Deployed only namespaced entry and rollback to verified staging folder; previous overrides remain intact. Rollback: `/_forms-review-20261113/site.pre-solution-spacing-20261117.html`.
- Passed 42 deployed solution tab/language/viewport checks at 390/820/1440px for image loading, containment, clear text gap, no overflow or runtime errors. Chinese heading/section width matches header at all three widths. Tracking contract passed; 22 staging hashes matched and six production hashes remained unchanged. APIs mocked and analytics blocked.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-solution-image-spacing`.

## Island image size rebalance (2026-11-17)

- User found the previous contained illustrations too small. `island-size-20261117` increases caps to 400px desktop, 360px tablet, 300px mobile; desktop columns use .95fr/1.05fr with a 40px gap. Images remain untransformed and contained. Source appended to `_appzpos-order-flow.scss`; earlier spacing and Chinese content-width corrections remain.
- Staging-only entry update plus rollback `/_forms-review-20261113/site.pre-island-size-20261117.html`, after DNS/path and entry checks. Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-island-size`.
- All 42 deployed English/Chinese solution-tab checks at 390/820/1440px passed with loaded, contained images and clear text gaps, no runtime errors/overflow. Chinese width checks, tracking contract, 22 staging hashes and six unchanged production snapshots passed. APIs mocked and analytics blocked.

## Standardized visible island artwork (2026-11-17)

- Staging entry includes `island-standard-20261117`. The seven original WebP assets have differing transparent margins. CSS now positions and sizes each image from its alpha bounds (threshold 32), fitting the visible artwork into 90% of the common 4:3 frame without distortion. Existing responsive frame widths and text gaps remain; overflow stays within the image frame.
- Includes aliases for Chinese tab IDs (`pos`, `qr`, `kds`, `hub`) so corresponding images have identical visible dimensions on both homepages. No image files, markup, content or tracking changed. Source appended to `_appzpos-order-flow.scss`.
- Deployed only namespaced entry plus rollback `/_forms-review-20261113/site.pre-island-standard-20261117.html` after DNS, verified folder and current-entry checks. Evidence, bounds and package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-island-standard`.
- All 42 deployed tab/language/viewport checks passed at 390/820/1440px: 90% visible-artwork fit, reserved text gap, loaded images, no overflow/runtime errors. All 21 corresponding English/Chinese image dimension pairs matched within 1px. Chinese content-width checks, tracking contract, 22 staging hashes and six unchanged production snapshots passed. APIs mocked and analytics blocked.

## Smooth island tab transitions (2026-11-17)

- Staging entry includes CSS-only `island-transition-20261117`. Selected image frame and details fade in with an 8px upward slide over 300ms. Per-selection animation names replay on each tab change, including Chinese tab aliases; same-tab clicks do not restart the animation. Image normalization transforms remain untouched. Reduced-motion preferences disable this effect.
- Source appended to `_appzpos-order-flow.scss`. No scripts, assets, markup, tracking or routing changed. Staging rollback: `/_forms-review-20261113/site.pre-island-transition-20261117.html`. Package/evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-island-transition`.
- Passed 42 deployed normal-motion and 42 reduced-motion tab/language/viewport checks (390/820/1440px), plus rapid switching checks. Animation replay, duration, final selection, visible image normalization, text gaps and Chinese content widths passed with no runtime errors/overflow. Tracking contract passed; 22 staging entries match and six production snapshots unchanged. APIs mocked and analytics blocked.

## Island cross-fade switching (2026-11-17)

- User still found the island tab switch not smooth. Cause: a single `<img>` swapped `src`, so each first click fetched/decoded a 110–180 KB image mid-fade, and the entrance was only a 300ms/8px fade-in with no outgoing fade. Now `home-order-flow` renders all island images stacked (`.appz-ecosystem__visual-layer`, `.is-selected` visible, others `visibility:hidden`, `fetchpriority=low`), so images are loaded before any click and cross-fade (500ms, 60ms delay, slight rise/scale). `switchPhase` (0/1) on `.appz-ecosystem__copy` as `data-switch-phase` alternates keyframe names so the text block (550ms) and its list items (staggered 140–390ms) replay on every change; same-tab clicks do not. Option highlight transitions 280ms. Reduced motion: no transitions/animations. Old `:has([data-visual-id])` animation rules removed from `_appzpos-order-flow.scss`; `data-visual-id` now lives on each layer, so the alpha-bounds normalization still applies.
- **Staging packaging step (important):** the staging `main.<hash>.js` is NOT the raw build output. Every string literal beginning `assets/` (or `/assets/`) is rewritten to `/_forms-review-20261113/assets/` (regex `(["'`])/?assets/` -> prefix), which reproduces the deployed bundle byte-for-byte. Without it images resolve to `/assets/...`, which on staging returns HTML (200). Keep `runtime.*.js` from the previous release (the new build differs only in minifier variable names).
- Staging entry `/_forms-review-20261113/site.html` now references `main.510453147eb28090.js` and carries inline `island-crossfade-20261117` (the SCSS block plus a stand-in `animation:none` for the old frame rule). Previous inline blocks retained. Rollback entry: `site.pre-island-crossfade-20261117.html`.
- Deployed via the user's logged-in Vodien cPanel File Manager to `/home2/appzgate/public_html/appzpos.com` only (extract `appzpos-island-crossfade.zip`) after DNS recheck (staging 101.100.228.105, production 4.193.116.8). Production hostnames, `.htaccess`, backend and analytics were not touched.
- Verified: 36 motion and 42 reduced-motion preview checks, repeated 36/42 against the deployed site at 390/820/1440px English + Chinese (no blank frame while crossfading, overlapping layers, settle state, one selected layer, same-tab no replay, 90% artwork fit, text gap, no overflow/runtime errors). Eight mocked form/thank-you scenarios passed on the deployed site; tracking-preservation contract and 18 unit tests passed; staging entry/main/rollback hashes match the package and six production snapshots unchanged. Chromium emulation, not Safari; APIs mocked and analytics blocked.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-island-crossfade`.

## Google Ads landing page (2026-11-17 — LIVE ON GITHUB PAGES; older notes below are historical)

- **Current state (supersedes the "PR open / not live" wording below):** Landing-page PRs (#1 through #12) are merged and deployed to GitHub Pages: https://xuen00915.github.io/appzpos/lp/restaurant-pos-system-singapore/ . The user's standing instruction: merge and deploy landing-page changes to GitHub Pages, never touch cPanel/Vodien/`appzpos.com`/`website.appzpos.com`. The Pages workflow has no cPanel/FTP/SSH step.
- Page now: one-screen hero (H1 "Restaurant POS System in Singapore", 4.8 Google rating stars + score with no review count, three data cards with icons, full-width purple IMDA banner, 3-field demo form), EDGE Grant packages directly after the hero, modules, EDGE grant band (square badge on desktop, long banner on mobile), steps, 10-question FAQ in two columns of five, final CTA, slim footer. No section eyebrows or icon tiles. One `$lp-radius` (6px) token for all corners; floating bubbles equal size/gap with the Messenger bubble swapped for a `tel:+6583109631` call bubble on this page only.
- Correction: the landing page is NOT untagged. The hidden site header still loads the shared GTM container (`environment.appzPOSTagID`) and the Meta Pixel. No landing-specific Ads conversion action exists; adding one needs explicit user authorization for the Ads account. `prepare-github-pages.mjs` also writes the landing title/description/noindex into the static HTML.
- README.md documents the landing page and links the SMEs Go Digital listing (https://smesgodigital.gov.sg/web/solution/20240028/appzpos-f-b-point-of-sales).
- Open items: Ads/GA4 conversion action; real test enquiry not yet sent; office number mismatch (+65 6393 2254 vs 2259); the 4.8 rating is a static value.

### Historical notes (first build)

- User asked for the landing page "in the github only": it exists in the repo working tree only. Nothing was uploaded to Vodien staging or production, no `.htaccess`/DNS/GTM/Ads change, and nothing was committed or pushed.
- Route `/lp/restaurant-pos-system-singapore` (`data: { landing: true }`) -> `LandingPosSingaporeComponent` in `UI/client_specifc/<id>/components/landing-pos-singapore/`. Content: slim bar (logo, WhatsApp, Get a Free Demo), hero with the single shared demo form (`<app-custom-request-demo [compact]="true">` in `#requestdemo`), six module cards, EDGE Grant band, 3 steps, 5-question FAQ, final CTA, slim footer. All claims come from existing site copy (up to 50% EDGE Grant for eligible companies with the "support levels vary by activity" qualifier; GrabFood/Foodpanda/Deliveroo; cloud access; local support; kiosk sizes). No invented stats, prices or testimonials.
- Shared changes: `CustomRequestDemoComponent` gained `@Input() compact` (default false, so every existing page is unchanged) that hides eyebrow/lead/contact block and stacks the form. `AppComponent` toggles `body.appz-landing` for URLs starting `/lp/`; `_appzpos-marketing-pages.scss` hides `app-header`/`app-footer` under it. The floating WhatsApp/Messenger rail stays. New asset `src/assets/images/appzpos-screen-restaurant-1120.webp` (66 KB, from the 1.4 MB PNG).
- Tracking: reuses the shared demo form, so the existing demo-success GTM triggers/thank-you flow apply unchanged. WhatsApp links use the same wa.me URL with the visible text "WhatsApp Us". NO new Ads label, page-view action or GA4 event was created; the Ads account has no page-view action for this route and the staging measurement adapter does not map it. The page sets `noindex, nofollow` while shown (removed on destroy).
- Data issue noticed: footer shows office phone +65 6393 2254, the demo form shows +65 6393 2259. The landing page deliberately shows only the WhatsApp number (+65 8310 9631) and email until the correct office number is confirmed.
- Verified locally (production build served on localhost, APIs mocked, analytics blocked) at 1440/820/390px: header/footer hidden, one h1, one form, no duplicate IDs, no horizontal overflow, no runtime errors. 9 new unit tests pass (landing + compact form); tracking-preservation contract passes. `fnb-static-modes.spec.ts` has an unrelated failing floor-plan image assertion on the F&B page (not touched). Landing component CSS is 6.15 kB (warning at 4 kB, error at 7 kB).
- If deployed later, remember the staging packaging rule: `main.js` string literals starting `assets/` must be prefixed `/_forms-review-20261113/`; the staging entry also needs an inline stand-in for the `body.appz-landing` hide rule (staging serves the older compiled `styles.*.css`), and a rewrite/route for `/lp/...` since only exact listed routes are served by the new entry.
- Evidence/screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-landing-page`.

- GitHub Pages path (user chose "landing page only, via PR"): PR https://github.com/xuen00915/appzpos/pull/1 (branch `landing/google-ads-pos-singapore`, one commit on top of origin/main 6a1e1cf) contains ONLY the landing page, so none of the uncommitted staging redesign work is published. Merging to `main` triggers `.github/workflows/deploy-pages.yml` (public site, base `/appzpos/`); live URL after merge: https://xuen00915.github.io/appzpos/lp/restaurant-pos-system-singapore/. The PR version toggles `body.appz-landing` from the landing component itself (the committed base's `AppComponent` has no router); the working tree now matches. `prepare-github-pages.mjs` writes `lp/restaurant-pos-system-singapore/index.html` so the ad URL returns HTTP 200 (GitHub Pages otherwise serves deep links via 404.html with status 404, which Google Ads rejects). Clean worktree used for the PR: `/private/tmp/claude-501/appzpos-landing-wt` (safe to remove with `git worktree remove`). Nothing was deployed to Vodien staging/production.

## APPZPOS-only page-view and GA4 measurement (2026-11-17 — DEPLOYED to staging)

- User asked that staging page-view tagging go only to APPZPOS, never to Appzgate-named assets. Audit: all 15 Ads page-view actions in AppzPOS (740-384-8225) are APPZPOS-named and already fire via the staging adapter; Appzgate-named Ads actions (WhatsApp, Contact Form, Request a Demo Form, GA4 enquiry) are click/lead actions, already blocked by the `awct` blocklist. The remaining leak was the shared GTM Google tag for the Appzgate GA4 property `G-JW8VE6FEP3`, which sent a `page_view` (and Call events) for every staging page.
- Fix in `staging-measurement.ts` (staging hostname only, set before GTM/gtag start): `window['ga-disable-G-JW8VE6FEP3'] = true` (Google's documented per-property opt-out). APPZPOS `G-681EVHYGDY` and `AW-791515048` labels are untouched. No shared GTM/Ads/GA4 setting was changed. Contract test: `UI/scripts/staging-measurement-contract.mjs`.
- Side effect to know: the Appzgate `Call` GA4 event from staging is now also suppressed; APPZPOS keeps its own Call tag.
- Deployed `main.35a119b12627b161.js` via `/_forms-review-20261113/site.html` (only the entry, that bundle and a rollback entry were extracted at verified `/home2/appzgate/public_html/appzpos.com`; DNS rechecked: staging 101.100.228.105, production 4.193.116.8). Rollback: `/_forms-review-20261113/site.pre-appzpos-only-pageview-20261117.html`; prior `main.510453147eb28090.js` remains on the server.
- **Build gotcha:** the working tree's `ng build` now includes the unreleased Google Ads landing-page route (adds ~20 KB), so this release was made by inserting the exact compiler output (`i["ga-disable-G-JW8VE6FEP3"]=!0,` after the `gtm.blocklist` push) into the previously deployed bundle instead of shipping a fresh build. Before the next full staging build, exclude or intentionally include the landing code.
- Verified on the deployed site: all 22 routes (incl. both thank-you pages) send exactly one `page_view` to `G-681EVHYGDY`, none to `G-JW8VE6FEP3`, and exactly the expected APPZPOS Ads page-view label (none on unmapped pages). Tel/WhatsApp/Messenger clicks sent only APPZPOS labels and no Appzgate GA4 hits. Six production snapshots unchanged. Analytics intercepted before transmission; no real submissions.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-appzpos-only-pageview` (`probe.cjs`, `clicks.cjs`, `probe-*.json`, `appzpos-only-pageview.zip`).

## Partner integrations page and uniform form contact rows (2026-11-17 — DEPLOYED to staging)

- `/pos-solutions-partner-integrations` now uses the shared `app-solution-banner` hero like the other Solutions pages (title "POS Integrations", one-sentence description, Request a demo / Explore integrations, highlights; no eyebrow). Document title is "POS Integrations: Payments, Delivery & Accounting | APPZPOS". Delivery Logistic and Food Delivery Apps are one wide card with centred rows (GrabExpress, pandago, Lalamove / GrabFood, foodpanda). All Deliveroo text/logo removed from this page ONLY; other pages (home, F&B, Order Hub, Cloud POS, Chinese home) still mention Deliveroo and were not touched.
- All 34 logos are fitted into one identical box per breakpoint (150x52 desktop, 140, 120x46, 112x44, 88x40). Per-logo `--cw/--ch/--ox/--oy` values (visible content size and offset inside the 500x375 canvases, measured from the image files) are inline on each `<img>`; white canvases are blended out with `mix-blend-mode: multiply`. Re-measure if a logo image is replaced. Source: `UI/src/styles/_appzpos-partners.scss`.
- Bottom Request-a-Demo panel: email, phone and address rows are all 14.08px / 21.12px on every page (pages wrapping the form in `#content` previously rendered the address at 15.7-17.3px). Source: end of `_appzpos-marketing-pages.scss`.
- Staging entry `/_forms-review-20261113/site.html` now references `main.b8773953d33a81ee.js` and carries inline `partners-contact-20261117`. The bundle was built from a temporary copy WITHOUT the unreleased Google Ads landing route, then `assets/` literals were prefixed with `/_forms-review-20261113/`; runtime/polyfills/styles stay on the previous release files. Rollback: `site.pre-partners-contact-20261117.html`.
- Uploaded only via Vodien cPanel File Manager to `/home2/appzgate/public_html/appzpos.com` after DNS recheck (staging 101.100.228.105, production 4.193.116.8) and confirming the live entry matched the saved baseline. Deployed files match the package hashes. Checks at 9 widths (320-1440) and 17 routes: no clipping, overflow, runtime errors or missing images; APIs mocked and analytics blocked. Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-partners-contact`.

## Larger form contact rows (2026-11-17 — DEPLOYED to staging)

- User asked for larger contact rows in the bottom Request-a-Demo panel. Email, phone and address are now all 16px / 1.5 line height (24px icon column, 1.2rem icons) on every page with the panel; supersedes the 14.08px figure in the previous note. Source: end of `UI/src/styles/_appzpos-marketing-pages.scss`.
- Staging entry carries inline `contact-rows-size-20261117` after `partners-contact-20261117`; JS unchanged (`main.b8773953d33a81ee.js`). Rollback: `/_forms-review-20261113/site.pre-contact-size-20261117.html`. Uploaded via Vodien cPanel File Manager to `/home2/appzgate/public_html/appzpos.com` after DNS and baseline-hash checks; deployed entry/rollback hashes match the package. The Contact Us page's own address block (separate layout, 14px) was intentionally not changed.
- The server sends no Cache-Control for the entry file, so browsers can show the previous copy until a hard refresh. Adding a no-cache header would need a staging `.htaccess` edit (not done; needs explicit go-ahead).

## Partner page: smaller logos and "Delivery Partners" heading (2026-11-17 — DEPLOYED to staging)

- Partner-integrations logo fit box reduced ~15%: 128x44 desktop, 120x44 (<=1279px), 104x40 (<=1023px), 96x38 (<=767px), 76x34 (<=379px). Still one identical box per breakpoint; per-logo measurements unchanged. Source `_appzpos-partners.scss`; staging inline block `partners-logo-size-20261117` (rollback `site.pre-logo-size-20261117.html`).
- The merged delivery card heading is now "Delivery Partners" (the old "Delivery Logistic & Food Delivery Apps" repeated "Delivery"). Template change, so the entry now references `main.14d58cbe8e32b89e.js` (built from the temp copy without the landing route, `assets/` literals prefixed with `/_forms-review-20261113/`). Rollback `site.pre-delivery-title-20261117.html`; previous bundle `main.b8773953d33a81ee.js` remains on the server.
- Deployed via Vodien cPanel File Manager to `/home2/appzgate/public_html/appzpos.com` after DNS/baseline checks; entry, bundle and rollback hashes match the packages. Evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-partners-contact`.

## Separate call and WhatsApp links in the form contact row (2026-11-17 — DEPLOYED to staging)

- In the bottom Request-a-Demo panel the combined phone line is still ONE row, but "+65 6393 2259 (Office)" is now a `tel:+6563932259` link and "+65 8310 9631 (WhatsApp)" a direct `https://wa.me/6583109631?text=...` link (new tab, `rel="noopener noreferrer"`), separated by " / ". Single phone icon; both links are plain underlined inline links (not the green WhatsApp CTA style), 16px, each link's text kept unbroken on mobile (`white-space: nowrap`). Source: `custom-request-demo.component.html` (`.appz-demo__phones`) and the end of `_appzpos-marketing-pages.scss`.
- Tracking is unchanged and reuses the staging adapter: the tel link fires the APPZPOS call conversion; the wa.me link fires `appzpos_whatsapp_click`, the APPZPOS WhatsApp conversion and GA4 `whatsapp_click` (placement `page`), and still opens WhatsApp natively. Verified with clicks cancelled/blocked; no message or call was made.
- Staging entry references `main.48f717aa4e4cd917.js` plus inline `contact-phone-links-20261117` and `contact-phone-row-20261117`. Rollback `site.pre-phone-row-20261117.html` (previous bundle `main.8470c7316d16b84b.js` kept). Deployed via cPanel to `/home2/appzgate/public_html/appzpos.com` after DNS/baseline checks; hashes match. Evidence in `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-partners-contact`.
- An intermediate two-row version (`main.8470c7316d16b84b.js`, rollback `site.pre-phone-links-20261117.html`) was live for a few minutes before the user asked for one row.

## Form phone links: underline removed (2026-11-17 — DEPLOYED to staging)

- The office/WhatsApp links in the Request-a-Demo contact row no longer underline (`text-decoration: none`); they look like the other contact rows, hover/focus turns the text white, focus-visible keeps an outline. CSS only: entry `site.html` carries inline `contact-phone-nounderline-20261117`; JS unchanged (`main.48f717aa4e4cd917.js`). Source: `_appzpos-marketing-pages.scss`. Rollback `site.pre-phone-nounderline-20261117.html`. Uploaded via cPanel to `/home2/appzgate/public_html/appzpos.com` after DNS/baseline checks; hashes match.

## Partner integrations hero text restored (2026-11-18 — DEPLOYED to staging)

- User asked for the original hero wording back. `/pos-solutions-partner-integrations` keeps the shared Solutions-style `app-solution-banner` layout (image, highlights, buttons) but the title is again "Seamless POS Integration with the Leading Third Party Platforms" and the line under it is the original "CONNECTED TO YOUR BUSINESS" (it was an eyebrow in the old markup; it is now the banner description, kept in capitals as originally written). The browser tab title is back to "POS Integration with Third Party Platforms | Payments".
- Template/TS change: staging entry now references `main.0b058769a8434e6a.js` (built from the temp copy without the landing route; `assets/` prefixed with `/_forms-review-20261113/`). Rollback `site.pre-partners-hero-original-20261118.html`; previous bundle `main.48f717aa4e4cd917.js` kept. Uploaded via cPanel to `/home2/appzgate/public_html/appzpos.com` after DNS/baseline checks; hashes match. Evidence in `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-partners-contact`.

## Landing page: logo-free POS screen and no-price "price after grant" line (2026-11-18 — LIVE ON GITHUB PAGES)

- PR #13 (merged 1184831): the EDGE packages section of `/lp/restaurant-pos-system-singapore` uses `appzpos-screen-restaurant-nologo-1120.webp` (APPZPOS logo painted out; shared `appzpos-screen-restaurant-1120.webp` used by the main-site home pages is untouched).
- PR #14 (merged 75a50c6): under the "Five EDGE Grant packages for your outlet" heading the page says "Your price after grant starts from Package 1" plus "Use Get a quote on any package for your exact price. Grant support is for eligible SMEs and varies by activity." The user explicitly does NOT want an actual price shown, so no figure is in the source, bundle or tests (a unit test fails on any `$`/`S$`/`SGD` amount). Do not add one without a new instruction.
- Reference only (not shown on the page): the SMEs Go Digital listing (https://smesgodigital.gov.sg/web/solution/20240028/appzpos-f-b-point-of-sales), read 2026-11-18, shows "Starting from $1,660 / Price after grant" ($3,320 before grant, estimated grant claimable $1,660) for its lowest package, which is POS-only ("Package 1 (1 Digital Ordering System)"). The landing page's Package 1 is POS + QR (mirrors the site's PSG grant page), so the two package definitions differ; confirm before ever quoting a listing price against the landing page's packages.
- GitHub Pages only; no `.github` changes; cPanel/`appzpos.com`/`website.appzpos.com` untouched. Evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-landing-page` (`nologo-*.png`, `price-*.png`).

## Landing page: included software and support types (2026-11-18 — LIVE ON GITHUB PAGES)

- PR #15 (merged 60f7925): the one-line "Included in all 5 packages" note became a block with Software (1-year subscription for digital ordering and payment; Central Admin Portal with unlimited users; Business Analytics Module: customer management, food menu, promotion and upsell, inventory management) and Support ("Email, phone and messaging apps."). Source of the support list: the user's screenshot of the SMEs Go Digital listing, which ticks Email, Phone Support and Messaging Apps and crosses out FAQs/Forum, Onsite Support, Chatbot and Contact Form. A unit test fails if FAQ/forum/onsite/chatbot/contact form is claimed. The listing says Package 5 also includes integration to a third-party accounting solution; the page does not claim it.
- GitHub Pages only; no `.github` changes; cPanel/`appzpos.com`/`website.appzpos.com` untouched. Evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261117-landing-page/incl-*.png`.

## Landing page: hero cards and hardware photo (2026-11-18 — LIVE ON GITHUB PAGES)

- PR #16 (merged 528b3f7): the three hero data cards are now "Unlimited users / With the Central Admin Portal" (users icon), "1-year subscription / Included in all 5 packages" (package icon) and "Local support / Email, phone and messaging apps" (headset icon). Titles reserve two lines (`min-height: 2.6em`, off for the single-column mobile layout) so the labels align. The hero no longer names delivery platforms; it still fits one screen at 1024x768, 1280x720, 1366x768, 1440x900 and 1920x1080.
- PR #17 (merged 8849bbc): the EDGE packages section uses `appzpos-hardware-lineup-1168.webp` (the user's pasted photo of the kiosk, POS terminal with printer and phone ordering, cropped to rows 17-996 to drop a white strip and a partial "WE ARE" caption; 80 KB) instead of the POS screen illustration. Capped at 520px and centred at <=1024px. The earlier `appzpos-screen-restaurant-nologo-1120.webp` is now unused on the landing page but left in the repo. The photo's small on-screen/device branding (APPZPOS on the terminal, appzgate on the phone UI) is part of the supplied image.
- GitHub Pages only; no `.github` changes; cPanel/`appzpos.com`/`website.appzpos.com` untouched.


## Compact desktop home heroes (2026-11-18 — DEPLOYED to staging)

- English and Chinese home heroes now cap their desktop height at `min(100dvh, 900px) - header height` (824px hero with the current 76px header). Tall displays no longer stretch the device artwork to fill the screen; shorter desktop viewports retain their prior fit. Mobile/tablet rules are unchanged.
- Source: end of `UI/src/styles/_appzpos-home-hero.scss`. Staging entry carries CSS-only `hero-height-cap-20261118`; preserve until full stylesheet compilation. All previous scripts, markup and inline overrides remain byte-identical.
- Uploaded entry and rollback only to verified Vodien dedicated IP 101.100.228.105, cPanel appzgate, `/home2/appzgate/public_html/appzpos.com`. DNS and current-entry baseline rechecked before activation. No routing or production changes. Rollback: `/_forms-review-20261113/site.pre-hero-cap-20261118.html`.
- Preview and deployed verification each passed 72 category-tab checks across both languages at 1920x1200, 1920x1080, 1920x1440, 2560x1440, 1440x900, 1470x752, 1280x720, 390x844 and 820x900. No tab/artwork overlap, missing terminal images, horizontal overflow or runtime errors. SCSS compilation and tracking-preservation contract passed. All 22 staging entry hashes and rollback match; six production snapshots unchanged. APIs mocked and analytics blocked; Chromium emulation used.
- Evidence/package: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261118-hero-cap`.


## Natural tall-desktop hero artwork (2026-11-18 — DEPLOYED to staging)

- Follow-up to the hero cap: at desktop widths >1024px and heights >=900px, English/Chinese home heroes now use content-driven height and natural grid rows. Terminal artwork is 880px wide (bounded by available width), intrinsic aspect ratio, with -80px top margin compensating for transparent PNG padding. Both languages now use identical device size regardless of viewport height; smaller desktop/mobile/tablet rules remain unchanged. This supersedes the fixed 824px hero cap on tall displays.
- Source: final block of `UI/src/styles/_appzpos-home-hero.scss`; staging entry inline `hero-image-natural-20261118`. Scripts/markup and previous overrides unchanged. Rollback: `/_forms-review-20261113/site.pre-hero-image-20261118.html`.
- Fixed release file timestamp: earlier ZIPs used default 1980 dates, producing Last-Modified in 1979 and potentially preserving stale cached HTML. Re-extracted identical entry bytes using current ZIP timestamp; HTTP and HTTPS now return current Last-Modified and conditional requests with older timestamps return 200. Future archives MUST set current entry timestamps (not ZipInfo default). No .htaccess/cache-policy change.
- 72 preview and 72 deployed category/viewport checks passed on both homepages across 390–2560px widths, including 1920x1200 and 2560x1440. Deployed checks also assert full heading clears header at scroll top. No overlap, image failures, horizontal overflow or page errors; tall-desktop artwork widths all 880px. SCSS compilation/tracking contract passed. All 22 HTTPS entries and both HTTP homepages matched; six production snapshots unchanged. Analytics blocked and APIs mocked.
- Verified cPanel appzgate, dedicated IP 101.100.228.105, absolute staging destination `/home2/appzgate/public_html/appzpos.com` before uploads; root routing and production untouched. Evidence and current-timestamp archive: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261118-hero-image`.


## Fixed centered large-screen heroes (2026-11-18 — DEPLOYED to staging)

- User requested a smaller, explicitly centered hero image and unchanging geometry beyond 1920x1200. Latest override `hero-standard-centered-20261118` sets tall-desktop artwork to 760px x 427.72px, relative positioning, no transform, auto inline margins and centered grid alignment. Frame is capped at 1240px, copy top padding fixed to 48px, and hero height follows content. Applies above 1024px width and at least 900px viewport height. Supersedes the previous 880px tall-desktop image.
- Source: final block of `UI/src/styles/_appzpos-home-hero.scss`. Rollback: `/_forms-review-20261113/site.pre-hero-standard-20261118.html`. CSS-only entry change; scripts/markup/tracking and root routing preserved. Archive has current modification timestamps.
- 56 preview and 56 deployed checks passed across English/Chinese routes and seven viewports, including 1920x1080, 1920x1200, 2560x1440 and 3840x2160. Exact cross-viewport comparison: image 760x427.71875 with zero horizontal center offset in every large-screen category; hero heights unchanged across these sizes (English 833.40625px, Chinese 905.078125px). Heading clearance, no overlap/overflow/runtime errors and loaded artwork passed. Mobile/tablet checks passed. APIs mocked, analytics blocked. SCSS compilation and tracking contract passed.
- Verified Vodien cPanel appzgate, dedicated IP 101.100.228.105, staging path `/home2/appzgate/public_html/appzpos.com`, DNS and baseline before activation. All 22 HTTPS staging entries and both HTTP homepages match; rollback matches; six production snapshots unchanged.
- Evidence/package and screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261118-hero-standard`; exact geometry comparison: `standard-geometry.json`.


## Google Ads landing restaurant background (2026-11-18 — LIVE ON GITHUB PAGES)

- User clarified the supplied restaurant/POS photograph is for the Google Ads landing page, NOT website.appzpos.com. PR #20 merged as 8ac2991ca873be2a4a93126d82c060ef00f31a5b; GitHub Pages run 44247703587 succeeded. URL: https://xuen00915.github.io/appzpos/lp/restaurant-pos-system-singapore/ .
- Added original image `assets/images/restaurant-pos-hero-background.png` (1792x878, byte-identical to supplied PNG), as decorative high-priority `.lp-hero__background`, responsive object-fit cover, light overlay and stronger mobile wash. Grant banner gets an opaque white backdrop. Existing hero copy, cards, form, CTA and tracking preserved. This landing page has no animated terminal; the earlier keep-terminal answer referred to the incorrectly inferred home/staging scope.
- Only three landing-page files changed. No cPanel, Vodien, staging, production website, backend or workflow edits. Staging entry remains byte-identical to the preceding standardized-hero release. The stopped staging-background draft was never deployed.
- Production Angular build and Pages preparation succeeded with existing warnings. Seven local and seven deployed browser checks passed from 320px to 2560px: supplied image loaded/covers hero, hero fits viewport, one h1, one three-field form, enabled submit/input interaction and CTA scroll; no runtime errors. APIs and analytics intercepted; no enquiry submitted. Existing whole-page overflow at 820/390/320 was reproduced on the pre-change public page (hero itself fits); not corrected in this background-only PR.
- Worktree: `/private/tmp/appzpos-ads-hero-background` branch `codex/ads-hero-background-20261118`. Evidence/screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261118-ads-hero-background`.


## Google Ads hero reference redesign (2026-11-18 — LIVE ON GITHUB PAGES)

- User wanted the complete look of the supplied reference, not only a background swap. PR #21 merged as fc424920777b0aee62a9ddea175c9df9b33c33e1; GitHub Pages deployment 44249840882 succeeded.
- Hero now has a larger integrated logo (desktop top action buttons hidden; mobile header/actions retained), two-line headline with orange Singapore and curved underline, unboxed three benefit columns with dividers/icons, raised rating badge, compact IMDA lockup/text badge, rounded blue demo panel, orange free emphasis, larger inputs with placeholders and orange Book My Free Demo arrow button. Blue/orange SVG bottom waves finish the hero. Existing restaurant photograph remains the background. Mobile/tablet stack the sections with readable contrast.
- `custom-request-demo.component.html` changes are conditional on compact=true: free emphasis, placeholders, submit wording/arrow. Noncompact title/submit labels and fields retain existing behavior. Form control IDs, validators, payload and submit handler unchanged. `landing-pos-singapore.component.html` and `_appzpos-landing.scss` hold the design; existing unit tests updated for the compact grant badge/new compact button.
- Build/Pages preparation passed with existing warnings; all 21 landing/form unit tests passed (including payload and noncompact validation). Seven local and seven deployed viewport checks passed at 320/390/820/1280/1440/1920/2560px for background, hero width, orange emphasis, CTA typography/text, field editing and scroll-to-form, with no runtime errors. API and analytics blocked; no real enquiry. Existing smaller-screen page overflow outside hero remains pre-existing.
- Scope: GitHub Pages only. No Vodien/cPanel/backend/tracking/workflow changes; staging homepage byte-identical to its prior standardized-hero release.
- Worktree `/private/tmp/appzpos-ads-hero-background`, branch `codex/ads-hero-reference-20261118`. Evidence and live screenshots: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261118-ads-hero-reference`. Fresh review URL: https://xuen00915.github.io/appzpos/lp/restaurant-pos-system-singapore/?v=hero21 .

## Google Ads hero refinements (2026-11-18)

- PR #22 merged as 34b0c27008f334da04b77acb9d2c90b5c1eba615; GitHub Pages deployment 44250893660 succeeded. Removed bottom waves and compact demo-button arrow, aligned header/hero to the shared 1240px content shell, reduced the photo’s white overlay, and restored the original complete smes-go-digital-imda-banner-horizontal.webp image.
- Angular build and 21 unit tests passed. Seven local and seven deployed viewport checks passed (320–2560px, including 1920x1200), verifying shared content alignment, loaded original banner/background, no hero overflow, arrow/wave removal and form field interaction. APIs mocked and analytics blocked; no enquiries submitted. Existing narrow-screen overflow outside the hero remains outside this change.
- GitHub Pages landing page only; no staging, production, cPanel, backend, tracking or workflow changes. Evidence: /Users/dmsyx/.codex/appzpos-staging-deployments/20261118-ads-hero-refinements.

## Google Ads background blur and brand blue (2026-11-18)

- PR #23 merged as 3309ca4925cfd3f831b15c59b290af9098dd776d; Pages run 44251623168 succeeded. User clarified that the photograph should be more blurred. Added 4px image-only blur and changed demo panel to var(--appz-blue), #0875BC, confirmed from staging via read-only computed styles. Foreground content stays sharp.
- CSS-only change; build plus seven local/seven deployed responsive checks passed, including exact blur and blue assertions. APIs mocked and analytics blocked. No staging/production writes. Evidence: /Users/dmsyx/.codex/appzpos-staging-deployments/20261118-ads-hero-blue-blur.

## Marketing startup API independence (2026-11-19 — DEPLOYED to staging)

- Applied PR #27 (`c77f6aa`) startup/API service changes to the staging source: `app.module.ts`, `config.service.ts`, canvas static `home.component.ts`, and `api.service.ts`. Marketing startup uses bundled public branding and no longer requests `GetConfigurationValues` or `GetHomePageDetails`; synchronous POST helper removed. Existing staging LeadSubmissionService retains its asynchronous SendEmail request, 20-second timeout, anti-spam guard, immediate thank-you navigation and direct measurement adapter. Do not replace these staging forms with the different GitHub Pages form implementation blindly.
- Current `/_forms-review-20261113/site.html` references `main.e72e907c4c23f65c.js` and `runtime.6d3297ed59d7ac10.js`, with lazy chunk `54.4e6898a3272c043b.js`. Existing stylesheet, all 46 inline style blocks, root fallback and routing preserved. Landing-page draft excluded from this staging compilation, as in earlier releases.
- Uploaded only the incremental package through Vodien cPanel after verifying user appzgate, dedicated IP 101.100.228.105, absolute destination `/home2/appzgate/public_html/appzpos.com`, DNS separation from production 4.193.116.8, and the current staging entry against the saved baseline. No backend, root index, .htaccess, production or analytics settings changed.
- Rollback: `/_forms-review-20261113/site.pre-api-independent-20261119.html`; prior hashed assets remain on server and prior JS/CSS plus entry are also saved locally. To restore, replace only the namespaced `site.html` with this backup after rechecking staging host/path and current state. No rebuild required.
- Build passed with CSS/bundle budget warnings. Tracking preservation/staging measurement contracts passed (3 tests). Preview and deployed runs each passed all 22 routes at 1440/390px (44 checks), with no startup AppzPOS API requests, missing visible images, horizontal overflow or page errors. Eight mocked desktop/mobile contact/embedded/popup/Chinese scenarios passed in each run, including failure/malformed response retention, duplicate prevention, one Ads/GA4 success event, immediate thank-you navigation, and refresh/direct-entry guards. Additional deployed 1440/390/820px navigation checks passed, including scrolled mobile dropdown/submenu/Escape and Blog navigation. Deployed timeout check retained details, re-enabled submit and sent no success conversion or automatic retry.
- All 27 deployed entry/package hashes match, including rollback; six production HTML hashes unchanged. APIs mocked/blocked and analytics transmission blocked. Actual email delivery and physical iOS Safari were not tested. Browser plugin unavailable; Playwright Chromium used for QA and native Chrome CUA for cPanel.
- Evidence, screenshots, package, source snapshots, rollback assets and verification scripts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261119-api-independent`.

## Separate API-domain setting (2026-11-20 — DEPLOYED to staging)

- Applied the user-supplied two-file change: `UI/src/environment.ts` adds `apiserverDomain: "https://appzpos.com"`; `CommonFunctionService.BindURL_API()` reads this setting, and `GetEnvironmentValues()` exposes it. `serverDomain` stays `https://appzpos.com` for hosted images. This is configuration separation only: no DNS, production migration or API destination change.
- Staging entry now references `main.29755e39b3f92626.js`. Its bytes differ from the prior entry only by the main bundle filename. Runtime, lazy chunk, stylesheet, inline CSS, forms, tracking, root index and .htaccess remain unchanged. Uploaded via verified Vodien cPanel appzgate / 101.100.228.105 into `/home2/appzgate/public_html/appzpos.com` after DNS and baseline-entry checks.
- Rollback: `/_forms-review-20261113/site.pre-api-domain-20261120.html`; previous main.e72e907c4c23f65c.js retained. Local rollback entry/instructions, source snapshots, package and QA evidence: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261120-api-domain`.
- Build passed with existing CSS/bundle budget warnings. Five domain-routing/tracking tests passed; routing tests execute the real service with different API/image hosts and check absolute API passthrough. Preview and deployed 44 route/viewport checks passed (22 routes, 1440/390px) with no startup AppzPOS API requests, runtime errors, missing visible images or overflow. Eight mocked form scenarios passed in both runs, including failure/malformed-response retention, duplicate prevention, one success conversion, immediate thank-you navigation and refresh/direct-entry guards. Three deployed navigation scenarios passed at 1440/390/820px.
- All 27 deployed entry/package hashes match; six production snapshots unchanged. No real enquiries or analytics events sent. Browser plugin unavailable; Playwright Chromium used for validation, native Chrome CUA for cPanel; physical Safari/email delivery not tested.
- GitHub source and regression test pushed as commit `389c89e` on `codex/separate-api-domain-20261120`, PR #29 (open, not merged at this deployment). Existing local uncommitted changes preserved.
