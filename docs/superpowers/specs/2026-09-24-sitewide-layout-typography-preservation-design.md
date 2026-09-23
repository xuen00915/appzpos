# APPZPOS Site-Wide Layout, Typography, and Tracking Preservation Design

## Intent

Create one coherent responsive presentation system for the APPZPOS public website without changing its business content or analytics behavior. The English and Chinese landing-page heroes must each occupy exactly the visible first screen together with the sticky header. Every public page must use the same outer content width and section-heading system. The site must remain usable on laptop, tablet, and mobile screens, and all legacy and current tracking hooks must survive the visual normalization.

The user explicitly selected a shared design-system layer instead of page-by-page overrides or a full component rewrite.

## Success Criteria

1. The sticky header plus `.appzpos-product-hero` is equal to the viewport height within one CSS pixel on both landing pages at 1440×900, 1366×768, 1024×768, 768×1024, 390×844, and 375×667.
2. Hero copy, actions, animated POS device, and industry-dependent function tags remain visible and usable at every target viewport. The page itself has no horizontal overflow.
3. All 19 public routes align their primary content to one 1240px shell on wide screens and use the same responsive page gutters below that width.
4. Top-level section headings and their descriptions use one documented typographic hierarchy. Chinese headings retain additional character spacing.
5. Header navigation and the homepage Hardware and Features labels use Title Case rather than all caps.
6. Existing copy, section order, routes, links, forms, metadata, analytics identifiers, DOM IDs, and tracking hooks are unchanged except for the specifically approved Title Case labels and additive compatibility classes.
7. Existing automated content, runtime, Chinese parity, responsive, and Angular test suites pass, with new regression coverage for this work.

## Current-State Evidence

The rendered baseline was audited before this design was written.

- At 1440×900, the English hero is 976px high and the header plus hero is 1052px. The Chinese hero is 1045px high and the header plus hero is 1121px.
- At 390×844, the English header plus hero is 764px and the Chinese header plus hero is 787px, so both underfill the visible screen.
- Public layouts currently mix approximately 1240px, 1320px, 1392px, and 960px outer widths.
- Section headings currently range from approximately 36px to 55px and use conflicting weights, line heights, and letter spacing.
- The current 19-route desktop and mobile audit found no page-level horizontal overflow. That behavior is a preservation requirement.
- The original landing-page markup at baseline commit `b6db172` contains `#requestdemo`, `.btn-whatsapp`, `.btn-fb`, the original WhatsApp and Messenger destinations, Google Tag Manager `GTM-N7VKTGG`, and Meta Pixel `892134809204935`.
- The shared landing-page template preserves the contact destinations and `#requestdemo`, but its new floating contacts do not carry the original `.btn-whatsapp` and `.btn-fb` compatibility classes.

## Architecture

### 1. Shared Shell and Spacing Tokens

`UI/src/styles/_appzpos-design-system.scss` remains the single source of truth for public-page layout tokens. Introduce these canonical values:

- `--appz-shell-width: 1240px`
- `--appz-page-gutter: clamp(16px, 3vw, 32px)`
- `--appz-header-height: 76px`
- `--appz-section-space: clamp(52px, 6vw, 84px)`

Keep `--appz-container` and `--appz-content-width` as aliases to `--appz-shell-width` during this change so legacy component styles keep working. Do not delete either legacy token.

The canonical shell equation is:

```css
width: min(
  calc(100% - (var(--appz-page-gutter) * 2)),
  var(--appz-shell-width)
);
margin-inline: auto;
```

Apply that equation to `.appzpos-container`, `.appz-section`, `.solution-island-hero__inner`, conversion panels, homepage section wrappers, industry content, hardware, features, partners, blogs, and header internals. Existing `.container` markup can remain; compatibility selectors normalize its outer width without requiring a site-wide DOM migration.

The shared shell governs outer alignment, not every inner line length. Paragraphs may remain capped by `--appz-reading-width: 65ch`, and media/proof elements may be intentionally narrower inside the shell. No route may introduce a second wider outer container.

### 2. Exact One-Screen Bilingual Heroes

The shared `home-hero` component continues to render both English and Chinese hero content. No bilingual markup is duplicated.

The hero uses a viewport equation rather than fixed minimum heights:

```css
.appzpos-product-hero {
  block-size: calc(100vh - var(--appz-header-height));
  block-size: calc(100svh - var(--appz-header-height));
  block-size: calc(100dvh - var(--appz-header-height));
  min-block-size: 0;
}
```

The later `dvh` declaration follows the currently visible mobile viewport while the earlier declarations provide browser fallbacks. The sticky header remains in normal document flow at 76px, so header plus hero equals one viewport. Existing breakpoint rules that reintroduce fixed `min-height` values are removed or changed to height-aware sizing.

The hero frame uses the shared 1240px shell and a constrained grid/flex layout. Copy, actions, device, and function tags scale with `clamp()` and height media queries for approximately 900px, 768px, and 667px viewport heights. On narrow screens, function tags remain a touch-scrollable single row after the device instead of widening the document. The POS screen animation, active-industry state, and state-dependent tags remain unchanged.

No hero content may be hidden to pass the fit test. `overflow: hidden` may still clip decorative backgrounds, but it must not clip semantic copy, actions, the device, or the function-tag row. Reduced-motion behavior remains supported.

### 3. Section Typography System

The broad `#content h2` rule is too inclusive because it also catches card, FAQ, package, and article headings. Replace it with a top-level section-title contract plus explicit compatibility selectors for legacy public sections.

The shared section-title values are:

- Font family: `var(--appz-font)` (`Manrope` with current fallbacks)
- Size: `clamp(1.9rem, 2.7vw, 3rem)`
- Weight: `750`
- Line height: `1.08`
- English letter spacing: `-.04em`
- Chinese letter spacing: `.055em` on larger screens and `.05em` below 768px
- Wrapping: balanced where supported

The shared section-description values are:

- Size: `clamp(1rem, 1.2vw, 1.1rem)`
- Weight: `400`
- Line height: `1.65`
- Letter spacing: `0`
- Maximum measure: `65ch`
- Wrapping: pretty where supported

Alignment remains contextual. Centered section introductions stay centered, and split-section introductions stay left aligned. The type scale and spacing do not change with alignment.

The section-title contract excludes hero `h1` elements, card titles, FAQ questions, package labels, article-body headings, modal headings, and form labels. Those remain at their component scale.

### 4. Title Case Scope

Change only these user-approved all-caps interface labels to Title Case:

- Header navigation `HARDWARE` → `Hardware`
- Header navigation `FEATURES` → `Features`
- Homepage eyebrow `SOFTWARE + HARDWARE` → `Software + Hardware`
- Homepage eyebrow `KEY FEATURES` → `Key Features`

Apply the header changes to every active header variant so route-specific headers do not disagree. Preserve all URLs, route checks, `aria-current` bindings, menu structure, and descriptive subtitles.

These four intentional copy changes must be reflected in the visible-copy contract. No other business wording changes are in scope.

### 5. Tracking and DOM Compatibility Contract

The implementation may add classes or shared style hooks, but it must not remove or rename existing tracking-relevant attributes. Preserve:

- Google Tag Manager container `GTM-N7VKTGG`
- Meta Pixel `892134809204935`
- `#requestdemo`
- Exact English and Chinese WhatsApp URLs and their prefilled messages
- Exact Messenger URL and its prefilled message
- `.btn-whatsapp` and `.btn-fb`
- Existing `data-track-cta` values
- Route titles and meta descriptions
- Request-demo form field `name` attributes and submission behavior
- Existing route URLs, CTA destinations, section anchors, `aria-*` attributes, and link targets

Add `.btn-whatsapp` to the shared floating WhatsApp contact and `.btn-fb` to the shared floating Messenger contact as additive class bindings. Retain the newer `.appz-home-floating-contact--whatsapp` and `.appz-home-floating-contact--messenger` classes. Scope styling to the newer component classes so adding the legacy classes does not import unrelated legacy appearance.

The current sticky-header Request Demo, telephone, WhatsApp, and Messenger controls remain functional and in their approved order. Their destinations are not changed by this project.

### 6. Responsive Behavior

Desktop and laptop layouts use the full shared shell when space allows. Tablet layouts collapse multi-column content without changing the outer gutter. Mobile layouts use at least 16px gutters, preserve touch targets of at least 44px, and allow long Chinese and English text to wrap without clipping.

The following behavior is invariant across breakpoints:

- Sticky header remains visible and does not obscure anchor targets.
- Header menus remain keyboard accessible.
- Landing-page contact controls do not collide with the back-to-top control.
- Industry switching continues to update the POS screen and function-tag content.
- No public page has horizontal document overflow.
- Section titles do not rely on forced line breaks for responsive layout.

## Public Route Coverage

The runtime contract covers these 19 public routes:

1. `/`
2. `/custom-solutions`
3. `/point-of-sales-demo-quotation`
4. `/f&b-restaurant-cloud-pos-system`
5. `/retail-store-cloud-pos-system`
6. `/salon-cloud-pos-system`
7. `/psg-pos-system-grant-singapore`
8. `/cloud-pos-point-of-sales-system`
9. `/f&b-restaurant-emenu-qr-code-ordering-system`
10. `/f&b-restaurant-online-ordering-website`
11. `/self-order-kiosk-restaurant`
12. `/f&b-restaurant-kitchen-display-system`
13. `/f&b-restaurant-queue-number-display-system`
14. `/f&b-restaurant-delivery-integration`
15. `/pos-hardware-machine-receipt-printer`
16. `/pos-solutions-partner-integrations`
17. `/cn-f&b-restaurant-cloud-pos-system`
18. `/blog`
19. `/blog-bcrs`

## Validation Strategy

### Test-First Changes

Before production styles or templates change, add failing tests for:

1. The shared 1240px shell token and legacy token aliases.
2. Section-title and description tokens, including Chinese tracking.
3. Title Case labels in active header variants and homepage configuration.
4. Additive `.btn-whatsapp` and `.btn-fb` classes on the shared floating contacts.
5. Exact tracking IDs, URLs, messages, `#requestdemo`, `data-track-cta`, metadata, and form hooks.
6. English and Chinese header-plus-hero viewport fit.
7. Horizontal overflow and shell alignment across all 19 routes.

### Rendered Viewports

Run rendered regression coverage at:

- 1440×900
- 1366×768
- 1024×768
- 768×1024
- 390×844
- 375×667

For both landing pages, `abs((header height + hero height) - viewport height)` must be at most 1px. For all routes, `document.documentElement.scrollWidth` must not exceed the viewport width by more than 1px. At desktop widths, measured primary shells must not exceed 1240px; below the shell breakpoint they must match the viewport minus the shared gutters.

### Required Verification

- Angular unit tests
- Production Angular build
- Site visible-copy/content contract
- Site runtime contract across all 19 routes
- Chinese homepage content contract
- Chinese/English shared-template parity regression
- Hero screen-fit regression
- Footer responsive regression
- New site-wide shell and typography regression

Third-party Tawk CORS messages and existing Uniicons font-decoding warnings are recorded separately. They are not accepted as reasons to ignore application exceptions, failed resource requests for first-party assets, layout overflow, or test failures.

## Expected Files

The implementation plan may refine exact line locations, but work is expected in these focused areas:

- `UI/src/styles/_appzpos-design-system.scss` — canonical shell and typography tokens
- `UI/src/styles/_appzpos-home-hero.scss` — exact viewport hero layout
- `UI/src/styles/_appzpos-marketing-pages.scss` — compatibility normalization for legacy public layouts
- `UI/src/styles/_appzpos-features.scss`, `_appzpos-partners.scss`, `_appzpos-blog.scss` — shell alignment where local selectors currently own width
- Homepage, hardware, industries, and header component styles/templates that currently override the shared shell
- `home-page-template.component.html` — additive legacy floating-contact classes
- Header templates and English homepage configuration — approved Title Case labels
- Angular specs and runtime/content regression scripts — preservation and responsive assertions

## Non-Goals

- No redesign of the approved visual identity, colors, component order, imagery, or animation language.
- No route, analytics provider, contact destination, form workflow, or business-copy rewrite.
- No framework upgrade, dependency installation, or full component migration.
- No deployment in this task unless the user separately requests it after the Git result is verified.

## Rollback and Failure Handling

Each implementation task must be committed independently after its focused tests pass. If a legacy page cannot consume the shared shell without a layout regression, keep the shared token and add the smallest route-scoped compatibility selector; do not fork the entire design system. If exact hero fit conflicts with readable content at a target viewport, reduce responsive gaps and media scale first, then heading scale within the approved clamp range. Hiding semantic content or changing tracking markup is not an acceptable fallback.
