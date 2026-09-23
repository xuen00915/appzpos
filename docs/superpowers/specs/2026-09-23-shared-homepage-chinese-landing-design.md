# Shared Homepage Template — Chinese Landing Page

## Objective

Turn the approved English homepage into a reusable Angular page template and apply that template to the existing Chinese F&B POS landing route. The Chinese page must adopt the homepage's visual system, section rhythm, responsive behavior, and interaction patterns while keeping its existing wording exactly as written.

This work is a structural and visual migration. It is not a translation, copywriting, SEO rewrite, route change, or analytics redesign.

## Approved Content Rule

- Preserve every visible Chinese phrase from the current Chinese landing page verbatim.
- Do not translate English homepage copy to fill gaps.
- Do not rewrite, shorten, normalize, or improve the Chinese wording.
- Preserve intentional English wording already present in the Chinese page, including the PSG eligibility paragraph and product names.
- Remove duplicated desktop/mobile copies only after the same exact wording is represented once in responsive shared markup.
- If a homepage section has no corresponding content in the Chinese page, omit that section from the Chinese configuration rather than invent content.

## Architecture

Create a shared, data-driven homepage template that composes the existing homepage presentation into configurable sections. Both routes use the same template and section components:

- the English homepage supplies the current English content as its configuration;
- the Chinese F&B landing page supplies content extracted from its existing template without wording changes;
- optional sections are rendered only when their configuration exists;
- shared components own layout and interaction, while route components retain page-specific metadata, dialog behavior, and content configuration.

The shared template must not decide the language from the URL and must not contain hard-coded translation logic. Its input is a typed page configuration so future language or campaign pages can reuse the same layout without copying markup.

## Shared Page Contract

Introduce typed configuration models for the reusable page shell and its sections. The root contract includes:

```ts
export interface HomePageTemplateConfig {
  language: 'en' | 'zh';
  hero: HomeHeroConfig;
  solutions?: HomeSolutionsConfig;
  grants?: HomeGrantConfig;
  features?: HomeFeatureSectionConfig;
  industries?: HomeIndustrySectionConfig;
  customers?: HomeCustomerSectionConfig;
  testimonials?: HomeTestimonialSectionConfig;
  conversion?: HomeConversionConfig;
}
```

Nested interfaces carry plain content, asset references, links, accessible labels, and button labels. They do not contain route-component callbacks. CTA actions are emitted as semantic events or represented as links so the consuming route remains responsible for opening its correct demo dialog.

English defaults must be explicit configuration data rather than fallback strings inside shared presentation components. This prevents accidental English text from appearing on the Chinese route.

## Section Mapping for the Chinese Page

The current Chinese landing content maps into the homepage template as follows:

### Hero

- Keep the exact H1: `APPZPOS POS系统云端智能POS餐饮系统高达50%政府津贴折扣`.
- Keep the exact supporting paragraph, `预约免费演示`, and `WhatsApp联系我们` labels.
- Keep the existing desktop and mobile hero assets, expressed through one responsive picture/visual configuration rather than duplicate markup.
- The demo CTA continues to open `CNModalRequestDemoComponent`.
- The WhatsApp URL and message remain unchanged.

### Connected Solutions

Use the homepage's interactive connected-solutions/window presentation with the seven existing Chinese modules:

- 收银机 / 电子点餐
- 网站点餐系统
- 扫码点餐系统
- 自助点餐机
- 排队叫号系统
- KDS厨房系统
- 外卖订单中心

Each module keeps its existing description, image, and destination URL. Desktop, tablet, and mobile use the same data and responsive markup; the legacy duplicate desktop/mobile blocks are removed.

### Product and Operations Content

Present the existing Chinese product sections in the homepage's standardized content width, typography, spacing, image treatment, and responsive stacking. Preserve the current headings, paragraphs, bullet text, images, links, and ordering, including:

- 客制化POS软件与硬件 / 餐车，档口，餐厅都适用
- 统一管理POS餐饮系统 / 高效经营，实现最大化盈利

### PSG Grant

Reuse the homepage grant-panel layout while preserving the Chinese landing page's existing two headings, both eligibility paragraphs, image, grant link, and `了解更多` label exactly.

### Key Features

