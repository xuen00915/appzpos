# APPZPOS Structural Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the APPZPOS homepage below its unchanged hero and restructure every public marketing route into a responsive connected-product story that no longer resembles the legacy layout.

**Architecture:** Keep the existing Angular routing, services, forms, tracking initialization and homepage hero component logic. Split the legacy homepage body into focused presentation components backed by typed content arrays, then apply shared semantic layout primitives to the product, industry, catalogue, PSG, contact and Chinese landing routes. Preserve copy through a global visible-text manifest and preserve behavior through route, tracking, CTA and responsive browser contracts.

**Tech Stack:** Angular 17, TypeScript, Angular templates, component CSS, shared SCSS, Jasmine/Karma, Chrome DevTools Protocol regression scripts, native CSS transforms/opacity and IntersectionObserver.

**Spec:** `docs/superpowers/specs/2026-09-21-appzpos-structural-redesign-design.md`

## Global Constraints

- Keep the current homepage POS-machine hero unchanged, including copy, assets, industry switching, links and animation behavior.
- Preserve every unique English and Chinese product phrase. Exact duplicate desktop/mobile presentations may be consolidated.
- Preserve all 19 public routes, route destinations, metadata, real APPZPOS assets, forms and analytics hooks.
- Preserve Google Tag Manager, Google Ads-related tracking, Meta Pixel, WhatsApp, Messenger, Tawk and phone links.
- Do not invent product features, statistics, testimonials, customer names, URLs or grant claims.
- Add no heavy animation dependency. Animate only transform and opacity and support `prefers-reduced-motion: reduce`.
- Verify desktop at 1440 and 1280, laptop at 1024, tablet at 768 and mobile at 430 and 390 pixels.
- Do not push to a remote repository unless the user separately requests it.

## Review Focus

- Moving text from the legacy homepage into child components must not drop unique wording or silently change punctuation; Task 1 adds a global phrase manifest and Task 5 exercises it after decomposition.
- At 1024px and below, the reduced header and long product labels must remain usable without wrapping the desktop navigation or creating horizontal overflow; Tasks 3 and 11 test this.
- Remote APPZPOS images may load slowly or fail; Tasks 4-10 reserve dimensions and Task 11 checks layout stability before and after image completion.
- Floating WhatsApp, Messenger and chat controls must not cover interactive selectors, skip controls or form submission on 430px and 390px screens; Tasks 4, 10 and 11 include collision checks.
- Reduced-motion users must receive static content without sticky-scroll trapping, hidden panels or continuous animation; Tasks 4, 5 and 11 test the reduced-motion rendering path.

---

### Task 1: Replace file-bound copy hashes with a structural preservation manifest

**Files:**
- Create: `UI/scripts/lib/visible-text.mjs`
- Create: `UI/scripts/site-visible-copy.json`
- Modify: `UI/scripts/site-content-contract.mjs`
- Test: `UI/src/app/components/index/app/site-preservation.spec.ts`

**Interfaces:**
- Produces: `extractVisibleText(source: string): string[]` and `collectVisibleText(root: string): string[]`.
- Produces: `site-visible-copy.json` containing the sorted unique visible phrases that may move between components but may not disappear.
- Consumes: current component templates before any structural rewrite.

- [ ] **Step 1: Write the failing preservation test**

Add a source-contract assertion that expects the new global manifest and hero-specific protection:

```ts
it('protects the homepage hero while allowing body copy to move into child components', () => {
  const contract = readFileSync(resolve(uiRoot, 'scripts/site-content-contract.mjs'), 'utf8');
  expect(contract).toContain('site-visible-copy.json');
  expect(contract).toContain('appzpos-product-hero');
  expect(contract).toContain('collectVisibleText');
});
```

- [ ] **Step 2: Run the focused spec and verify RED**

Run:

```bash
cd UI
node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/site-preservation.spec.ts'
```

Expected: FAIL because the current contract contains per-template hashes and no global copy manifest.

- [ ] **Step 3: Add reusable visible-text extraction**

Implement `visible-text.mjs` with the same entity normalization used by the existing contract:

```js
export function extractVisibleText(source) {
  return [...new Set(source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .split(/\n+/)
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter((value) => value && !/^\{\{.*\}\}$/.test(value)))];
}
```

