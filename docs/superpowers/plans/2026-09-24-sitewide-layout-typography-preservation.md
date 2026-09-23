# APPZPOS Site-Wide Layout, Typography, and Tracking Preservation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all APPZPOS public pages one responsive 1240px shell and section-heading system, make both bilingual landing heroes fit exactly one viewport with the sticky header, and preserve every current and legacy tracking hook.

**Architecture:** Keep the existing Angular components and public-route markup. Centralize outer layout and typography in `_appzpos-design-system.scss`, retain legacy token aliases, and use small compatibility selectors in existing page styles. The shared `home-hero` component receives height-aware CSS only; tracking compatibility is restored with additive classes and locked with unit, source, and rendered-browser contracts.

**Tech Stack:** Angular 17, TypeScript 5.3, SCSS/CSS, Jasmine/Karma, Node.js test runner, Chrome DevTools Protocol, Git.

**Spec:** `docs/superpowers/specs/2026-09-24-sitewide-layout-typography-preservation-design.md`

## Global Constraints

- Canonical public-page shell width is exactly `1240px`.
- Canonical page gutter is `clamp(16px, 3vw, 32px)`.
- Sticky header height is exactly `76px`.
- Header plus landing-page hero must equal the viewport height within `1px` at 1440×900, 1366×768, 1024×768, 768×1024, 390×844, and 375×667.
- Do not hide hero copy, actions, the animated POS device, or function tags to satisfy the screen-fit requirement.
- Preserve routes, section order, business copy, metadata, forms, IDs, links, animations, and tracking hooks except for the four approved Title Case label changes.
- Preserve Google Tag Manager `GTM-N7VKTGG`, Meta Pixel `892134809204935`, `#requestdemo`, exact contact URLs/messages, `.btn-whatsapp`, `.btn-fb`, and existing `data-track-cta` values.
- Preserve `--appz-container` and `--appz-content-width` as aliases to the new `--appz-shell-width`; do not remove the legacy variables.
- Do not add dependencies or change the Angular/framework versions.
- Do not deploy. After verification, update GitHub `main` and the local production preview only.

## Review Focus

- Short-height mobile viewport (375×667): all semantic hero content remains inside the hero and the function tags remain reachable in their horizontal row.
- Dynamic mobile browser viewport: `100dvh` updates the hero without producing page-level horizontal overflow or a second vertical hero viewport.
- Chinese typography: top-level section titles use the shared size/weight but retain `.05em`–`.055em` tracking and do not clip.
- Legacy tracking selectors: adding `.btn-whatsapp` and `.btn-fb` does not import legacy presentation rules into the shared floating-contact rail.
- Legacy public pages: the shell normalizes outer alignment without enlarging card titles, FAQ questions, package labels, article headings, or form labels.

---

### Task 1: Lock Tracking Compatibility and Approved Title Case Labels

