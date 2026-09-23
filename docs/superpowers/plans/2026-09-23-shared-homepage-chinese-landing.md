# Shared Homepage Chinese Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the approved English homepage a reusable Angular template and render the existing Chinese F&B POS landing page through it without changing any existing Chinese wording, URLs, metadata, forms, or tracking hooks.

**Architecture:** A typed `HomePageTemplateConfig` becomes the content boundary between route components and shared presentation components. The English and Chinese routes each provide explicit configuration data, while the shared template composes the hero, connected solutions, story bands, grant, features, industries, proof, and locale-specific conversion form. Existing homepage components become input-driven without changing their approved DOM behavior or styling.

**Tech Stack:** Angular 17, TypeScript 5.3, Angular Material dialog, Jasmine/Karma with ChromeHeadless, SCSS/CSS, Node content-contract scripts.

**Spec:** `docs/superpowers/specs/2026-09-23-shared-homepage-chinese-landing-design.md`

## Global Constraints

- Preserve every visible Chinese phrase from the current Chinese landing page verbatim.
- Do not translate, rewrite, shorten, normalize, or invent Chinese copy.
- Preserve the Chinese route, page title, meta description, CTA behavior, URLs, image names, form controls, and dialog type.
- Preserve the English homepage's currently approved appearance, interactions, content contract, and hidden legacy copy bank.
- Keep GTM, Meta Pixel, existing IDs/classes/data attributes, and form submission code unchanged.
- Use one responsive DOM structure; remove duplicate Chinese desktop/mobile content only after its content is represented by configuration.
- Do not add dependencies, deploy, merge, or publish.
- Preserve unrelated dirty-worktree changes, especially `UI/package-lock.json`.

## Review Focus

- Chinese text containing punctuation, ampersands, `<br>` boundaries, or embedded English must render without silent normalization; Task 1 pins every unique phrase.
- Optional sections must not render fallback English on the Chinese route; Task 2 tests absent sections and locale isolation.
- CTA variants must distinguish emitted demo actions from normal navigation links while preserving href/target/rel; Tasks 2 and 7 test both paths.
- Consolidating duplicated desktop/mobile markup must not create duplicate IDs or horizontal overflow; Tasks 7 and 8 test ID uniqueness and 320–1450px widths.
- Components with timers, scrolling, or dialogs must clean up and remain usable with reduced motion and keyboard input; Tasks 3, 4, and 8 test teardown, keyboard selection, and reduced-motion behavior.

---

### Task 1: Lock the Existing Chinese Content and Integration Contract

**Files:**
- Create: `UI/scripts/cn-home-content-contract.mjs`
- Modify: `UI/package.json`
- Test source: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.html`
- Test source: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.ts`

**Interfaces:**
- Consumes: the current legacy Chinese component before migration.
- Produces: `npm run test:cn-home-content`, a source-level preservation guard used by every later task.

- [ ] **Step 1: Write the content-contract script with exact expectations**

Create a Node script using `readFileSync`, `existsSync`, and `fileURLToPath`. Store explicit arrays named `expectedPhrases`, `expectedRoutes`, `expectedImages`, `expectedMetadata`, and `expectedHooks`. Include every unique visible heading, paragraph, list item, CTA label, href, image filename/alt, the title/meta description, `openDialog()`, `CNModalRequestDemoComponent`, and the four form control names. Normalize only HTML tags and repeated whitespace for comparison; do not normalize punctuation or character case.

```js
const requiredExamples = [
  'APPZPOS POS系统云端智能POS餐饮系统高达50%政府津贴折扣',
  '专为餐饮业者设计的全方位餐饮系统，包括收银系统、销售报告分析、会员管理、库存管理、促销优惠，运营流程等',
  '预约免费演示',
  'WhatsApp联系我们',
  '收银机 / 电子点餐',
  '网站点餐系统',
  '扫码点餐系统',
  '自助点餐机',
  '排队叫号系统',
  'KDS厨房系统',
  '外卖订单中心',
  'APPZPOS的优势',
  '我们的客户'
];

const missing = expectations.filter((value) => !normalizedSource.includes(value));
if (missing.length) {
  console.error(`Chinese homepage contract failed:\n${missing.join('\n')}`);
  process.exit(1);
}
```

