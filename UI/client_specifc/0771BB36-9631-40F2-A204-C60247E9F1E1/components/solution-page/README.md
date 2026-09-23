# Shared solution page

POS/E-Waiter, Table QR Ordering, Website Ordering, Self Ordering Kiosk, Kitchen
Display, Queue Number Display, and Order Hub use this template. Import the standalone `SolutionPageComponent`
in the route's module (or standalone component imports).

```html
<app-solution-page>
  <app-solution-hero solutionHero [config]="solutionHero"></app-solution-hero>
  <section class="pos-overview">...</section>
  <div class="container pos-feature-section">
    <app-solution-feature-heading
      title="Your solution features"
      description="A short introduction to this solution's features.">
    </app-solution-feature-heading>
    <div class="pos-feature-grid">...</div>
  </div>
  <section class="pos-system-showcase">...</section>
  <section class="container pos-hardware">...</section>
  <div class="appz-conversion-panel" id="requestdemo">
    <app-custom-request-demo></app-custom-request-demo>
  </div>
  <div solutionFloating>...</div>
</app-solution-page>
```

The shell owns the single `#content` anchor and `.content-wrap`. Import
`SolutionFeatureHeadingComponent` alongside the shell for the reusable,
responsive feature section title and description. Project sections directly;
do not add another content wrapper. Sections are optional. The existing
`pos-*` layout primitives are shared in `src/styles/_appzpos-solution-page.scss`;
their visual overrides and compact spacing are scoped to `app-solution-page` in
`src/styles/_appzpos-marketing-pages.scss`. They support four/two/one feature
columns, four/two hardware columns, and stacked showcase cards on mobile.

Keep route-specific copy, metadata, hardware filtering, anchor IDs, CTA URLs,
tracking classes, and the existing form component in the consuming page.
Projection preserves their Angular bindings and event handlers. The shell does
not load analytics scripts or fire conversion events; the existing site-wide
tracking remains the single source. Hero device targets must match section IDs.

Hardware and Features pages are excluded. Other routes can adopt the layout
individually without changing their public URLs or content. Existing mobile and
desktop copy variants on the migrated pages remain in responsive wrappers to
preserve their original wording. `solution-detail-grid` and `solution-hardware-grid`
provide the shared supporting layouts for those pages.

Supporting cards share image, heading and description rows on desktop, with
natural-height images and independent stacked layouts on mobile. Hardware
images and names are centered. Descriptions scale from 17px to 19px. Image
panels are transparent; multiply blending visually removes white image canvases
against the section surface without changing the original assets or links.

Place `app-solution-hardware-filters [grid]="hardwareGrid"` immediately before
the hardware grid and add `#hardwareGrid` to that grid. Import the standalone
`SolutionHardwareFiltersComponent`. Controls appear only when the total product
count exceeds five, not based on the filtered result count. Categories and sizes
come from product titles; explicit `data-hardware-category` and
`data-hardware-sizes` metadata can override those defaults. Existing POS controls
are projected with `[existingControls]="true"` to retain all configuration filters.
Filtering only hides cards; product links and tracking attributes remain intact.