**Files:**
- Modify: `UI/src/app/components/index/app/home-page-template.component.spec.ts`
- Modify: `UI/src/app/components/index/app/marketing-shell.spec.ts`
- Modify: `UI/src/app/components/index/app/site-preservation.spec.ts`
- Create: `UI/scripts/tracking-preservation-contract.mjs`
- Modify: `UI/package.json`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-header/custom-header.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-transparent-header/custom-transparent-header.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-sections.en.ts`
- Modify: `UI/scripts/site-content-contract.mjs`
- Modify: `UI/scripts/site-visible-copy.json`

**Interfaces:**
- Consumes: Existing shared landing configuration, floating-contact `href` values, and active header markup.
- Produces: Additive legacy class hooks on shared contacts and the four exact Title Case labels required by later content/runtime contracts.

- [ ] **Step 1: Write failing Angular assertions for legacy classes and Title Case labels**

Add these assertions to the existing floating-contact test in `home-page-template.component.spec.ts`:

```ts
expect(whatsapp?.classList).toContain('btn-whatsapp');
expect(messenger?.classList).toContain('btn-fb');
expect(whatsapp?.getAttribute('href')).toBe(CHINESE_HOME_PAGE_CONFIG.floatingContacts?.[0].href ?? null);
expect(messenger?.getAttribute('href')).toBe(CHINESE_HOME_PAGE_CONFIG.floatingContacts?.[1].href ?? null);
```

Add this case to `marketing-shell.spec.ts`:

```ts
it('uses Title Case for Hardware and Features without changing destinations', () => {
  const host = headerFixture.nativeElement as HTMLElement;
  const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('#solutions-menu a'));
  const byHref = (href: string) => links.find(link => link.getAttribute('href') === href);

  expect(byHref('/pos-hardware-machine-receipt-printer')?.querySelector('strong')?.textContent?.trim())
    .toBe('Hardware');
  expect(byHref('/pos-features-crm-payment-gateway')?.querySelector('strong')?.textContent?.trim())
    .toBe('Features');
});
```

Extend `site-preservation.spec.ts` so the homepage contract verifies the exact WhatsApp URL, `data-track-cta="request-demo"`, one `#requestdemo`, and the English homepage eyebrow values `Software + Hardware` and `Key Features`.

Create `tracking-preservation-contract.mjs` as a literal source contract rooted at `UI/`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const root = resolve('client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components');
const read = (path) => readFileSync(path, 'utf8');
const environment = read(resolve('src/environment.ts'));
const template = read(resolve(root, 'home-page-template/home-page-template.component.html'));
const hero = read(resolve(root, 'home-hero/home-hero.component.html'));
const english = read(resolve(root, 'index/home-page-content.en.ts'));
const chinese = read(resolve(root, 'cn-f&b-restaurant-cloud-pos-system/home-page-content.zh.ts'));
const form = read(resolve(root, 'custom-request-demo/custom-request-demo.component.html'));
const whatsapp = "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";
const messenger = "http://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";