- [ ] **Step 2: Add the npm command**

Add only this script entry, preserving the rest of `package.json`:

```json
"test:cn-home-content": "node scripts/cn-home-content-contract.mjs"
```

- [ ] **Step 3: Run the guard against the untouched legacy page**

Run: `npm run test:cn-home-content`

Expected: PASS with counts for phrases, routes, images, metadata, and hooks. If anything is missing, correct the expectation extraction before proceeding; do not weaken an expectation to make the test pass.

- [ ] **Step 4: Commit the baseline guard**

```bash
git add UI/scripts/cn-home-content-contract.mjs UI/package.json
git commit -m "test: lock Chinese landing page content"
```

### Task 2: Add the Shared Homepage Types and Shell

**Files:**
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.models.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.html`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.css`
- Create: `UI/src/app/components/index/app/home-page-template.component.spec.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts`

**Interfaces:**
- Consumes: locale-specific `HomePageTemplateConfig` objects.
- Produces: `<app-home-page-template [config]="..." (requestDemo)="...">` and typed content interfaces used by all following tasks.

- [ ] **Step 1: Write failing shell tests**

Test that the component:

```ts
it('renders only configured sections without English fallback copy', () => {
  component.config = {
    language: 'zh',
    hero: chineseHero,
    conversion: { locale: 'zh', sectionId: 'requestdemo' }
  };
  fixture.detectChanges();
  expect(text()).toContain(chineseHero.title);
  expect(text()).not.toContain('Everything Works Together');
  expect(element.querySelector('app-cn-custom-request-demo')).not.toBeNull();
  expect(element.querySelector('app-custom-request-demo')).toBeNull();
});

it('emits requestDemo for an action CTA and leaves link CTAs as anchors', () => {
  spyOn(component.requestDemo, 'emit');
  click('[data-track-cta="request-demo"]');
  expect(component.requestDemo.emit).toHaveBeenCalledTimes(1);
  expect(element.querySelector('a[href^="https://wa.me/"]')).not.toBeNull();
});
```

Also test one H1, configured `lang`, optional section omission, locale-specific form selection, and stable `requestdemo` ID.

- [ ] **Step 2: Run the tests and verify the missing component failure**

Run: `npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-page-template.component.spec.ts'`

Expected: FAIL because `HomePageTemplateComponent` and its models do not exist.

- [ ] **Step 3: Define focused immutable models**

Define `HomePageTemplateConfig`, `HomeHeroConfig`, `HomeHeroIndustry`, `HomeCtaConfig`, `HomeSolutionsConfig`, `HomeSolutionItem`, `HomeStorySectionConfig`, `HomeGrantConfig`, `HomeFeatureSectionConfig`, `HomeFeatureItem`, `HomeIndustrySectionConfig`, `HomeProofConfig`, and `HomeConversionConfig`. Use `readonly` fields and discriminated CTA types:

```ts
export type HomeCtaConfig =
  | { readonly kind: 'action'; readonly action: 'request-demo'; readonly label: string; readonly trackingClass?: string }
  | { readonly kind: 'link'; readonly href: string; readonly label: string; readonly target?: '_blank' | '_self'; readonly rel?: string; readonly trackingClass?: string };

export interface HomePageTemplateConfig {
  readonly language: 'en' | 'zh';
  readonly hero: HomeHeroConfig;
  readonly solutions?: HomeSolutionsConfig;
  readonly storySections?: readonly HomeStorySectionConfig[];
  readonly grant?: HomeGrantConfig;
  readonly features?: HomeFeatureSectionConfig;
  readonly industries?: HomeIndustrySectionConfig;
  readonly proof?: HomeProofConfig;
  readonly conversion?: HomeConversionConfig;
}
```

- [ ] **Step 4: Implement the minimal shell**