Use `readdirSync(componentRoot, { recursive: true })` to collect `.component.html` files, excluding header/footer only where their text is intentionally governed by navigation tests. Snapshot the sorted phrases into `site-visible-copy.json`. Keep a separate SHA-256 hash of the complete `.appzpos-product-hero` source range so the hero cannot change.

- [ ] **Step 4: Verify the contract is GREEN**

Run:

```bash
cd UI
node scripts/site-content-contract.mjs
node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/site-preservation.spec.ts'
```

Expected: manifest contract PASS and focused Jasmine assertions PASS.

- [ ] **Step 5: Commit**

```bash
git add UI/scripts/lib/visible-text.mjs UI/scripts/site-visible-copy.json UI/scripts/site-content-contract.mjs UI/src/app/components/index/app/site-preservation.spec.ts
git commit -m "test: preserve APPZPOS copy across structural layouts"
```

---

### Task 2: Establish the structural design system and responsive primitives

**Files:**
- Modify: `UI/src/styles/_appzpos-design-system.scss`
- Replace: `UI/src/styles/_appzpos-marketing-pages.scss`
- Modify: `UI/src/styles/_appzpos-motion.scss`
- Modify: `UI/src/custom-theme.scss`
- Modify: `UI/src/index.html`
- Test: `UI/src/app/components/index/app/marketing-shell.spec.ts`

**Interfaces:**
- Produces: `.appz-page`, `.appz-section`, `.appz-split`, `.appz-media-stage`, `.appz-module-nav`, `.appz-proof-rail`, `.appz-conversion-panel`.
- Produces: responsive tokens `--appz-gutter`, `--appz-section-space`, `--appz-content-width`, `--appz-reading-width`.
- Consumes: existing APPZPOS blue, orange, navy and white brand colors.

- [ ] **Step 1: Add failing structural-class tests**

```ts
it('defines the structural layout primitives and responsive breakpoints', () => {
  const styles = readFileSync(resolve(uiRoot, 'src/styles/_appzpos-marketing-pages.scss'), 'utf8');
  for (const selector of ['.appz-page', '.appz-section', '.appz-split', '.appz-media-stage', '.appz-proof-rail']) {
    expect(styles).toContain(selector);
  }
  expect(styles).toContain('@media (max-width: 1279px)');
  expect(styles).toContain('@media (max-width: 1023px)');
  expect(styles).toContain('@media (max-width: 767px)');
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run the `marketing-shell.spec.ts` include command. Expected: FAIL because the structural primitives do not exist.

- [ ] **Step 3: Implement tokens and primitives**

Use Manrope with a resilient fallback stack and replace legacy `#content` blanket card styling with opt-in semantic classes:

```scss
:root {
  --appz-font: "Manrope", "Avenir Next", Arial, sans-serif;
  --appz-gutter: clamp(20px, 4vw, 64px);
  --appz-section-space: clamp(80px, 11vw, 168px);
  --appz-content-width: 1320px;
  --appz-reading-width: 65ch;
  --appz-radius-surface: 16px;
  --appz-radius-control: 9px;
}

.appz-section {
  padding-block: var(--appz-section-space);
}

.appz-split {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, .92fr);
  gap: clamp(48px, 7vw, 112px);
  align-items: center;
}

@media (max-width: 1023px) {
  .appz-split { grid-template-columns: 1fr; gap: 40px; }
}
```

Import Manrope in the existing HTML/font-loading path only if no equivalent local font is present. Keep typography visible with system fallbacks while the webfont loads.

- [ ] **Step 4: Add motion and reduced-motion rules**

```scss
@media (prefers-reduced-motion: no-preference) {
  [appMarketingReveal] {
    clip-path: inset(0 0 12% 0);
    opacity: 0;
    transform: translate3d(0, 28px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  [appMarketingReveal] {
    clip-path: none;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 5: Run tests and build**

Run the focused spec, `node scripts/site-content-contract.mjs`, and production build. Expected: PASS with only recorded bundle-budget warnings.

- [ ] **Step 6: Commit**

```bash
git add UI/src/styles UI/src/custom-theme.scss UI/src/app/components/index/app/marketing-shell.spec.ts
git commit -m "feat: establish structural APPZPOS design system"
```

---

### Task 3: Keep the hero locked and make the navigation responsive to the new layouts

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.css`
- Modify: `UI/src/app/components/index/app/marketing-shell.spec.ts`
- Test: `UI/scripts/hero-screen-fit-regression.mjs`