test('original analytics and conversion hooks remain present', () => {
  assert.match(environment, /GTM-N7VKTGG/);
  assert.match(environment, /892134809204935/);
  assert.match(template, /class\.btn-whatsapp/);
  assert.match(template, /class\.btn-fb/);
  assert.match(hero, /data-track-cta/);
  assert.match(english, /sectionId:\s*'requestdemo'/);
  assert.match(chinese, /sectionId:\s*'requestdemo'/);
  assert.ok(english.includes(whatsapp));
  assert.ok(chinese.includes(whatsapp));
  assert.ok(chinese.includes(messenger));
  for (const name of ['name', 'email', 'mobilenum', 'restaurant_name']) {
    assert.match(form, new RegExp(`formControlName="${name}"`));
  }
});
```

Register it as `"test:tracking-preservation": "node --test scripts/tracking-preservation-contract.mjs"` in `package.json`.

- [ ] **Step 2: Run the focused Angular tests and verify failure**

Run:

```bash
cd UI
npx ng test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-page-template.component.spec.ts' --include='src/app/components/index/app/marketing-shell.spec.ts' --include='src/app/components/index/app/site-preservation.spec.ts'
npm run test:tracking-preservation
```

Expected: FAIL because the floating links do not yet expose `.btn-whatsapp`/`.btn-fb` and the labels are still uppercase.

- [ ] **Step 3: Add compatibility classes without changing contact behavior**

Add these class bindings beside the current component-specific bindings in `home-page-template.component.html`:

```html
[class.btn-whatsapp]="contact.href.startsWith('https://wa.me/')"
[class.btn-fb]="contact.href.startsWith('http://m.me/') || contact.href.startsWith('https://m.me/')"
```

Retain both `.appz-home-floating-contact--*` bindings and all current `href`, `target`, `rel`, `aria-label`, icon, and image markup.

- [ ] **Step 4: Apply the four approved Title Case changes**

Change only these visible strings:

```text
HARDWARE            -> Hardware
FEATURES            -> Features
SOFTWARE + HARDWARE -> Software + Hardware
KEY FEATURES        -> Key Features
```

Apply the header changes wherever those labels occur in the three listed header templates. Apply the homepage eyebrow changes in `home-page-sections.en.ts`. Do not change route URLs, section titles, `aria-current`, or descriptive subtitles.

Update `site-visible-copy.json` and the approved-copy logic in `site-content-contract.mjs` so the old four labels are accepted only through their exact approved Title Case replacements. Do not add a blanket exception for missing phrases.

- [ ] **Step 5: Run the focused tests and content contract**

Run:

```bash
cd UI
npx ng test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-page-template.component.spec.ts' --include='src/app/components/index/app/marketing-shell.spec.ts' --include='src/app/components/index/app/site-preservation.spec.ts'
npm run test:site-content
npm run test:tracking-preservation
```

Expected: all focused Jasmine tests pass and the content contract reports 19 public routes with no unapproved wording removal.

- [ ] **Step 6: Commit the compatibility contract**

```bash
git add UI/src/app/components/index/app/home-page-template.component.spec.ts UI/src/app/components/index/app/marketing-shell.spec.ts UI/src/app/components/index/app/site-preservation.spec.ts UI/scripts/tracking-preservation-contract.mjs UI/package.json UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.html UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.html UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-header/custom-header.component.html UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-transparent-header/custom-transparent-header.component.html UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-sections.en.ts UI/scripts/site-content-contract.mjs UI/scripts/site-visible-copy.json
git commit -m "fix: preserve contact tracking hooks and title case labels"
```

---

### Task 2: Establish the Shared Shell and Section Typography Tokens

**Files:**
- Modify: `UI/scripts/lib/structural-styles.test.mjs`
- Modify: `UI/src/styles/_appzpos-design-system.scss`
- Modify: `UI/src/styles/_appzpos-marketing-pages.scss`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.css`

**Interfaces:**
- Consumes: Existing `--appz-container`, `--appz-content-width`, `.appz-section-title`, and `.appz-section-description` hooks.
- Produces: `--appz-shell-width`, `--appz-page-gutter`, `--appz-header-height`, shared title/description tokens, and compatibility aliases used by every later layout task.

- [ ] **Step 1: Write failing token and selector tests**

Extend `structural-styles.test.mjs` with exact assertions:

```js
test('sitewide shell aliases retain one 1240px source of truth', () => {
  assert.match(tokens, /--appz-shell-width:\s*1240px/);
  assert.match(tokens, /--appz-page-gutter:\s*clamp\(16px,\s*3vw,\s*32px\)/);
  assert.match(tokens, /--appz-header-height:\s*76px/);
  assert.match(tokens, /--appz-container:\s*var\(--appz-shell-width\)/);
  assert.match(tokens, /--appz-content-width:\s*var\(--appz-shell-width\)/);
});

test('section typography is scoped to explicit title and description hooks', () => {
  assert.match(tokens, /--appz-section-title-size:\s*clamp\(1\.9rem,\s*2\.7vw,\s*3rem\)/);
  assert.match(tokens, /--appz-section-title-line:\s*1\.08/);
  assert.match(tokens, /--appz-section-description-line:\s*1\.65/);
  assert.doesNotMatch(tokens, /#content h2:not\(\.fs-6\)/);
  assert.match(tokens, /\[data-home-page-template\]\[lang="zh"\][\s\S]*letter-spacing:\s*\.055em/);
});
```

- [ ] **Step 2: Run the structural test and verify failure**

Run:

```bash
cd UI
node --test scripts/lib/structural-styles.test.mjs
```

Expected: FAIL because the canonical shell and typography variables do not exist and the broad `#content h2` rule still exists.

- [ ] **Step 3: Add canonical variables and legacy aliases**