Use `@Input({ required: true }) config!` and `@Output() requestDemo = new EventEmitter<void>()`. Render only configured child sections with `*ngIf`; render the correct existing request-demo component from `conversion.locale`. Add `data-track-cta` without removing configured legacy classes.

- [ ] **Step 5: Declare the component and pass the targeted tests**

Run the Task 2 test command.

Expected: PASS, including no fallback English text and exactly one H1.

- [ ] **Step 6: Commit the shared shell**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template UI/src/app/components/index/app/home-page-template.component.spec.ts UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts
git commit -m "feat: add shared homepage template shell"
```

### Task 3: Extract the Configurable Shared Hero

**Files:**
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component.html`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component.css`
- Create: `UI/src/app/components/index/app/home-hero.component.spec.ts`
- Modify: `UI/src/styles/_appzpos-home-hero.scss`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts`

**Interfaces:**
- Consumes: `HomeHeroConfig` and emits `requestDemo`.
- Produces: a single responsive hero supporting the English product-showcase visual and the Chinese responsive image visual.

- [ ] **Step 1: Write failing hero tests**

Cover both visual variants and teardown:

```ts
expect(render(englishHero).querySelector('[data-industry="quick-service"]')).not.toBeNull();
expect(render(chineseHero).querySelector('picture source[media="(max-width: 767px)"]')).not.toBeNull();
expect(render(chineseHero).textContent).toContain('预约免费演示');
expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
component.ngOnDestroy();
expect(component.hasActiveTimersForTest()).toBeFalse();
```

Test manual industry selection, autoplay stop after manual input, direct WhatsApp href preservation, keyboard-accessible tabs, and the exact configured title/description.

- [ ] **Step 2: Run the hero tests and verify failure**

Run: `npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-hero.component.spec.ts'`

Expected: FAIL because `HomeHeroComponent` does not exist.

- [ ] **Step 3: Move the current English hero behavior into the component**

Move the industry transition state, timers, `selectIndustry`, `trackModule`, and cleanup from `CustomHomeComponent`. Bind all text, screen images, alt text, CTA labels, and module lists from `HomeHeroConfig`. Do not change the existing class names used by `_appzpos-home-hero.scss`.

- [ ] **Step 4: Add the Chinese responsive-image branch**

For `visual.kind === 'responsive-image'`, render a `<picture>` with configured desktop/mobile assets and one accessible `<img>`. Keep the shared homepage hero copy/actions structure and use the same responsive container widths and button styles.

- [ ] **Step 5: Run the hero tests and existing homepage hero contract**

Run the Task 3 test command, then `npm run test:site-content`.

Expected: PASS; the existing locked English hero wording and CTA hooks remain present.

- [ ] **Step 6: Commit the shared hero**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero UI/src/app/components/index/app/home-hero.component.spec.ts UI/src/styles/_appzpos-home-hero.scss UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts
git commit -m "refactor: extract configurable homepage hero"
```

### Task 4: Make Connected Solutions Input-Driven

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.html`
- Modify: `UI/src/app/components/index/app/home-order-flow.component.spec.ts`

**Interfaces:**
- Consumes: required `HomeSolutionsConfig`.
- Produces: the existing accessible option-window interaction for either English or Chinese content.

- [ ] **Step 1: Add failing configuration tests**

Add a seven-item Chinese fixture and assert exact title/description/module labels, configured image/link changes after selection, `aria-pressed`, `aria-controls`, keyboard activation, and no English title when given Chinese data.

```ts
component.config = chineseSolutions;
fixture.detectChanges();
expect(optionTexts()).toEqual([
  '收银机 / 电子点餐', '网站点餐系统', '扫码点餐系统', '自助点餐机',
  '排队叫号系统', 'KDS厨房系统', '外卖订单中心'
]);
```

- [ ] **Step 2: Run the existing order-flow spec and verify the new tests fail**

Run: `npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-order-flow.component.spec.ts'`

Expected: FAIL because the component still owns hard-coded English data.

- [ ] **Step 3: Replace hard-coded presentation copy with input data**