**Interfaces:**
- Produces: the same grouped navigation labels and destinations already approved.
- Consumes: unchanged homepage hero DOM and the existing `mobileMenuOpen` / `openMenu` APIs.

- [ ] **Step 1: Add failing responsive-navigation assertions**

Add CDP measurements that require a one-line desktop nav at 1280 and a visible 44px mobile toggle at 1024, 768, 430 and 390:

```js
if (width >= 1280 && header.scrollHeight > 80) failures.push(`${width}px: desktop nav wraps`);
if (width <= 1024 && (toggle.width < 44 || toggle.height < 44)) failures.push(`${width}px: mobile toggle is too small`);
```

- [ ] **Step 2: Run the hero regression and verify RED if the 1024 state is incorrect**

Use the existing CDP command with `APPZPOS_PREVIEW_URL`. Expected: the new assertion identifies any breakpoint mismatch before CSS changes.

- [ ] **Step 3: Implement breakpoint-safe navigation**

Keep the existing grouped menu content, CTA and `POS餐饮系统` link. Change only sizing and breakpoint behavior so navigation switches to the accessible overlay at 1100px, prevents page scrolling while open, and closes on route click.

- [ ] **Step 4: Verify hero source and responsive regression**

Run the hero regression at all six widths and the content contract. Expected: hero hash unchanged, no overflow, tracking present, toggle visible and desktop navigation one line.

- [ ] **Step 5: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header UI/scripts/hero-screen-fit-regression.mjs UI/src/app/components/index/app/marketing-shell.spec.ts
git commit -m "fix: align APPZPOS navigation with structural layouts"
```

---

### Task 4: Reframe the connected ordering journey as the homepage spine

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.ts`
- Modify: `UI/src/styles/_appzpos-order-flow.scss`
- Modify: `UI/scripts/order-flow-regression.mjs`
- Test: `UI/src/app/components/index/app/home-order-flow.component.spec.ts`
- Test: `UI/src/app/components/index/app/home-order-flow.model.spec.ts`

**Interfaces:**
- Consumes: `ORDER_FLOW_STEPS`, `ORDER_FLOW_BREAKPOINTS`, `createOrderFlowSceneState()` and `goToStep(index)`.
- Produces: the same seven exact step titles/bullets, clickable step controls, skip action and reduced-motion static list.

- [ ] **Step 1: Add failing layout and collision assertions**

Require a compact scroll distance, a scene heading, seven buttons, four channel hooks, three core hooks and no overlap with floating widgets:

```ts
expect(host.querySelectorAll('[data-order-channel]').length).toBe(4);
expect(host.querySelectorAll('.appzpos-order-flow__step-button').length).toBe(7);
expect(host.querySelector('[data-order-hub-core]')).not.toBeNull();
expect(host.querySelector('.appzpos-order-flow__skip')).not.toBeNull();
```

- [ ] **Step 2: Run the focused model/component suite and verify RED**

Expected: new structural assertion fails before the new scene layout is implemented.

- [ ] **Step 3: Implement the shorter converging-lane presentation**

Retain the current SVG geometry and state model, but restructure the surrounding stage so the progress rail, scene and caption feel like one product story. Set approximately `360vh` desktop, `330vh` laptop/tablet and `300vh` mobile, subject to viewport regression proving every breakpoint remains reachable.

- [ ] **Step 4: Implement explicit mobile and reduced-motion behavior**

At below 768px, use a compact SVG above the caption, horizontal step controls and a skip button positioned above chat widgets. For reduced motion, render the existing static seven-step list without sticky positioning.

- [ ] **Step 5: Run focused tests and browser regression**

Expected: all component/model tests PASS; order-flow regression passes six widths; reduced-motion reports seven static steps and no animated scroll wrapper.

