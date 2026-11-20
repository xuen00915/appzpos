# APPZPOS Site-wide Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the APPZPOS English marketing site and Chinese Google Ads landing page into a cohesive premium product experience while preserving the existing homepage hero, every unique wording item, every route, every conversion path, and all tracking.

**Architecture:** Keep the Angular 17 client-specific component structure and add a shared SCSS design foundation rather than introducing another UI framework. Redesign the shared header and footer first, then rebuild the homepage below the hero and modernize existing page families in place so route components, forms, metadata, and tracking integrations remain stable. Use CSS transforms, opacity, IntersectionObserver, and the existing requestAnimationFrame order-flow logic for motion, with complete reduced-motion fallbacks.

**Tech Stack:** Angular 17, TypeScript 5.3, Angular Material dialogs/forms already present, SCSS, Jasmine/Karma, Node-based Chrome DevTools Protocol regression scripts, existing Canvas assets.

**Spec:** `docs/superpowers/specs/2026-09-21-appzpos-sitewide-redesign-design.md`

## Global Constraints

- Do not visually or functionally redesign the existing homepage hero.
- Preserve every unique English and Chinese wording item verbatim; only exact duplicate desktop/mobile presentations may be consolidated.
- Preserve every current public route and route slug.
- Preserve page titles, descriptions, structured data, CTA labels, form labels, legal copy, and accessibility text.
- Preserve Google Tag Manager `GTM-N7VKTGG`, the configured Google Ads behavior, Meta Pixel, analytics hooks, form identifiers, and conversion destinations.
- Preserve all phone, WhatsApp, Messenger, social, government portal, and Learn More URLs.
- Preserve Request a Demo modal and form behavior.
- Keep the floating WhatsApp, Messenger, and Tawk contact surfaces working.
- Reuse real APPZPOS product, hardware, customer, and integration assets.
- Do not invent claims, statistics, features, customers, testimonials, integrations, awards, translations, or URLs.
- Use APPZPOS blue as the primary accent, orange selectively, a white light theme, dark navy text, and one consistent radius system.
- Use transforms and opacity for animation; do not add a heavy animation dependency.
- Respect `prefers-reduced-motion: reduce` for every new animation.
- Verify 1440px, 1280px, 1024px, 768px, 430px, and 390px widths with no horizontal overflow.
- Do not push to a remote repository without a separate user request.

## Review Focus

- **Content loss during consolidation:** every unique text node from the baseline must still be present after desktop/mobile duplicate markup is merged; Task 1 creates the manifest and Tasks 5-10 rerun it.
- **Tracking regression after shared-shell changes:** GTM, Meta Pixel, CTA URLs, form identifiers, and modal actions must remain present on English and Chinese routes; Tasks 1, 3, 9, and 11 pin this behavior.
- **Homepage hero drift:** the hero structure, copy, product image, industry controls, and request-demo behavior must remain unchanged while adjacent markup is replaced; Tasks 1 and 5 run the existing hero tests and visual regression.
- **Navigation access on keyboard and small screens:** every grouped route must remain reachable, focusable, dismissible, and free of horizontal overflow; Task 3 exercises desktop and mobile states.
- **Motion accessibility and cleanup:** all observers, timers, and animation frames must stop on destroy and reduced-motion users must receive immediate or crossfade-only states; Tasks 2, 4, 5, and 11 test both modes.

---

### Task 1: Freeze content, routes, tracking, and hero contracts