Add `@Input({ required: true }) config!: HomeSolutionsConfig`. Initialize selection after the input exists, preserve `data-ecosystem-island`, `data-island-id`, `data-route`, existing class names, and the current selection logic. Guard empty item arrays by rendering no options or detail panel.

- [ ] **Step 4: Pass order-flow tests and verify cleanup**

Run the Task 4 command.

Expected: PASS for English and Chinese fixtures, keyboard selection, responsive layout assertions, and `ngOnDestroy` cleanup.

- [ ] **Step 5: Commit the configurable solutions component**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow UI/src/app/components/index/app/home-order-flow.component.spec.ts
git commit -m "refactor: configure homepage solution flow"
```

### Task 5: Configure Story, Grant, Features, Industries, and Proof Sections

**Files:**
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-story-sections/home-story-sections.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-story-sections/home-story-sections.component.html`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-story-sections/home-story-sections.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries/home-industries.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof/home-proof.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof/home-proof.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts`
- Create: `UI/src/app/components/index/app/home-story-sections.component.spec.ts`
- Modify: `UI/src/app/components/index/app/home-ecosystem.component.spec.ts`
- Modify: `UI/src/app/components/index/app/home-industries.component.spec.ts`
- Modify: `UI/src/app/components/index/app/home-proof.component.spec.ts`

**Interfaces:**
- Consumes: their corresponding typed section configurations.
- Produces: reusable responsive sections with no embedded locale copy and no visual change to the English fixtures.

- [ ] **Step 1: Write failing input-isolation tests**

For each component, provide a small Chinese fixture and assert that only fixture content renders. For story sections, assert alternating image/copy order on desktop, image-first DOM reading order on mobile, exact bullets, configured CTA href, and intrinsic image dimensions. For proof, assert empty testimonials do not create a testimonial section and customer rows contain every configured logo exactly once before duplication for animation.

- [ ] **Step 2: Run the four targeted specs and verify failure**

Run:

```bash
npm test -- --watch=false --browsers=ChromeHeadless \
  --include='src/app/components/index/app/home-story-sections.component.spec.ts' \
  --include='src/app/components/index/app/home-ecosystem.component.spec.ts' \
  --include='src/app/components/index/app/home-industries.component.spec.ts' \
  --include='src/app/components/index/app/home-proof.component.spec.ts'
```

Expected: FAIL because story sections do not exist and the other components still own their English data.

- [ ] **Step 3: Implement the generic story component**

Render `HomeStorySectionConfig[]` with semantic headings, optional paragraphs/bullets/CTA, explicit image dimensions, `loading="lazy"`, and stable modifier classes for left/right visual alignment. Use CSS Grid for desktop and one column below 900px.

- [ ] **Step 4: Move existing child data behind required inputs**

Convert the ecosystem/grant/features, industries slides, customer logos, and testimonials to inputs. Keep existing selection, scroll, dialog, show-more, animation, and accessibility behavior. Use empty arrays as a valid no-section state; do not supply English defaults inside a component.

- [ ] **Step 5: Pass all four targeted specs**

Run the Task 5 test command.

Expected: PASS with exact fixture content, optional sections, customer counts, equal testimonial cards, and existing interaction coverage.

- [ ] **Step 6: Commit the remaining configurable sections**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-story-sections UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-industries UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-proof UI/src/app/components/index/app/home-story-sections.component.spec.ts UI/src/app/components/index/app/home-ecosystem.component.spec.ts UI/src/app/components/index/app/home-industries.component.spec.ts UI/src/app/components/index/app/home-proof.component.spec.ts UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts
git commit -m "refactor: configure shared homepage sections"
```

### Task 6: Move the English Homepage onto the Shared Template

**Files:**
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/home-page-content.en.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html`
- Modify: `UI/src/app/components/index/app/home-page-template.component.spec.ts`

**Interfaces:**
- Consumes: the shared config interfaces and components from Tasks 2–5.
- Produces: `ENGLISH_HOME_PAGE_CONFIG`, the canonical explicit English homepage configuration.

- [ ] **Step 1: Add a failing English parity test**

Render `CustomHomeComponent` and assert the current H1, intro, two CTA labels/behaviors, four hero industries, seven connected solution options, six features, four industry slides, 76 unique customer logos, four testimonials, grant link, review link, and request-demo form. Assert the hidden legacy copy bank remains present and hidden.

- [ ] **Step 2: Run the parity test before migration**

Run: `npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-page-template.component.spec.ts'`