- [ ] **Step 6: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow UI/src/styles/_appzpos-order-flow.scss UI/scripts/order-flow-regression.mjs UI/src/app/components/index/app/home-order-flow*.spec.ts
git commit -m "feat: make connected ordering the homepage story spine"
```

---

### Task 5: Decompose the homepage into the selected connected-product architecture

**Files:**
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-product-suite/home-product-suite.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-product-suite/home-product-suite.component.html`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-product-suite/home-product-suite.component.css`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.html`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.css`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.html`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.css`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof/home-proof.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof/home-proof.component.html`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof/home-proof.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts`
- Create: `UI/src/app/components/index/app/home-structural-layout.spec.ts`

**Interfaces:**
- Produces: `HomeProductModule`, `HomeIndustryStory`, `HomeEcosystemChapter`, `HomeCustomerProof` typed view models.
- Produces selectors: `app-home-product-suite`, `app-home-industries`, `app-home-ecosystem`, `app-home-proof`.
- Consumes: `CommonFunctionService.BindURL_Image`, existing route URLs, existing homepage copy and images, `appMarketingReveal`.

- [ ] **Step 1: Write the failing homepage architecture test**

```ts
it('renders the selected connected-product section order after the locked hero', () => {
  const template = readFileSync(homeTemplatePath, 'utf8');
  const selectors = [
    'app-home-order-flow',
    'app-home-product-suite',
    'app-home-industries',
    'app-home-ecosystem',
    'app-home-proof',
    'app-custom-request-demo'
  ];
  let previous = template.indexOf('</section>');
  for (const selector of selectors) {
    const current = template.indexOf(`<${selector}`);
    expect(current).toBeGreaterThan(previous);
    previous = current;
  }
});
```

Also assert the old `id="webview"` / `id="mobile_view"` duplicate homepage body is absent after the hero.

- [ ] **Step 2: Run the new spec and verify RED**

Expected: FAIL because the new selectors do not exist.

- [ ] **Step 3: Define typed content models using only existing wording**

Example interface:

```ts
export interface HomeProductModule {
  id: 'pos' | 'website' | 'qr' | 'kiosk' | 'queue' | 'kds' | 'hub';
  label: string;
  title: string;
  bullets: readonly string[];
  image: string;
  href: string;
}

export interface HomeIndustryStory {
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  linkLabel: string;
}

export interface HomeEcosystemChapter {
  id: 'hardware' | 'integrations' | 'psg';
  title: string;
  body: string;
  image: string;
  alt: string;
  href: string;
}

export interface HomeCustomerProof {
  image: string;
  alt: string;
  quote?: string;
}
```

Copy values verbatim from the current homepage template. Do not normalize capitalization or punctuation during extraction.

- [ ] **Step 4: Implement the product-suite component**

Use a left module navigator, one active content region and one real image stage. Support click and arrow-key selection. The active panel keeps one CTA destination from the legacy tab.

- [ ] **Step 5: Implement industry, ecosystem and proof components**

Use three distinct layout families:

```html
<section class="appz-section appz-industries" aria-labelledby="industry-title">
  <article *ngFor="let story of stories; let index = index"
    class="appz-industries__story" [class.is-offset]="index === 1" appMarketingReveal>
    <div class="appz-industries__media"><img [src]="imageUrl(story.image)" [alt]="story.alt"></div>
    <div class="appz-industries__copy">
      <h3>{{ story.title }}</h3>
      <p>{{ story.description }}</p>
      <a [href]="story.href">{{ story.linkLabel }}</a>
    </div>
  </article>
</section>
```

Hardware uses a horizontal product stage, integrations use grouped partner imagery, PSG uses a full-width information band, proof uses the existing logos in a horizontal rail and one existing testimonial at a time.

- [ ] **Step 6: Replace only the homepage body after the hero**

Keep the hero source range byte-for-byte unchanged. Replace everything after `<app-home-order-flow>` with the new selectors and the existing request-demo component.

- [ ] **Step 7: Register components and verify content preservation**

Add the four declarations to `CustomAppModule`. Run the new architecture spec and global visible-copy contract. Expected: no unique phrase missing; hero hash unchanged.

- [ ] **Step 8: Verify laptop, tablet and mobile composition**

Use CDP checks for section order, no duplicate desktop/mobile bodies, no overflow, selectors reachable by keyboard and images contained at all six widths.

- [ ] **Step 9: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-* UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts UI/src/app/components/index/app/home-structural-layout.spec.ts
git commit -m "feat: rebuild homepage as connected APPZPOS product story"
```

---

### Task 6: Restructure the seven product and solution routes

**Files:**
- Modify: the HTML/CSS files under `cloud-pos-point-of-sales-system`, `f&b-restaurant-online-ordering-website`, `f&b-restaurant-emenu-qr-code-ordering-system`, `self-order-kiosk-restaurant`, `f&b-restaurant-kitchen-display-system`, `f&b-restaurant-queue-number-display-system`, `f&b-restaurant-delivery-integration`
- Create: `UI/src/app/components/index/app/product-page-layout.spec.ts`