**Files:**
- Create: `UI/scripts/site-content-contract.mjs`
- Create: `UI/scripts/site-runtime-contract.mjs`
- Create: `UI/src/app/components/index/app/site-preservation.spec.ts`
- Modify: `UI/package.json`
- Read only: `UI/src/index/canvas/index.html`
- Read only: `UI/src/environment.ts`
- Read only: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app-routing.module.ts`

**Interfaces:**
- Consumes: existing component HTML, routes, environment tag IDs, and preview server at `APPZPOS_PREVIEW_URL`.
- Produces: `npm run test:site-content`, `npm run test:site-runtime`, and checked-in exact wording, route, CTA, form, metadata, and tracking expectations.

- [ ] **Step 1: Write the failing preservation test**

~~~ts
it('keeps the existing homepage hero contract', () => {
  const host = fixture.nativeElement as HTMLElement;
  expect(host.querySelector('.appzpos-product-hero h1')?.textContent?.replace(/\s+/g, ' ').trim())
    .toBe('All-In-One POS System in Singapore with PSG Grant');
  expect(host.querySelector('.appzpos-product-hero__machine')).not.toBeNull();
  expect(host.querySelectorAll('.appzpos-product-hero [role="tab"]').length).toBe(4);
});

it('keeps request demo and WhatsApp conversion destinations', () => {
  const host = fixture.nativeElement as HTMLElement;
  expect(Array.from(host.querySelectorAll('button')).some((button) =>
    button.textContent?.trim() === 'Request a Demo')).toBeTrue();
  expect(host.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/6583109631"]')).not.toBeNull();
});
~~~

Create `site-content-contract.mjs` to parse all client-specific HTML files, normalize whitespace, and assert a checked-in array of unique headings, paragraphs, list items, button labels, form labels, metadata strings, and all `href` values. Ignore exact duplicate values but never ignore a unique string.

- [ ] **Step 2: Run the new tests and confirm the expected failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/site-preservation.spec.ts'
node scripts/site-content-contract.mjs
~~~

Expected: the Jasmine test fails until its client-specific declarations/providers are wired, and the content contract exits non-zero until the baseline arrays are populated.

- [ ] **Step 3: Populate the baseline and package commands**

Add these scripts:

~~~json
{
  "test:site-content": "node scripts/site-content-contract.mjs",
  "test:site-runtime": "node scripts/site-runtime-contract.mjs"
}
~~~

The runtime contract visits every route from `custom-app-routing.module.ts` and records route, title, description, overflow, GTM, Meta Pixel, WhatsApp links, demo actions, console errors, and failed requests. Store exact pre-redesign titles, descriptions, CTA destinations, form control names, and route list as immutable expectations.

- [ ] **Step 4: Run the preservation baseline**

~~~bash
cd UI
npm run test:site-content
npm run test -- --watch=false --include='src/app/components/index/app/home-hero.spec.ts' --include='src/app/components/index/app/site-preservation.spec.ts'
npm run build
~~~

Expected: all commands pass before visual redesign work begins.

- [ ] **Step 5: Commit**

~~~bash
git add UI/package.json UI/scripts/site-content-contract.mjs UI/scripts/site-runtime-contract.mjs UI/src/app/components/index/app/site-preservation.spec.ts
git commit -m "test: protect APPZPOS content and conversion contracts"
~~~

---

### Task 2: Add the shared APPZPOS design and motion foundation

**Files:**
- Create: `UI/src/styles/_appzpos-design-system.scss`
- Create: `UI/src/styles/_appzpos-marketing-pages.scss`
- Create: `UI/src/styles/_appzpos-motion.scss`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/marketing-reveal/marketing-reveal.directive.ts`
- Create: `UI/src/app/components/index/app/marketing-reveal.directive.spec.ts`
- Modify: `UI/src/custom-theme.scss`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts`

**Interfaces:**
- Consumes: Angular `ElementRef`, `IntersectionObserver`, and `window.matchMedia`.
- Produces: `[appMarketingReveal]`, `.appzpos-site`, design tokens, and reusable section/button/media/form classes.

- [ ] **Step 1: Write failing directive tests**

~~~ts
it('reveals once when intersecting', () => {
  observer.trigger(true);
  expect(host.classList.contains('is-revealed')).toBeTrue();
  expect(observer.disconnect).toHaveBeenCalled();
});

it('reveals immediately for reduced motion', () => {
  setReducedMotion(true);
  fixture.detectChanges();
  expect(host.classList.contains('is-revealed')).toBeTrue();
});
~~~

- [ ] **Step 2: Run the test and verify failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/marketing-reveal.directive.spec.ts'
~~~

Expected: FAIL because `MarketingRevealDirective` does not exist.

- [ ] **Step 3: Implement the directive and tokens**

~~~ts
@Directive({ selector: '[appMarketingReveal]' })
export class MarketingRevealDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      this.elementRef.nativeElement.classList.add('is-revealed');
      return;
    }
    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.elementRef.nativeElement.classList.add('is-revealed');
      this.observer?.disconnect();
    }, { threshold: .15 });
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
~~~

Define exact tokens for navy text, blue accent, orange accent, cool-neutral surfaces, container widths, spacing, medium card radius, pill button radius, cool-tinted shadows, focus ring, and motion timing. Import the partials after the existing hero and order-flow partials so the hero remains isolated.

- [ ] **Step 4: Run tests and build**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/marketing-reveal.directive.spec.ts'
npm run build
~~~

Expected: PASS with no component-style budget error.

- [ ] **Step 5: Commit**

~~~bash
git add UI/src/styles UI/src/custom-theme.scss UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/marketing-reveal UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts UI/src/app/components/index/app/marketing-reveal.directive.spec.ts
git commit -m "feat: add APPZPOS marketing design foundation"
~~~

---

### Task 3: Replace the shared header and footer without losing destinations

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-header/custom-header.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-footer/custom-footer.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-footer/custom-footer.component.css`
- Create: `UI/src/app/components/index/app/marketing-shell.spec.ts`