Reuse the homepage key-features layout for `APPZPOS的优势`. Preserve the six existing feature titles, descriptions, bullet text, images, and order. The presentation follows the current homepage cards/dividers at each responsive breakpoint.

### Customers and Conversion

Use the shared customer presentation only with the logo data already present on the Chinese page and keep the heading `我们的客户`. The bottom conversion area uses the Chinese route's existing form or CTA wording and preserves its submission/dialog behavior. No English testimonial or form wording is introduced where the Chinese page has no matching content.

## Route Responsibilities

`CustomHomeCNComponent` retains:

- route `/cn-f&b-restaurant-cloud-pos-system`;
- title `APPZPOS云端智能POS餐饮系统 收银系统 | 新加坡餐厅运营首选`;
- its existing meta description;
- `BindURL_Image` asset resolution;
- `CNModalRequestDemoComponent` and its 600px dialog configuration;
- existing external URLs and target behavior.

The English homepage route retains its current title, metadata, demo dialog, URLs, and content. Neither route redirects to the other.

## Tracking and Tag Preservation

- Preserve existing element IDs, CTA classes, href values, form control names, and submit handlers wherever they are used as tracking hooks.
- Preserve the site's GTM and Meta Pixel loader code unchanged.
- Preserve `data-*` hooks currently used by homepage interaction tests and potential analytics selectors.
- Add stable locale-independent `data-track-*` attributes to shared CTAs where the old English and Chinese markup use different classes, without removing the old hooks.
- Do not claim that externally configured GTM selectors still fire solely from source inspection; verify available source hooks and document any selector-risk caused by unavoidable DOM consolidation.

## Responsive and Accessibility Requirements

- One semantic H1 per route.
- Semantic sections labelled by their headings.
- Preserve useful image alternative text and intrinsic dimensions.
- No duplicate `id` attributes from the old desktop/mobile markup.
- No separate `#webview` and `#mobile_view` content banks; CSS controls responsive layout from one DOM structure.
- Desktop and laptop follow the approved homepage width and two-column arrangements.
- Tablet and mobile stack sections in reading order with no horizontal page overflow.
- Interactive solution tabs remain keyboard accessible, expose selected state, and associate controls with their visible panels.
- Touch targets remain at least 44px high.
- Respect `prefers-reduced-motion` for automatic or continuous motion.

## Preservation Guard

Before modifying the Chinese template, extract a content manifest containing:

- visible headings, paragraphs, list items, and button labels;
- all internal and external href values;
- image filenames and alt text;
- page title and meta description;
- form controls and event handlers;
- known tracking IDs, classes, and data attributes.

After migration, compare the rendered configuration/template against this manifest. Differences are allowed only for duplicate responsive copies and obsolete wrapper-only text-free markup. Any wording difference is a failure.

The existing English homepage content contract remains active. Add a Chinese landing content contract rather than weakening or replacing the English guard.

## Testing Strategy

Follow test-driven development:

1. Add a Chinese content-contract test that captures all unique visible phrases, routes, CTA labels, image assets, SEO metadata, and dialog behavior before migration.
2. Add shared-template tests for optional sections, locale data, CTA event emission, semantic headings, and absence of fallback English text.
3. Refactor the English homepage to consume the shared template and confirm all existing homepage component tests remain green.
4. Migrate the Chinese landing page to the same template and configuration.
5. Verify the exact Chinese wording and link manifest after duplicate desktop/mobile copies are consolidated.
6. Test desktop, laptop, tablet, and mobile layout for section order, overflow, touch targets, solution selection, and responsive images.
7. Verify the Chinese demo CTA still opens `CNModalRequestDemoComponent` and the WhatsApp/solution/grant links remain unchanged.
8. Run the full Angular test suite, production build, English content contract, and Chinese content contract.
9. Inspect the compiled bundle for the existing analytics markers and report that live tag firing still requires external GTM/browser validation.

## Scope Boundaries

- Do not translate or create copy.
- Do not change the Chinese route, title, meta description, CTAs, form behavior, or product links.
- Do not alter global analytics loaders or IDs.
- Do not deploy, merge, or publish as part of this implementation unless separately requested.
- Do not migrate unrelated solution or industry pages.