**Interfaces:**
- Produces: `.appz-product-page`, `.appz-product-masthead`, `.appz-feature-index`, `.appz-product-story` structures on all seven routes.
- Consumes: current component classes, metadata logic, `BindURL_Image`, route URLs, exact copy and existing request-demo component.

- [ ] **Step 1: Write failing route-template structure tests**

For every product template, assert exactly one semantic `main`, one masthead, at least one real product image, one feature index and the existing demo selector:

```ts
for (const template of productTemplates) {
  expect(template.match(/<main\b/g)?.length).toBe(1);
  expect(template).toContain('appz-product-masthead');
  expect(template).toContain('appz-feature-index');
  expect(template).toContain('app-custom-request-demo');
  expect(template).not.toContain('id="mobile_view"');
}
```

- [ ] **Step 2: Run the focused spec and verify RED**

Expected: FAIL on legacy duplicate markup and missing structural classes.

- [ ] **Step 3: Rebuild each template with the shared page grammar**

Use one responsive DOM tree per route:

```html
<main class="appz-page appz-product-page">
  <section class="appz-product-masthead appz-split">
    <div>
      <p>Up to 50% PSG Grants</p>
      <h1>APPZPOS Cutting-Edge POS Point of Sales<br>and E-Menu System</h1>
      <a class="appzpos-button" data-scrollto="#requestdemo">Book a Demo</a>
    </div>
    <img [src]="BindURL_Image('APPZPOS-All-in-one-Point-of-sales-system-machine.png')"
      alt="APPZPOS-All-in-one-Point-of-sales-system-machine">
  </section>
  <nav class="appz-feature-index" aria-label="Page features">
    <a href="#order-management">Order Management</a>
    <a href="#inventory-management">Inventory Management</a>
    <a href="#real-time-report">Real Time Report</a>
  </nav>
  <section id="order-management" class="appz-product-story">
    <h2>All-In-One<br>Point of Sale Software</h2>
    <p>APPZPOS POS Solutions boost profits by streamlining sales, inventory, and memberships across chains. Quick setup, user-friendly, and cloud-powered, it transforms restaurant management with ease and efficiency!</p>
  </section>
  <section id="inventory-management" class="appz-product-story appz-product-story--inverse">
    <h2>Powerful Cloud POS System<br>To Grow Your Restaurant</h2>
    <p>We are experts in the F&amp;B industry, and the APPZPOS POS system is built with exceptionally high usability standards, designed to assist you in effortlessly and instantly serving your customers.</p>
  </section>
  <div id="requestdemo"><app-custom-request-demo></app-custom-request-demo></div>
</main>
```

Move existing wording and assets into this structure without editing the text. Preserve every existing link and query string.

- [ ] **Step 4: Add route-specific responsive CSS**

Desktop uses asymmetric product mastheads. Laptop reduces overlap. Tablet uses two-column where image dimensions permit. Mobile uses copy-first or image-first ordering selected per route, one column and no viewport overflow.

- [ ] **Step 5: Run copy, route and focused layout contracts**

Expected: all PASS for seven routes.