**Interfaces:**
- Produces: `openMenu: 'solutions' | 'industries' | 'resources' | null`, `mobileMenuOpen: boolean`, `toggleMenu()`, `closeMenus()`, and the approved grouped navigation.

- [ ] **Step 1: Write failing navigation tests**

~~~ts
expect(topLevelLabels()).toEqual([
  'Solutions', 'Industries', 'PSG Grant', 'Resources', 'POS餐饮系统', 'Request a Demo'
]);
expect(allHrefs()).toContain('/cloud-pos-point-of-sales-system');
expect(allHrefs()).toContain('/f&b-restaurant-cloud-pos-system');
expect(allHrefs()).toContain('/cn-f&b-restaurant-cloud-pos-system');
expect(allHrefs()).toContain('/point-of-sales-demo-quotation');
~~~

Also test Escape dismissal, `aria-expanded`, mobile accordion state, focus return, and every existing footer contact/social link.

- [ ] **Step 2: Run the test and verify failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/marketing-shell.spec.ts'
~~~

Expected: FAIL because the current header exposes nine top-level items and has no accessible state management.

- [ ] **Step 3: Implement grouped desktop and mobile navigation**

Use buttons for menu triggers and real anchors for destinations. Keep the existing `POS餐饮系统` wording visible at top level. Make Request a Demo point to the existing `/point-of-sales-demo-quotation` destination, while preserving the existing `CONTACT US` wording within Resources and the footer. Use opacity and `translateY` for menu reveal, with transitions disabled under reduced motion.

- [ ] **Step 4: Rebuild the footer as the complete directory**

Group existing destinations under Solutions, Industries, Resources, and Contact. Preserve all original contact wording and social URLs. Use one responsive markup tree.

- [ ] **Step 5: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/marketing-shell.spec.ts'
npm run test:site-content
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-header UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-footer UI/src/app/components/index/app/marketing-shell.spec.ts
git commit -m "feat: simplify APPZPOS navigation and footer"
~~~

Expected: all routes and contact destinations remain available.

---