Expected: FAIL on the shared-template expectation while the old inline homepage is still present.

- [ ] **Step 3: Build the explicit English configuration**

Move the current English hero industries, connected solutions, grant/features, four industries, 76 customers, and four testimonials into `ENGLISH_HOME_PAGE_CONFIG`. Preserve every existing string, link, image, alt, dimension, data ID, and ordering.

- [ ] **Step 4: Replace the visible English markup with the shared template**

Set `readonly pageConfig = ENGLISH_HOME_PAGE_CONFIG` in `CustomHomeComponent`, keep its metadata and `openDialog()`, and reduce visible markup to:

```html
<app-home-page-template
  [config]="pageConfig"
  (requestDemo)="openDialog()">
</app-home-page-template>
```

Keep the hidden legacy copy bank after the shared component so the existing English content contract remains intact.

- [ ] **Step 5: Run English component and content tests**

Run:

```bash
npm test -- --watch=false --browsers=ChromeHeadless \
  --include='src/app/components/index/app/home-*.component.spec.ts'
npm run test:site-content
```

Expected: PASS with no English visual/content regression and no changed locked phrases/routes.

- [ ] **Step 6: Commit the English migration**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index UI/src/app/components/index/app
git commit -m "refactor: render homepage from shared template"
```

### Task 7: Migrate the Chinese Landing Page with Exact Existing Content

**Files:**
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/home-page-content.zh.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.ts`
- Replace: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.html`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.css`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.spec.ts`
- Modify: `UI/scripts/cn-home-content-contract.mjs`

**Interfaces:**
- Consumes: the shared template contract and the exact legacy Chinese content manifest.
- Produces: `CHINESE_HOME_PAGE_CONFIG` and the migrated `/cn-f&b-restaurant-cloud-pos-system` route.

- [ ] **Step 1: Expand the Chinese component test before replacing markup**

Mock `Title`, `Meta`, `MatDialog`, and `CommonFunctionService`. Test the exact title/meta description, one H1, Chinese hero copy, seven solution labels and routes, all story/PSG/feature/customer content, no known English fallback heading, no duplicate IDs, WhatsApp href, and demo behavior:

```ts
component.openDialog();
expect(dialog.open).toHaveBeenCalledWith(CNModalRequestDemoComponent, { width: '600px' });
expect(title.setTitle).toHaveBeenCalledWith('APPZPOS云端智能POS餐饮系统 收银系统 | 新加坡餐厅运营首选');
```

- [ ] **Step 2: Run the Chinese component test and verify the template expectation fails**

Run: `npm test -- --watch=false --browsers=ChromeHeadless --include='client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.spec.ts'`

Expected: FAIL because the route still uses duplicate legacy markup rather than the shared template.

- [ ] **Step 3: Build `CHINESE_HOME_PAGE_CONFIG` from the locked source**

Copy content mechanically from the legacy template into typed objects. Preserve exact text, hrefs, images, alt values, ordering, and embedded English. Use only existing Chinese content for hero, seven solutions, story sections, grant, six features, customers, and conversion form. Do not add English industries or testimonials when no Chinese counterpart exists.

- [ ] **Step 4: Replace the duplicate legacy template**

Use one shared component:

```html
<app-home-page-template
  [config]="pageConfig"
  (requestDemo)="openDialog()">
</app-home-page-template>
```

Keep `CustomHomeCNComponent` metadata, `BindURL_Image`, and `openDialog()` behavior. Remove obsolete `#webview`/`#mobile_view` rules from only the Chinese component stylesheet after confirming no remaining selector use.

- [ ] **Step 5: Point the content contract at the new configuration and compiled template sources**