- [ ] **Step 6: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/{cloud-pos-point-of-sales-system,f\&b-restaurant-online-ordering-website,f\&b-restaurant-emenu-qr-code-ordering-system,self-order-kiosk-restaurant,f\&b-restaurant-kitchen-display-system,f\&b-restaurant-queue-number-display-system,f\&b-restaurant-delivery-integration} UI/src/app/components/index/app/product-page-layout.spec.ts
git commit -m "feat: rebuild APPZPOS product page layouts"
```

---

### Task 7: Restructure the restaurant, retail and salon industry routes

**Files:**
- Modify: HTML/CSS/TS files under `f&b-restaurant-cloud-pos-system`, `retail-store-cloud-pos-system`, `salon-cloud-pos-system`
- Create: `UI/src/app/components/index/app/industry-page-layout.spec.ts`

**Interfaces:**
- Produces: `.appz-industry-page`, `.appz-industry-masthead`, `.appz-industry-modules`, `.appz-industry-proof` and route-local `industryPage` view models.
- Consumes: existing business-specific copy, images, module links, metadata and request-demo form.

- [ ] **Step 1: Add failing semantic and module-link tests**

Require one responsive DOM, the existing industry H1, all current module route destinations and no duplicated `webview/mobile_view` blocks.

- [ ] **Step 2: Run the focused spec and verify RED**

Expected: FAIL because the legacy route templates use duplicated presentation trees.

- [ ] **Step 3: Implement three distinct editorial compositions**

- Restaurant: order-channel journey and kitchen operations.
- Retail: product, checkout and inventory-led composition.
- Salon: customer relationship, service and payment-led composition.

Reuse the same tokens and structural classes but vary image ratios and section order so the pages are related rather than identical.

Use a single responsive tree per route:

```html
<main class="appz-page appz-industry-page">
  <section class="appz-industry-masthead appz-split">
    <div><h1>{{ industryPage.title }}</h1><p>{{ industryPage.introduction }}</p></div>
    <img [src]="BindURL_Image(industryPage.heroImage)" [alt]="industryPage.heroAlt">
  </section>
  <nav class="appz-industry-modules" aria-label="APPZPOS solutions">
    <a *ngFor="let module of industryPage.modules" [href]="module.href">{{ module.label }}</a>
  </nav>
  <section *ngFor="let story of industryPage.stories" class="appz-industry-story" appMarketingReveal>
    <h2>{{ story.title }}</h2><p>{{ story.body }}</p>
    <img [src]="BindURL_Image(story.image)" [alt]="story.alt">
  </section>
  <section class="appz-industry-proof">
    <img *ngFor="let customer of industryPage.customers"
      [src]="BindURL_Image(customer.image)" [alt]="customer.alt">
  </section>
  <div id="requestdemo"><app-custom-request-demo></app-custom-request-demo></div>
</main>
```

- [ ] **Step 4: Verify exact copy and responsive layouts**

Run the global phrase contract, route tests and 1024/768/430 screenshot checks. Expected: no copy loss and no overflow.

- [ ] **Step 5: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/{f\&b-restaurant-cloud-pos-system,retail-store-cloud-pos-system,salon-cloud-pos-system} UI/src/app/components/index/app/industry-page-layout.spec.ts
git commit -m "feat: rebuild APPZPOS industry narratives"
```

---

### Task 8: Rebuild hardware, integrations and feature catalogues

**Files:**
- Modify: HTML/CSS/TS files under `pos-hardware-machine-receipt-printer`, `pos-solutions-partner-integrations`, `pos-features-crm-payment-gateway`, `custom-solutions`
- Create: `UI/src/app/components/index/app/catalogue-page-layout.spec.ts`

**Interfaces:**
- Produces: `.appz-catalogue`, `.appz-catalogue-nav`, `.appz-catalogue-stage`, `.appz-spec-group`.
- Consumes: all existing device names, partner names, feature wording, images, anchors and destinations.

- [ ] **Step 1: Write failing catalogue tests**

Assert grouped semantic sections, preserved anchor IDs used by query-string scrolling, real images with alt text and no equal three-card feature grid.

- [ ] **Step 2: Run the focused spec and verify RED**

Expected: FAIL on the current repeated grid structure.

- [ ] **Step 3: Implement the hardware visual catalogue**

Group POS machines, printers and accessories. Use one featured product stage plus a responsive horizontal or masonry selector. Keep `POSMachine`, `Printers` and `Accessories` anchors intact.

```html
<main class="appz-page appz-catalogue">
  <nav class="appz-catalogue-nav" aria-label="Hardware categories">
    <a href="pos-hardware-machine-receipt-printer?scrollTo=POSMachine">POS Machine</a>
    <a href="pos-hardware-machine-receipt-printer?scrollTo=Printers">Printers</a>
    <a href="pos-hardware-machine-receipt-printer?scrollTo=Accessories">Accessories</a>
  </nav>
  <section *ngFor="let group of hardwareGroups" [id]="group.id" class="appz-catalogue-stage">
    <h2>{{ group.title }}</h2>
    <article *ngFor="let product of group.products">
      <img [src]="BindURL_Image(product.image)" [alt]="product.alt">
      <h3>{{ product.name }}</h3>
    </article>
  </section>
</main>
```

- [ ] **Step 4: Implement integration, feature and custom-solution groupings**

Use meaningful categories based only on current content. Do not create new partner descriptions or feature claims. Keep current route links and logos.

```html
<section class="appz-section appz-partner-group" *ngFor="let group of existingGroups">
  <h2>{{ group.existingTitle }}</h2>
  <div class="appz-partner-group__logos">
    <a *ngFor="let partner of group.partners" [href]="partner.existingHref">
      <img [src]="BindURL_Image(partner.existingImage)" [alt]="partner.existingAlt">
    </a>
  </div>
</section>
```