### Task 4: Refine the connected-order interaction

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.model.ts`
- Modify: `UI/src/styles/_appzpos-order-flow.scss`
- Modify: `UI/src/app/components/index/app/home-order-flow.component.spec.ts`
- Modify: `UI/src/app/components/index/app/home-order-flow.model.spec.ts`
- Modify: `UI/scripts/order-flow-regression.mjs`

**Interfaces:**
- Consumes: `ORDER_FLOW_STEPS`, `ORDER_FLOW_BREAKPOINTS`, scroll progress, and numbered control clicks.
- Produces: the same seven exact content steps, a shorter scroll wrapper, direct step navigation, animated route completion, caption crossfade, and skip behavior.

- [ ] **Step 1: Update tests for the premium scene**

~~~ts
expect(host.querySelectorAll('[data-order-channel]').length).toBe(4);
expect(host.querySelector('[data-queue-core]')).not.toBeNull();
expect(host.querySelector('[data-kds-core]')).not.toBeNull();
expect(host.querySelector('[data-order-hub-core]')).not.toBeNull();
expect(host.querySelectorAll('.appzpos-order-flow__step-button').length).toBe(7);
expect(host.querySelector('.appzpos-order-flow__skip')).not.toBeNull();
~~~

Keep all exact bullet assertions. Test click navigation, `aria-current`, caption switching, skip destination, observer cleanup, and complete reduced-motion content.

- [ ] **Step 2: Run tests and confirm failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/home-order-flow.component.spec.ts' --include='src/app/components/index/app/home-order-flow.model.spec.ts'
~~~

- [ ] **Step 3: Implement the refined scene**

Retain pure state functions and requestAnimationFrame throttling. Use layered route rails, illuminated nodes, compact existing product imagery, and a wrapper between approximately 360vh and 480vh. Caption changes use a short fade. All travel remains tied to progress and uses transform/opacity only.

- [ ] **Step 4: Update runtime checks**

At all six widths, assert seven controls, exact content, four converging routes, Queue to KDS to Order Hub progress, click navigation, skip action, no collisions, no overflow, and the complete reduced-motion list.

- [ ] **Step 5: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/home-order-flow.component.spec.ts' --include='src/app/components/index/app/home-order-flow.model.spec.ts'
node scripts/order-flow-regression.mjs
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow UI/src/styles/_appzpos-order-flow.scss UI/src/app/components/index/app/home-order-flow.component.spec.ts UI/src/app/components/index/app/home-order-flow.model.spec.ts UI/scripts/order-flow-regression.mjs
git commit -m "feat: refine APPZPOS connected order journey"
~~~

---

### Task 5: Rebuild the homepage below the hero

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.css`
- Create: `UI/src/app/components/index/app/homepage-content.spec.ts`
- Create: `UI/scripts/homepage-redesign-regression.mjs`

**Interfaces:**
- Consumes: existing homepage copy, assets, links, `BindURL_Image()`, `openDialog()`, and `appMarketingReveal`.
- Produces: `activeSolutionId`, `activeBusinessId`, `selectSolution()`, `selectBusiness()`, and approved sections after `<app-home-order-flow>`.

- [ ] **Step 1: Write failing homepage structure tests**

~~~ts
expect(sectionIds()).toEqual([
  'connected-order-journey',
  'solutions',
  'industries',
  'hardware-integrations',
  'psg-support',
  'customer-proof',
  'request-demo'
]);
expect(host.querySelector('.appzpos-product-hero')?.nextElementSibling?.tagName.toLowerCase())
  .toBe('app-home-order-flow');
~~~

Test every legacy unique homepage string from Task 1, every Learn More URL, existing customer proof, Request a Demo, WhatsApp, selector ARIA, and keyboard behavior.

- [ ] **Step 2: Run tests and confirm the new section contract fails while hero tests pass**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/homepage-content.spec.ts' --include='src/app/components/index/app/home-hero.spec.ts'
~~~

- [ ] **Step 3: Consolidate solution content**

Create one semantic solution selector with the existing seven labels and one active content region. Put every unique legacy feature line in the DOM under its matching solution. Use existing images and unchanged Learn More destinations. Change state through `activeSolutionId` using a short image/content crossfade. Reduced motion changes immediately.

- [ ] **Step 4: Implement remaining approved sections**

Build the industry selector, hardware/integrations composition, light PSG block, existing customer proof, and final conversion section. Keep every unique wording item and destination. The final demo button still calls `openDialog()`.

- [ ] **Step 5: Add approved interactions**

Use product-image mask/crossfades, industry content crossfades, one-time section reveals, a pointer-only maximum 4px hardware depth response, CTA press feedback, and arrow translation. Do not add autoplay, scroll hijacking, or decorative loops.

- [ ] **Step 6: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/homepage-content.spec.ts' --include='src/app/components/index/app/home-hero.spec.ts'
npm run test:site-content
node scripts/hero-screen-fit-regression.mjs
node scripts/homepage-redesign-regression.mjs
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index UI/src/app/components/index/app/homepage-content.spec.ts UI/scripts/homepage-redesign-regression.mjs
git commit -m "feat: redesign APPZPOS homepage below hero"
~~~

Expected: the hero remains unchanged and all required widths pass.

---