In `:root` of `_appzpos-design-system.scss`, use this contract:

```scss
--appz-shell-width: 1240px;
--appz-page-gutter: clamp(16px, 3vw, 32px);
--appz-header-height: 76px;
--appz-container: var(--appz-shell-width);
--appz-content-width: var(--appz-shell-width);
--appz-section-space: clamp(52px, 6vw, 84px);
--appz-section-title-size: clamp(1.9rem, 2.7vw, 3rem);
--appz-section-title-line: 1.08;
--appz-section-description-size: clamp(1rem, 1.2vw, 1.1rem);
--appz-section-description-line: 1.65;
```

Keep `--appz-gutter` as an alias to `--appz-page-gutter` for existing selectors.

- [ ] **Step 4: Replace the blanket heading rule with explicit hooks**

Remove `#content h2:not(.fs-6)`. Make `.appz-section-title` the primary contract:

```scss
.appz-section-title {
  margin-top: 0;
  font-family: var(--appz-font) !important;
  font-size: var(--appz-section-title-size) !important;
  font-weight: 750 !important;
  letter-spacing: -.04em !important;
  line-height: var(--appz-section-title-line) !important;
  text-wrap: balance;
}

.appz-section-description {
  max-width: var(--appz-reading-width);
  font-family: var(--appz-font) !important;
  font-size: var(--appz-section-description-size) !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
  line-height: var(--appz-section-description-line) !important;
  text-wrap: pretty;
}
```

Retain Chinese overrides at `.055em`, falling to `.05em` below 768px. Add only explicit legacy top-level section selectors to the same declarations; do not target generic card `h2`/`h3`, FAQ summaries, package labels, article-body headings, modal headings, or form labels.

- [ ] **Step 5: Make homepage section overrides consume the shared contract**

Remove conflicting `font-size`, `font-weight`, `letter-spacing`, and `line-height` declarations from top-level `.ecosystem__features h2`, `.ecosystem__grant h2`, and `.industries__intro .appz-display` rules. Keep their color, alignment, width, and margins. Do not change feature-card `h3` or industry-story `h3` component scales.

- [ ] **Step 6: Run structural and focused Angular tests**

Run:

```bash
cd UI
node --test scripts/lib/structural-styles.test.mjs
npx ng test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-page-template.component.spec.ts' --include='src/app/components/index/app/industry-islands.spec.ts'
```

Expected: all tests pass.

- [ ] **Step 7: Commit the shared tokens**

```bash
git add UI/scripts/lib/structural-styles.test.mjs UI/src/styles/_appzpos-design-system.scss UI/src/styles/_appzpos-marketing-pages.scss UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.css
git commit -m "style: establish shared shell and section typography"
```

---

### Task 3: Make Both Landing Heroes Fit One Viewport