- [ ] **Step 5: Verify keyboard, anchor and responsive behavior**

Test tab/focus access, query-string anchor landing and overflow at all six widths.

- [ ] **Step 6: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/{pos-hardware-machine-receipt-printer,pos-solutions-partner-integrations,pos-features-crm-payment-gateway,custom-solutions} UI/src/app/components/index/app/catalogue-page-layout.spec.ts
git commit -m "feat: rebuild APPZPOS catalogues and integrations"
```

---

### Task 9: Rebuild PSG, contact and request-demo conversion surfaces

**Files:**
- Modify: HTML/CSS/TS files under `psg-pos-system-grant-singapore`, `point-of-sales-demo-quotation`, `custom-request-demo`, `modal-request-demo`
- Create: `UI/src/app/components/index/app/conversion-page-layout.spec.ts`

**Interfaces:**
- Produces: `.appz-grant-journey`, `.appz-contact-layout`, `.appz-conversion-panel`.
- Consumes: existing reactive forms, validators, submission handlers, contact data, grant copy and analytics hooks.

- [ ] **Step 1: Add failing form and content assertions**

Require labels above controls, unchanged control names, existing submit handler binding, office/WhatsApp phone numbers, email and address.

- [ ] **Step 2: Run the focused test and verify RED on structural requirements**

Expected: existing behavior assertions pass while new semantic layout assertions fail.

- [ ] **Step 3: Implement the PSG grant journey**

Arrange existing eligibility, process and funding wording into an ordered responsive journey without rewriting official text.

```html
<main class="appz-page appz-grant-page">
  <section class="appz-product-masthead appz-split">
    <div><h1>{{ grantPage.title }}</h1><p>{{ grantPage.introduction }}</p></div>
    <img [src]="BindURL_Image(grantPage.image)" [alt]="grantPage.imageAlt">
  </section>
  <section class="appz-grant-journey" aria-labelledby="grant-heading">
    <article *ngFor="let block of grantPage.blocks" appMarketingReveal>
      <h2>{{ block.title }}</h2><p>{{ block.body }}</p>
    </article>
  </section>
  <div id="requestdemo"><app-custom-request-demo></app-custom-request-demo></div>
</main>
```

- [ ] **Step 4: Restyle contact and demo forms without changing behavior**

Keep component TypeScript unchanged unless accessibility requires stable IDs. Use visible labels, inline validation placement, 44px controls, clear focus and submit states.

```html
<label for="contact-email">Email</label>
<input id="contact-email" formControlName="Email" type="email" autocomplete="email">
<p class="appz-field-error" *ngIf="form.controls.Email.touched && form.controls.Email.invalid">
  {{ existingEmailError }}
</p>
```

Use the existing form-control property names and existing validation messages from the component. The snippet defines structure only; it does not authorize changing the current label or error wording.

- [ ] **Step 5: Run form, content and runtime tests**

Expected: forms instantiate, current validators remain, contact destinations work and all tracking hooks remain present.

- [ ] **Step 6: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/{psg-pos-system-grant-singapore,point-of-sales-demo-quotation,custom-request-demo,modal-request-demo} UI/src/app/components/index/app/conversion-page-layout.spec.ts
git commit -m "feat: rebuild APPZPOS grant and conversion layouts"
```

---

### Task 10: Rebuild the Chinese Google Ads landing page

**Files:**
- Modify: HTML/CSS/TS files under `cn-f&b-restaurant-cloud-pos-system`, `cn-custom-request-demo`, `cn-modal-request-demo`
- Create: `UI/src/app/components/index/app/chinese-landing-layout.spec.ts`

**Interfaces:**
- Produces: `.appz-cn-landing`, `.appz-cn-value`, `.appz-cn-proof`, `.appz-cn-conversion`.
- Consumes: exact existing Chinese phrases, metadata, WhatsApp URL, phone links, form controls and tracking initialization.

- [ ] **Step 1: Add failing conversion-first layout tests**

Assert one H1, existing two primary actions, the demo form before the final third of the DOM, exact Chinese phrase preservation and no duplicated desktop/mobile content.

- [ ] **Step 2: Run the focused test and verify RED**

Expected: new structural assertions fail against the current long landing page.

- [ ] **Step 3: Implement a single responsive conversion path**

