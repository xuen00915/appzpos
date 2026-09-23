# Shared industry template

F&B, Retail and Beauty share industry-layout.css, industry-overview.css,
industry-procedures.css, industry-solutions.css and industry-content-width.css.
The historical restaurant-prefixed CSS selectors remain for compatibility.
The old route-local F&B copies are no longer loaded.

All sections use the same 1320px content rail and responsive gutters. Each route
retains its literal wording, metadata, hero photo and conversion actions. The
centered overview title precedes the complete original industry island diagram.
POS solution descriptions stay visible inside borderless white cards, without
Learn More buttons or random illumination. F&B uses its original images with
4/2/1 columns. Retail and Beauty use centered 3/2/1 columns, including incomplete
last rows. F&B and Retail images cover the full upper card area. All reuse the
existing shared bottom enquiry form.

## Industry-specific configuration

- F&B: restaurant-islands.ts, original restaurant artwork; existing five-step
  Restaurant and Quick Service modes and center/right/left diagram handoff.
  Restaurant emphasis is pale orange; Quick Service is pale blue.
- Retail: retail-islands.ts, original retail artwork; shopping, checkout, admin
  and online-order areas; original three-step workflow.
- Beauty: beauty-islands.ts, original salon artwork; reception, salon services,
  admin, kiosk and online-order areas; original seven-step workflow.

Retail and Beauty use appIndustryWorkflow and industry-workflow.css. Their
steps scroll naturally beside a sticky diagram instead of compressing seven
descriptions into a short screen. Each active step zooms to its configured
island without yellow overlays. Optional focusOnSelect enables manual island
focus until the next workflow change. Every description remains visible.
The elaborate F&B handoff stays F&B-specific.

Below 992px, or on touchscreens up to 1366px, workflow diagrams are hidden.
Only the static, non-interactive overview diagram remains, above stacked steps.
Reduced-motion preferences disable camera transitions.

## Reuse and preservation

Import IndustryPageComponent, IndustryIslandsComponent and
IndustryWorkflowDirective into the consuming module. Wrap route content in
app-industry-page and import the shared styles through styleUrls. Keep literal
route copy in HTML. Configure percentage-based island polygons matching the
route's original image, with a unique idPrefix per diagram.

Keep metadata, CTA URLs, form handlers and analytics in their existing owners.
Step anchors ptab1 onward remain. Beauty's duplicated canvas-tab-2 IDs now have
unique accessible IDs. Its existing desktop WhatsApp-labelled brochure URL is
intentionally unchanged pending approval. Removing Learn More buttons removes
those clicks; external GTM selectors require live Preview verification.

## Checks

Run npm run test:site-content and npm run build. Run production-theme responsive
checks with npm test -- --watch=false --browsers=ChromeHeadless
--configuration=responsive --include=src/app/components/index/app/industry-shared-pages.spec.ts
and the equivalent industry-islands.spec.ts for F&B.

Tests check actual form/section geometry without submitting leads. They do not
prove image loading or live analytics firing. The existing suite may emit a
full-page-reload teardown warning; report it separately from assertion results.