### Task 6: Redesign all seven solution pages

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cloud-pos-point-of-sales-system/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-online-ordering-website/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-emenu-qr-code-ordering-system/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/self-order-kiosk-restaurant/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-kitchen-display-system/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-queue-number-display-system/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-delivery-integration/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-solutions/*`
- Create: `UI/src/app/components/index/app/solution-pages.spec.ts`
- Create: `UI/scripts/solution-pages-regression.mjs`

**Interfaces:**
- Consumes: existing classes, metadata, `BindURL_Image()`, `openDialog()`, and exact page content.
- Produces: shared `.appzpos-detail-page` structure with page-specific real-asset compositions and unchanged component APIs.

- [ ] **Step 1: Write failing page-family tests**

For every solution component and the `/custom-solutions` overview, assert one semantic main, one H1, a product media region, Request a Demo, every unique baseline string, each image filename, and every original internal/external URL.

- [ ] **Step 2: Run and confirm failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/solution-pages.spec.ts'
~~~

- [ ] **Step 3: Convert each page to the shared structure**

Use intro, capabilities, workflow, related-solutions, and conversion sections. Move every unique text node without editing it. Keep current images and CTA destinations. Vary asset placement by product while retaining one design system. Treat `/custom-solutions` as the overview entry point and retain its existing WhatsApp and floating contact behavior.

- [ ] **Step 4: Add restrained interaction**

Use `appMarketingReveal` for product media and grouped capabilities. Use native `details` only for long secondary groups, with important content expanded. Add selection crossfades only where selectable states already exist. Keep all content in the DOM.

- [ ] **Step 5: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/solution-pages.spec.ts'
npm run test:site-content
node scripts/solution-pages-regression.mjs
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components UI/src/app/components/index/app/solution-pages.spec.ts UI/scripts/solution-pages-regression.mjs
git commit -m "feat: redesign APPZPOS solution pages"
~~~

Before committing, stage only the seven named solution directories, `custom-solutions`, the test, and the regression script; do not stage unrelated component changes.

---

### Task 7: Redesign the Restaurant, Retail, and Salon pages

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f&b-restaurant-cloud-pos-system/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/retail-store-cloud-pos-system/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/salon-cloud-pos-system/*`
- Create: `UI/src/app/components/index/app/industry-pages.spec.ts`
- Create: `UI/scripts/industry-pages-regression.mjs`

**Interfaces:**
- Consumes: existing wording, images, metadata, routes, demo action, and WhatsApp destinations.
- Produces: common `.appzpos-industry-page` architecture with page-specific product compositions.

- [ ] **Step 1: Write failing tests**

Assert one H1, current metadata, every unique text, every image filename, every solution link, demo and WhatsApp actions, and no duplicated `webview`/`mobile_view` content trees.

- [ ] **Step 2: Run and confirm failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/industry-pages.spec.ts'
~~~

- [ ] **Step 3: Implement each industry story**

Use intro, operations, relevant solutions, existing proof, and conversion sections. Keep one responsive semantic tree and all copy verbatim. Avoid three cloned layouts by varying real image placement and module presentation.

- [ ] **Step 4: Add interactions**

Use one-time section reveals, accessible disclosure for long content, and full focus/touch states. No autoplay and no hover-only information.

- [ ] **Step 5: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/industry-pages.spec.ts'
npm run test:site-content
node scripts/industry-pages-regression.mjs
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/f\&b-restaurant-cloud-pos-system UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/retail-store-cloud-pos-system UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/salon-cloud-pos-system UI/src/app/components/index/app/industry-pages.spec.ts UI/scripts/industry-pages-regression.mjs
git commit -m "feat: redesign APPZPOS industry pages"
~~~

---

### Task 8: Redesign Hardware, Features, Integrations, PSG, Contact, and Blog

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-hardware-machine-receipt-printer/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-features-crm-payment-gateway/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-solutions-partner-integrations/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/psg-pos-system-grant-singapore/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/point-of-sales-demo-quotation/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/blogs/blog-main-page/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/blogs/blog-bcrs/*`
- Create: `UI/src/app/components/index/app/supporting-pages.spec.ts`
- Create: `UI/scripts/supporting-pages-regression.mjs`

**Interfaces:**
- Consumes: current logic, reactive forms, metadata, links, assets, and exact wording.
- Produces: page-appropriate semantic layouts using the shared system without changing business logic.

- [ ] **Step 1: Write failing tests**

For each page, assert metadata, unique baseline text, links, images, one main, one H1, and existing conversion actions. For Contact, pin exact form control names, validators, submit handler, phone, WhatsApp, Facebook, and Instagram. For PSG, pin the Business Grants Portal URL and all grant text. For Blog, pin article URLs, titles, dates, content, and metadata.

- [ ] **Step 2: Run and confirm failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/supporting-pages.spec.ts'
~~~

- [ ] **Step 3: Redesign Hardware, Features, and Integrations**

Use product-led media for hardware, structured capability groups for Features, and clean partner relationships for Integrations. Preserve all specifications, partner names, wording, and links. Add pointer-only depth to one large hardware visual with static coarse-pointer and reduced-motion fallbacks.

- [ ] **Step 4: Redesign PSG and Contact**

Keep PSG light and trust-focused. Use accessible disclosure for long secondary explanations without removing copy. Restyle the form in place while preserving `FormGroup` controls, validators, methods, and analytics hooks. Provide visible focus, loading, error, and success states from existing state.

- [ ] **Step 5: Redesign Blog**

Create a clean editorial listing and article layout using the shared sans-serif system. Preserve titles, dates, text, links, metadata, and images. Add no fabricated author, category, or reading time.

- [ ] **Step 6: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/supporting-pages.spec.ts'
npm run test:site-content
node scripts/supporting-pages-regression.mjs
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-hardware-machine-receipt-printer UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-features-crm-payment-gateway UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-solutions-partner-integrations UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/psg-pos-system-grant-singapore UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/point-of-sales-demo-quotation UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/blogs UI/src/app/components/index/app/supporting-pages.spec.ts UI/scripts/supporting-pages-regression.mjs
git commit -m "feat: redesign APPZPOS supporting pages"
~~~

---

### Task 9: Redesign the Chinese Google Ads landing page

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.css`
- Modify only for interaction state: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-custom-request-demo/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-modal-request-demo/*`
- Create: `UI/src/app/components/index/app/chinese-landing-page.spec.ts`
- Create: `UI/scripts/chinese-landing-regression.mjs`

**Interfaces:**
- Consumes: `CustomHomeCNComponent.openDialog()`, `CNModalRequestDemoComponent`, exact Chinese metadata and copy, and current contact destinations.
- Produces: a focused Chinese landing page with unchanged conversions and tracking.

- [ ] **Step 1: Write failing landing-page tests**

~~~ts
expect(title.setTitle).toHaveBeenCalledWith('APPZPOS云端智能POS餐饮系统 收银系统 | 新加坡餐厅运营首选');
expect(meta.updateTag).toHaveBeenCalledWith(jasmine.objectContaining({
  name: 'description',
  content: jasmine.stringContaining('高达50%政府津贴折扣')
}));
expect(host.textContent).toContain('预约免费演示');
expect(host.textContent).toContain('WhatsApp联系我们');
expect(host.querySelector('a[href^="https://wa.me/6583109631"]')).not.toBeNull();
~~~

Also pin every unique Chinese string, all links, exact form control names, dialog opening, and an above-the-fold primary CTA at 390px and 430px.

- [ ] **Step 2: Run and confirm failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/chinese-landing-page.spec.ts'
~~~

- [ ] **Step 3: Implement one responsive conversion layout**

Use intro, solutions, benefits, grant, and conversion sections. Preserve every unique Chinese string exactly. Consolidate only duplicate desktop/mobile presentations. Keep current product imagery, grant statement, modal action, phone, and WhatsApp. Do not add distracting navigation within the conversion body.

- [ ] **Step 4: Add conversion-safe motion**

Animate the product visual with a 500ms opacity and maximum 16px vertical entrance after the CTA is rendered. Use short reveals below the fold. Reduced motion renders immediately. No autoplay or pinned sequence may delay contact actions.

- [ ] **Step 5: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/chinese-landing-page.spec.ts'
npm run test:site-content
node scripts/chinese-landing-regression.mjs
npm run test:site-runtime
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f\&b-restaurant-cloud-pos-system UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-custom-request-demo UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-modal-request-demo UI/src/app/components/index/app/chinese-landing-page.spec.ts UI/scripts/chinese-landing-regression.mjs
git commit -m "feat: redesign APPZPOS Chinese ads landing page"
~~~

---

### Task 10: Unify demo forms and floating contact surfaces

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/*`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/modal-request-demo/*`
- Modify only for styling and semantic wrappers: `UI/src/index/canvas/index.html`
- Create: `UI/src/app/components/index/app/conversion-surfaces.spec.ts`

**Interfaces:**
- Consumes: existing reactive form controls, validators, submission methods, dialogs, and WhatsApp/Messenger/Tawk integrations.
- Produces: consistent accessible presentation without changing identifiers, endpoints, or hooks.

- [ ] **Step 1: Write failing conversion-surface tests**

Pin exact form controls and validators, labels, error regions, submit wording, dialog close behavior, WhatsApp/Messenger URLs, Tawk source, and no mobile overlap between contact widgets and a focused form field.

- [ ] **Step 2: Run and confirm failure**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/conversion-surfaces.spec.ts'
~~~

- [ ] **Step 3: Restyle forms without changing logic**

Add explicit label associations, `aria-describedby` for existing validation messages, clear focus, and stable loading/error/success containers. Keep every string, form control name, validator, submit method, and analytics hook.

- [ ] **Step 4: Reposition contact surfaces**

Keep WhatsApp, Messenger, bottom WhatsApp prompt, and Tawk working. Use safe-area-aware offsets and reduce visual chrome while a modal or keyboard-sized viewport is active. Do not change destinations.

- [ ] **Step 5: Verify and commit**

~~~bash
cd UI
npm run test -- --watch=false --include='src/app/components/index/app/conversion-surfaces.spec.ts'
npm run test:site-content
npm run test:site-runtime
npm run build
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/modal-request-demo UI/src/index/canvas/index.html UI/src/app/components/index/app/conversion-surfaces.spec.ts
git commit -m "feat: refine APPZPOS conversion surfaces"
~~~

---

### Task 11: Run complete site verification and design-taste pre-flight

**Files:**
- Create: `UI/scripts/full-site-responsive-regression.mjs`
- Create: `docs/superpowers/verification/2026-09-21-appzpos-sitewide-redesign.md`
- Modify only for verified defects: files owned by Tasks 2-10

**Interfaces:**
- Consumes: route list, all regressions, preview server, approved spec, and preservation baseline.
- Produces: final evidence for routes, widths, console, assets, tracking, wording, accessibility, motion, and screenshots.

- [ ] **Step 1: Write the full-site runner**

For every public route and width, collect route, title, description, main/H1 counts, horizontal overflow, missing images, console errors, failed requests, GTM, Meta Pixel, demo/WhatsApp counts, visible header items, and focused-control visibility. Run a second reduced-motion pass and assert animations are removed or reduced to crossfades.

- [ ] **Step 2: Run all unit and source contracts**

~~~bash
cd UI
npm run test -- --watch=false
npm run test:site-content
npm run build
~~~

- [ ] **Step 3: Run browser regressions**

~~~bash
cd UI
node scripts/hero-screen-fit-regression.mjs
node scripts/order-flow-regression.mjs
node scripts/homepage-redesign-regression.mjs
node scripts/solution-pages-regression.mjs
node scripts/industry-pages-regression.mjs
node scripts/supporting-pages-regression.mjs
node scripts/chinese-landing-regression.mjs
node scripts/full-site-responsive-regression.mjs
~~~

- [ ] **Step 4: Perform manual interaction checks**

Check keyboard navigation, Escape dismissal, focus visibility, selectors, disclosures, dialogs, form validation, contact widgets, skip controls, reduced motion, and touch. Confirm English and Chinese content manifests have no missing entries.

- [ ] **Step 5: Run the design-taste pre-flight**

Document: one light theme, one brand accent system, one radius system, no repeated generic card grids, no unnecessary dark flips, no decorative infinite movement, no invented content, no new visible em dashes, real APPZPOS images, one-line desktop header, CTA contrast/no wrapping, purposeful motion, and reduced-motion safety.

- [ ] **Step 6: Record evidence and commit**

~~~bash
git add UI/scripts/full-site-responsive-regression.mjs docs/superpowers/verification/2026-09-21-appzpos-sitewide-redesign.md
git commit -m "test: verify APPZPOS sitewide redesign"
git status --short
git log --oneline -12
~~~

Expected: only pre-existing user-owned untracked files remain, all work is committed locally, and nothing has been pushed.