**Files:**
- Modify: `UI/scripts/hero-screen-fit-regression.mjs`
- Modify: `UI/package.json`
- Modify: `UI/src/styles/_appzpos-home-hero.scss`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component.css`

**Interfaces:**
- Consumes: `--appz-shell-width`, `--appz-page-gutter`, and `--appz-header-height` from Task 2 plus existing hero state/animation markup.
- Produces: Exact header-plus-hero viewport sizing for `/` and `/cn-f&b-restaurant-cloud-pos-system` without changing `HomeHeroComponent` state behavior.

- [ ] **Step 1: Extend the rendered regression with the required route/viewport matrix**

Replace the width-only profile list in `hero-screen-fit-regression.mjs` with:

```js
const routes = ['/', '/cn-f&b-restaurant-cloud-pos-system'];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 375, height: 667 }
];
```

For every route/profile, collect:

```js
const header = document.querySelector('#header.appzpos-header');
const hero = document.querySelector('.appzpos-product-hero');
const semanticNodes = [
  document.querySelector('.appzpos-product-hero__copy'),
  document.querySelector('.appzpos-product-hero__machine'),
  document.querySelector('.appzpos-module-orbit__list')
].filter(Boolean);
return {
  headerHeight: header.getBoundingClientRect().height,
  heroHeight: hero.getBoundingClientRect().height,
  viewportHeight: window.innerHeight,
  heroBounds: hero.getBoundingClientRect().toJSON(),
  semanticBounds: semanticNodes.map(node => node.getBoundingClientRect().toJSON()),
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth
};
```

Fail when the absolute height delta exceeds `1`, a semantic node lies outside the hero bounds, or page scroll width exceeds client width by more than `1`. Preserve the existing screen-slice, industry synchronization, function-tag order, no-glow, and reduced-motion assertions for the English product showcase.

Add `"test:hero-screen-fit": "node scripts/hero-screen-fit-regression.mjs"` to `package.json`.

- [ ] **Step 2: Build and run the regression against the current CSS to verify failure**

Run:

```bash
cd UI
npm run build
python3 -m http.server 4313 --directory dist/e-commerce
```

In a second shell, launch Chrome with remote debugging and run:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9225 --user-data-dir=/tmp/appzpos-layout-chrome about:blank
cd UI
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:hero-screen-fit
```

Expected: FAIL with the current desktop hero overfilling and current mobile hero underfilling the viewport.

- [ ] **Step 3: Replace fixed hero minimum heights with the viewport equation**

In `_appzpos-home-hero.scss`, make the root contract:

```scss
.appzpos-product-hero {
  block-size: calc(100vh - var(--appz-header-height));
  block-size: calc(100svh - var(--appz-header-height));
  block-size: calc(100dvh - var(--appz-header-height));
  min-block-size: 0;
}

.appzpos-product-hero__frame {
  width: min(
    calc(100% - (var(--appz-page-gutter) * 2)),
    var(--appz-shell-width)
  );
  block-size: 100%;
  min-block-size: 0;
}
```

Remove every breakpoint rule that restores a fixed `min-height` on the product hero. Keep decorative overflow clipped.

- [ ] **Step 4: Add height-aware internal scaling**

Use CSS custom properties on the hero for copy top padding, title size, visual height, device width, tag height, and gaps. Reduce those values in `@media (max-height: 900px)`, `@media (max-height: 768px)`, and `@media (max-height: 667px)` without changing content or DOM order. At widths up to 1024px, retain the function-tag list after the device as a one-row `overflow-x: auto` rail. Ensure its parent can shrink with `min-height: 0` and `min-width: 0`.

Keep the existing animation names, active-industry bindings, screen slices, tab semantics, and `prefers-reduced-motion` overrides unchanged.

- [ ] **Step 5: Rebuild and run hero/unit regressions**

Run:

```bash
cd UI
npm run build
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:hero-screen-fit
npx ng test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-hero.component.spec.ts' --include='src/app/components/index/app/cn-home-page.component.spec.ts'
```

Expected: all six viewport profiles pass on both landing routes; industry synchronization and unit behavior still pass.

- [ ] **Step 6: Commit the exact-fit hero**

```bash
git add UI/scripts/hero-screen-fit-regression.mjs UI/package.json UI/src/styles/_appzpos-home-hero.scss UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component.css
git commit -m "fix: fit bilingual landing heroes to one viewport"
```

---

### Task 4: Normalize Public-Page Shells and Top-Level Headings