Use a split opening section with the real POS visual, existing Chinese copy and existing actions. Follow with concise grouped proof and the form. Preserve every remaining phrase in progressive sections rather than deleting it.

```html
<main class="appz-page appz-cn-landing" lang="zh-SG">
  <section class="appz-cn-value appz-split">
    <div><h1>{{ landingPage.title }}</h1><p>{{ landingPage.introduction }}</p></div>
    <img [src]="BindURL_Image(landingPage.heroImage)" [alt]="landingPage.heroAlt">
  </section>
  <section class="appz-cn-proof" appMarketingReveal>
    <article *ngFor="let proof of landingPage.proof">
      <h2>{{ proof.title }}</h2><p>{{ proof.body }}</p>
    </article>
  </section>
  <section class="appz-cn-conversion" id="requestdemo">
    <app-cn-custom-request-demo></app-cn-custom-request-demo>
  </section>
  <section class="appz-cn-details">
    <article *ngFor="let detail of landingPage.details">
      <h2>{{ detail.title }}</h2><p>{{ detail.body }}</p>
    </article>
  </section>
</main>
```

- [ ] **Step 4: Verify tracking and mobile conversion controls**

At 430 and 390 pixels, confirm WhatsApp/Messenger widgets do not cover the form CTA and that GTM and Meta Pixel remain loaded.

- [ ] **Step 5: Commit**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/{cn-f\&b-restaurant-cloud-pos-system,cn-custom-request-demo,cn-modal-request-demo} UI/src/app/components/index/app/chinese-landing-layout.spec.ts
git commit -m "feat: rebuild Chinese APPZPOS conversion landing page"
```

---

### Task 11: Final responsive, accessibility and preservation verification

**Files:**
- Create: `UI/scripts/site-layout-regression.mjs`
- Modify: `UI/scripts/site-runtime-contract.mjs`
- Modify: `UI/package.json`

**Interfaces:**
- Consumes: all public routes and structural selectors from Tasks 2-10.
- Produces: `npm run verify:marketing` as the complete local verification command.

- [ ] **Step 1: Create the site layout regression script**

Use CDP to visit all 19 routes at the six required widths and collect:

```js
const result = {
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  h1Count: document.querySelectorAll('h1').length,
  tinyTargets: [...document.querySelectorAll('button,input,select,textarea,.appzpos-nav__cta,.appzpos-header__mobile-toggle')]
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).length,
  gtm: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js"]')),
  pixel: Boolean(document.querySelector('script[src*="connect.facebook.net"]'))
};
```

Add route-specific checks for homepage order, Chinese form position, hardware anchors and widget collisions.

Emulate reduced motion and require no sticky order-flow wrapper. Measure each meaningful image box before and after image completion and fail when its reserved width or height changes by more than one pixel.

- [ ] **Step 2: Add the aggregate package script**

```json
"verify:marketing": "node scripts/site-content-contract.mjs && node scripts/site-runtime-contract.mjs && node scripts/hero-screen-fit-regression.mjs && node scripts/order-flow-regression.mjs && node scripts/site-layout-regression.mjs"
```

- [ ] **Step 3: Run all Jasmine tests**

```bash
cd UI
node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless
```

Expected: all assertions PASS. Record any Karma post-run reload warning separately only if the process still exits successfully and every assertion passed.

- [ ] **Step 4: Run the aggregate browser contract**

Start the Angular preview on an unused local port, then run:

```bash
APPZPOS_PREVIEW_URL='http://127.0.0.1:4310/' npm run verify:marketing
```

Expected: 19 routes and all six widths PASS with no overflow, missing tracking, inaccessible content or widget collisions.

- [ ] **Step 5: Run production build and inspect representative screenshots**

```bash
node node_modules/@angular/cli/bin/ng.js build
```

Capture and visually inspect homepage, one product page, one industry page, hardware, PSG, contact and Chinese landing at 1440, 1024, 768 and 430. Confirm the homepage hero is unchanged and the content below it is structurally different from the legacy site.

- [ ] **Step 6: Commit final verification tooling**

```bash
git add UI/scripts/site-layout-regression.mjs UI/scripts/site-runtime-contract.mjs UI/package.json UI/src/app/components
git commit -m "test: verify structural APPZPOS redesign"
```

- [ ] **Step 7: Start and report the local preview**

Run the Angular development server on an available localhost port, verify HTTP 200, and provide the exact local URL. Do not push remotely.