Change only file discovery in `cn-home-content-contract.mjs`; keep every locked expectation unchanged. Add assertions that the route template contains `app-home-page-template`, the old duplicate view IDs are absent, and `CHINESE_HOME_PAGE_CONFIG` contains no homepage-only English fallback headings.

- [ ] **Step 6: Run Chinese preservation and component tests**

Run:

```bash
npm run test:cn-home-content
npm test -- --watch=false --browsers=ChromeHeadless \
  --include='client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.spec.ts'
```

Expected: PASS with the same manifest counts and exact dialog/metadata behavior.

- [ ] **Step 7: Commit the Chinese migration**

```bash
git add 'UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system' UI/scripts/cn-home-content-contract.mjs
git commit -m "feat: apply homepage template to Chinese landing page"
```

### Task 8: Responsive, Accessibility, Tracking-Hook, and Production Verification

**Files:**
- Modify: `UI/src/app/components/index/app/home-page-template.component.spec.ts`
- Modify: `UI/scripts/site-content-contract.mjs` only if the refactor changes source-file discovery without changing locked content.
- Modify: `UI/scripts/site-runtime-contract.mjs` only if a shared-template selector replaces a route-specific selector.
- Inspect without changing: `UI/src/app/services/shared_function/google-helpers.services.ts`
- Inspect without changing: `UI/src/app/services/shared_function/facebook-pixelsetting.service.ts`

**Interfaces:**
- Consumes: both completed route configurations.
- Produces: verified desktop/laptop/tablet/mobile rendering and a documented boundary between preserved source hooks and externally configured live analytics.

- [ ] **Step 1: Add responsive iframe tests for both locales**

Copy all `document.styleSheets[].cssRules` into the iframe test document. Test widths `1450`, `1280`, `1024`, `820`, `768`, `430`, `390`, and `320`. For each route assert:

```ts
expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);
expect(allTouchTargets().every((rect) => rect.height >= 44)).toBeTrue();
expect(duplicateIds()).toEqual([]);
expect(sectionTopPositions()).toEqual([...sectionTopPositions()].sort((a, b) => a - b));
```

At desktop/laptop assert intended two-column sections; at tablet/mobile assert image/copy stacks and the connected-solutions options remain scrollable/keyboard usable. Simulate reduced motion and assert continuous animations are disabled.

- [ ] **Step 2: Run the responsive tests and fix only shared-template regressions**

Run: `npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/components/index/app/home-page-template.component.spec.ts'`

Expected: PASS at all eight widths for both locale configurations.

- [ ] **Step 3: Verify source tracking hooks**

Use source assertions to confirm GTM `GTM-N7VKTGG`, Meta Pixel `892134809204935`, `connect.facebook.net`, CTA legacy classes, `data-track-*`, `requestdemo`, form control names, and submit handlers remain present. Record in the test output that external GTM selector rules and live event firing are outside source-only verification.

- [ ] **Step 4: Run the complete verification suite**

Run:

```bash
npm run test:site-content
npm run test:cn-home-content
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
npm run test:site-runtime
git diff --check
```

Expected: all contract scripts, component tests, and production build pass. Existing Angular size warnings may remain, but there must be no new build error, test failure, missing phrase/route/hook, or whitespace error in touched files.

- [ ] **Step 5: Review the final diff for accidental content edits**

Compare the Chinese config against the Task 1 manifest and confirm every difference from the original HTML is either duplicate responsive markup removal or wrapper/styling replacement. Confirm `UI/package-lock.json` and unrelated dirty files were not staged.

- [ ] **Step 6: Commit verification-only changes**

```bash
git add UI/src/app/components/index/app/home-page-template.component.spec.ts UI/scripts/site-content-contract.mjs UI/scripts/site-runtime-contract.mjs
git diff --cached --quiet || git commit -m "test: verify shared multilingual homepage"
```

- [ ] **Step 7: Stop before deployment**

Report the test/build results, preserved content counts, known pre-existing warnings, and the remaining limitation that live GTM firing requires GTM Preview or a connected browser. Do not push or deploy without a separate user request.