**Files:**
- Create: `UI/scripts/sitewide-layout-regression.mjs`
- Modify: `UI/package.json`
- Modify: `UI/src/styles/_appzpos-marketing-pages.scss`
- Modify: `UI/src/styles/_appzpos-features.scss`
- Modify: `UI/src/styles/_appzpos-partners.scss`
- Modify: `UI/src/styles/_appzpos-blog.scss`
- Modify: `UI/src/styles/_appzpos-order-flow.scss`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-footer/custom-footer.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-content-width.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-islands.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-layout.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-hardware-machine-receipt-printer/pos-hardware-machine-receipt-printer.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/psg-pos-system-grant-singapore/psg-pos-system-grant-singapore.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component.css`

**Interfaces:**
- Consumes: Shared shell/title tokens from Task 2.
- Produces: Consistent outer alignment, title computation, gutters, and overflow behavior across all 19 public routes.

- [ ] **Step 1: Add the rendered site-wide layout contract**

Create `sitewide-layout-regression.mjs` using the same CDP helper pattern as `site-runtime-contract.mjs`. Use the exact 19-route list from the spec and these profiles:

```js
const viewports = [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 375, height: 667 }
];
```

For each page collect visible outer shells using this selector list:

```js
const shellSelector = [
  '.appzpos-header__inner', '.appzpos-container', '.appz-section',
  '.solution-island-hero__inner', '[data-solution-hero] .appz-solution-hero__inner',
  '.appz-conversion-panel', '.industries__experience',
  '.features-hero__inner', '.hardware-hero__inner', '.partners-hero__inner',
  '.blog-hero__inner'
].join(',');
```

At 1440px and 1366px, fail a shell wider than `1241px`. Below the shell breakpoint, fail if a shell starts less than `15px` from the viewport edge or ends less than `15px` from the opposite edge, excluding intentional full-bleed backgrounds. On every page fail when scroll width exceeds client width by more than `1px`.

Collect `.appz-section-title` computed styles and fail when a visible title does not use Manrope, weight `750`, line-height within `0.02` of `1.08 × font-size`, or the expected language letter spacing. Check `.appz-section-description` line height within `0.05` of `1.65 × font-size` and width no greater than `65ch` as rendered by its computed max-width.

Also collect `.ecosystem__feature-card h3`, `.psg-faq__item summary`, and `.blog-card h2` when present. Fail if one of these component headings computes to the same font size as `.appz-section-title`; this protects card, FAQ, and article hierarchy from the removed blanket `#content h2` selector.

Add `"test:sitewide-layout": "node scripts/sitewide-layout-regression.mjs"` to `package.json`.

- [ ] **Step 2: Run the new regression and verify current width/type failures**

Run:

```bash
cd UI
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:sitewide-layout
```

Expected: FAIL for current 1320px/1392px shells and conflicting top-level heading styles.

- [ ] **Step 3: Replace local outer-width equations with the shared shell equation**

In every listed stylesheet, replace outer layout widths such as `1400px`, `1320px`, `var(--appz-content-width)`, or literal `1240px` with:

```css
width: min(calc(100% - (var(--appz-page-gutter) * 2)), var(--appz-shell-width));
margin-inline: auto;
```

When a selector already has intentional inner maximum width (for example a 960px reading block or 1120px card grid), keep that inner cap and place it inside the shared outer shell rather than widening it. Do not change full-bleed section backgrounds.

Normalize these outer owners specifically:

- `.appz-section` and `.appz-conversion-panel`
- `.solution-island-hero__inner` and `.appz-solution-hero__inner`
- Homepage ecosystem, grant, features, industries, and form wrappers
- Header/footer inners
- Hardware, Features, Partners, and Blog hero inners
- Industry-page content and island wrappers
- PSG outer sections while retaining its narrower reading blocks

- [ ] **Step 4: Remove conflicting top-level section-title declarations**

For headings already carrying `.appz-section-title`, delete local font family, size, weight, letter spacing, and line-height declarations. For legacy top-level section headings that cannot receive a class without a broad template rewrite, add their precise wrapper selector to the compatibility group in `_appzpos-design-system.scss`. Do not add generic `#content h2` or `section h2` selectors.

Retain component scales for feature cards, pricing/package headings, FAQ summaries, article content, modal headings, and form labels.

- [ ] **Step 5: Rebuild and run layout, footer, and component regressions**

Run:

```bash
cd UI
npm run build
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:sitewide-layout
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:footer-responsive
npx ng test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/marketing-shell.spec.ts' --include='src/app/components/index/app/industry-islands.spec.ts' --include='src/app/components/index/app/home-ecosystem.component.spec.ts'
```

Expected: all 19 routes pass all six viewports, footer alignment remains correct, and component tests pass.

- [ ] **Step 6: Commit public-page normalization**

```bash
git add UI/scripts/sitewide-layout-regression.mjs UI/package.json UI/src/styles UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-white-header/custom-white-header.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-footer/custom-footer.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-hardware-machine-receipt-printer/pos-hardware-machine-receipt-printer.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/psg-pos-system-grant-singapore/psg-pos-system-grant-singapore.component.css UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component.css
git commit -m "style: normalize public page width and heading rhythm"
```

---

### Task 5: Strengthen Runtime Tracking and Interaction Preservation

**Files:**
- Modify: `UI/scripts/site-runtime-contract.mjs`
- Modify: `UI/scripts/cn-home-parity-regression.mjs`
- Modify: `UI/src/app/components/index/app/marketing-shell.spec.ts`
- Modify: `UI/src/app/components/index/app/home-hero.component.spec.ts`

**Interfaces:**
- Consumes: Final DOM/classes/styles from Tasks 1–4.
- Produces: Route-level proof that visual normalization did not break analytics, contact actions, sticky navigation, hero state, forms, or metadata.

- [ ] **Step 1: Add exact runtime preservation fields**

Extend the route evaluation in `site-runtime-contract.mjs` with:

```js
messenger: document.querySelectorAll('a[href^="https://m.me/APPZPOS"], a[href^="http://m.me/APPZPOS"]').length,
requestDemoIds: document.querySelectorAll('#requestdemo').length,
trackedCtas: [...document.querySelectorAll('[data-track-cta]')]
  .map(node => node.getAttribute('data-track-cta')),
formNames: [...document.querySelectorAll('#requestdemo input[name], #requestdemo textarea[name], #requestdemo select[name]')]
  .map(node => node.getAttribute('name')),
headerPosition: getComputedStyle(document.querySelector('#header')).position,
callHref: document.querySelector('[aria-label="Call APPZPOS"]')?.getAttribute('href'),
whatsappHref: document.querySelector('[aria-label="WhatsApp APPZPOS"]')?.getAttribute('href'),
messengerHref: document.querySelector('[aria-label="Message APPZPOS on Messenger"]')?.getAttribute('href')
```

Require on all 19 routes: non-empty title and description, GTM, Meta Pixel, at least one WhatsApp and Messenger action, sticky/fixed header, `tel:+6583109631`, and the exact approved header WhatsApp/Messenger messages. Require exactly one `#requestdemo` and non-empty form field names on routes that currently render the request-demo form. Require `request-demo` and `link` tracking values on both bilingual landing pages.

- [ ] **Step 2: Add interaction invariants to focused tests**

In `marketing-shell.spec.ts`, keep the approved action order and add assertions that the header remains `position: fixed`, height `76px`, and each utility action retains its exact `href`.

In `home-hero.component.spec.ts`, retain the active-industry screen/tag equality test and add assertions that changing from quick service to restaurant does not alter either CTA's `data-track-cta`, `href`, or label.

In `cn-home-parity-regression.mjs`, add the exact header-plus-hero height delta and legacy floating-contact class checks for each existing viewport profile. Capture the computed width, height, border radius, and background color of each floating contact before and after the legacy classes are added; require the existing component dimensions and colors so `.btn-whatsapp`/`.btn-fb` remain compatibility hooks rather than importing unrelated legacy presentation.

- [ ] **Step 3: Run preservation regressions**

Run:

```bash
cd UI
npm run build
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:site-runtime
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/cn-f\&b-restaurant-cloud-pos-system APPZPOS_CDP_PORT=9225 node scripts/cn-home-parity-regression.mjs
npx ng test --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/marketing-shell.spec.ts' --include='src/app/components/index/app/home-hero.component.spec.ts'
```

Expected: runtime contract passes all 19 routes, Chinese parity passes every viewport, and focused Angular tests pass.

- [ ] **Step 4: Commit runtime preservation coverage**

```bash
git add UI/scripts/site-runtime-contract.mjs UI/scripts/cn-home-parity-regression.mjs UI/src/app/components/index/app/marketing-shell.spec.ts UI/src/app/components/index/app/home-hero.component.spec.ts
git commit -m "test: lock sitewide tracking and responsive behavior"
```

---

### Task 6: Full Verification, Local Preview, and GitHub Handoff

**Files:**
- Verify only: all files changed in Tasks 1–5
- Update only if a command name was added: `UI/package.json`

**Interfaces:**
- Consumes: All completed implementation commits.
- Produces: Verified production build at `http://127.0.0.1:4313/` and a fast-forward update of GitHub `main`.

- [ ] **Step 1: Run static checks and the full Angular suite**

Run:

```bash
git diff --check origin/main...HEAD
cd UI
node --test scripts/lib/*.test.mjs
npx ng test --watch=false --browsers=ChromeHeadless
npm run build
```

Expected: no whitespace errors, all Node tests pass, all Angular tests pass, and the production build completes.

- [ ] **Step 2: Refresh the production preview and run all browser contracts**

Stop only the existing preview process bound to port 4313, then serve the newly built directory:

```bash
appzpos_preview_pid=$(lsof -ti tcp:4313)
if [ -n "$appzpos_preview_pid" ]; then kill "$appzpos_preview_pid"; fi
cd UI
python3 -m http.server 4313 --directory dist/e-commerce
```

With Chrome remote debugging on port 9225, run:

```bash
cd UI
npm run test:site-content
npm run test:cn-home-content
npm run test:tracking-preservation
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:site-runtime
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:hero-screen-fit
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:sitewide-layout
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/ APPZPOS_CDP_PORT=9225 npm run test:footer-responsive
APPZPOS_PREVIEW_URL=http://127.0.0.1:4313/cn-f\&b-restaurant-cloud-pos-system APPZPOS_CDP_PORT=9225 node scripts/cn-home-parity-regression.mjs
```

Expected: every contract passes. Record third-party Tawk CORS and Uniicons font warnings separately; fail for any first-party exception, missing first-party asset, tracking mismatch, overflow, clipping, or layout assertion.

- [ ] **Step 3: Inspect the final diff and commit any test-script registration missed by earlier tasks**

Run:

```bash
git status --short
git diff --stat origin/main...HEAD
git log --oneline origin/main..HEAD
```

Expected: only the spec, plan, implementation, and regression files are changed; the worktree is clean after commits. If `package.json` contains an uncommitted script registration from the verified commands, commit only that file with:

```bash
git add UI/package.json
git commit -m "test: register sitewide responsive contracts"
```

- [ ] **Step 4: Fast-forward GitHub main**

Run:

```bash
git fetch origin
git merge-base --is-ancestor origin/main HEAD
git push origin HEAD:main
```

Expected: the ancestry check succeeds and GitHub `main` advances to the verified HEAD. If the ancestry check fails, stop before pushing, merge the new `origin/main` into the branch without discarding either side, rerun Step 1 and Step 2, then repeat the ancestry check.

- [ ] **Step 5: Report the verified local and Git results**

Provide:

- Local homepage: `http://127.0.0.1:4313/`
- Local Chinese page: `http://127.0.0.1:4313/cn-f&b-restaurant-cloud-pos-system`
- Final pushed commit SHA
- Build, Angular, content, runtime, hero-fit, layout, Chinese parity, and footer test results
- Explicit confirmation that deployment was skipped
