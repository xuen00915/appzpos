# APPZPOS structural website redesign

Date: 2026-09-21

## Purpose

Rebuild the APPZPOS public website so it has a genuinely different information architecture and visual rhythm from the legacy site. The current homepage POS-machine hero remains unchanged. Everything below that hero, plus the other public routes, moves to a product-led editorial system rather than reusing the existing sequence of Bootstrap grids, equal cards, duplicated desktop/mobile blocks and repeated split rows.

The redesign serves Singapore F&B, retail and salon operators who need to understand how APPZPOS hardware, ordering channels and operational modules work together. The finished site must make APPZPOS feel established, practical and technically connected while keeping its current real content and conversion infrastructure.

## Non-negotiable preservation requirements

- Keep the current homepage hero unchanged, including its APPZPOS POS-machine composition, industry switching, links and animations.
- Preserve every unique piece of existing English and Chinese product wording. Exact duplicate desktop/mobile presentations may be consolidated.
- Preserve all public routes, route destinations, metadata and existing real APPZPOS assets.
- Preserve Google Tag Manager, Google Ads-related tracking, Meta Pixel and their existing initialization paths.
- Preserve WhatsApp, Messenger and Tawk widgets, phone links, forms, demo actions and analytics hooks.
- Do not invent product features, statistics, testimonials, customer names, URLs or grant claims.
- Do not push the redesign to a remote repository unless separately requested.

## Design direction

The selected direction is **Connected product story**.

The design reads as a serious Singapore B2B product site for operators and business owners. It uses a clean industrial-editorial language rather than a conventional SaaS card layout.

- Typography: Manrope for display and body text, with intentional weight changes and compact display tracking.
- Palette: cool white and pale slate surfaces, dark navy typography, APPZPOS blue as the main accent and orange reserved for conversion actions or important highlights.
- Layout: asymmetric grids, generous whitespace, large real product imagery and controlled overlap. Elevation is used only where it communicates interactivity.
- Shape system: 14-16px content surfaces, 8-10px compact controls and pill-shaped primary actions.
- Motion: short mask reveals, subtle image depth, connected-order movement and responsive module switching. Avoid decorative floating objects, excessive glow and continuous movement without purpose.

## Homepage architecture

### 1. Existing hero

The current POS-machine hero remains intact. No structural or visual redesign is applied to it.

### 2. Connected ordering journey

The order-flow experience becomes a shorter, high-impact transition directly after the hero. It remains interactive and communicates how Table QR Ordering, Self Ordering Kiosk, Website Ordering and POS / E-Waiter converge into Queue Number Display, Kitchen Display System and Order Hub.

The scene uses a stronger converging-lanes composition, clickable step controls, the existing skip control and the exact existing seven content blocks. The pinned portion must not trap users in an excessively long scroll.

### 3. APPZPOS product suite

Replace the legacy seven-tab grid with one asymmetric product composition. A real APPZPOS product visual anchors the section. The current module names and copy are reorganized around that visual using a restrained module navigator and one active content area.

The section must make the connection between POS / E-Waiter, Website Ordering, Table QR Ordering, Self Ordering Kiosk, Queue Number Display, Kitchen Display System and Order Hub immediately understandable without rendering seven equal cards.

### 4. Industry stories

F&B, retail and salon content becomes a sequence of large editorial scenes rather than equal industry cards. Each scene uses the current real imagery, heading, descriptions, module links and destinations. Composition varies between industries while retaining a shared type and spacing system.

### 5. Hardware, integrations and PSG

Hardware, partner integrations and PSG information become three visually distinct chapters:

- Hardware uses a product-led visual catalogue with large device imagery.
- Integrations use grouped partner relationships and the existing integration destinations.
- PSG uses a focused grant-information composition that preserves all existing eligibility and funding wording.

These chapters must not repeat the same image-left/text-right layout more than twice in succession.

### 6. Customer proof

Existing customer logos become a restrained horizontal proof rail. Testimonials use one focused quote presentation or a compact controlled carousel instead of multiple equal testimonial cards. No new customer names, quotes or claims are added.

### 7. Conversion ending

The homepage ends with the existing demo form and real contact information in a stronger conversion section. Existing field behavior, submission logic, destinations and analytics remain unchanged.

## Other public-page architecture

### Product and solution pages

Use an asymmetric masthead containing the existing page headline and real product image. Follow with a concise feature index, two varied product-story sections, relevant hardware or integrations and the existing demo form. Repeated equal feature-card rows are replaced with grouped content, editorial compositions or interactive indices.

### Industry pages

Open with a business-specific visual and the existing copy. Continue with the relevant APPZPOS module journey, operational benefits, existing customer proof and the conversion section.

### Hardware and integration pages

Use visual catalogue layouts with larger imagery, grouped specifications and clearer navigation. Long item sets should use category grouping or controlled horizontal exploration instead of dense equal-card grids.

### PSG page

Arrange the existing grant, eligibility and process information as a focused journey. Official wording and destinations remain unchanged.

### Chinese Google Ads landing page

Keep it shorter and conversion-first. Preserve every existing Chinese phrase, contact action, form, metadata and tracking hook. Use a product-focused split layout and bring the conversion form closer to the primary value proposition without removing supporting proof.

### Blog and contact pages

Apply the same typography, spacing, navigation and form system while allowing their information architecture to remain appropriate to editorial and contact content.

## Responsive behavior

Every multi-column section must define explicit behavior for large desktop, laptop, tablet and mobile viewports.

### Large desktop: 1280px and above

- Use the full asymmetric compositions and controlled overlap.
- Keep primary text measures below roughly 65 characters.
- Reserve image dimensions to prevent layout shift.
- Keep navigation on one line.

### Laptop: 1024px to 1279px

- Reduce grid offsets and image overlap without changing content order.
- Keep product navigators visible, but tighten their labels and spacing.
- Preserve the complete connected-order interaction at a reduced scale.

### Tablet: 768px to 1023px

- Convert wide asymmetric sections to balanced two-column or staged vertical layouts.
- Move secondary navigation into horizontally scrollable controls where required.
- Reduce sticky interaction distance and visual complexity.
- Keep CTA and form controls comfortably touchable.

### Mobile: below 768px, verified at 430px and 390px

- Use a strict single-column reading order.
- Keep real product imagery prominent and fully contained.
- Avoid overlaps that depend on desktop whitespace.
- Allow module or industry selectors to scroll horizontally without causing page overflow.
- Keep headings readable, buttons on one line and all interactive targets at least 44px.
- Keep WhatsApp and Messenger widgets operational without covering essential controls.

## Motion and accessibility

- Animate only transform and opacity.
- Use IntersectionObserver, CSS scroll-driven animation or the existing requestAnimationFrame-based order-flow renderer where appropriate.
- Do not add a heavy animation dependency.
- Respect `prefers-reduced-motion: reduce`. Replace staged movement with static placement or short crossfades, remove continuous motion and render the order journey as an accessible static sequence.
- Preserve keyboard navigation, visible focus states, semantic headings and accessible names.
- Maintain WCAG AA contrast for body text, controls and forms.

## Angular implementation architecture

The current 1,600-line homepage template should be decomposed into focused Angular presentation components while keeping existing business logic, links and services intact.

Suggested boundaries:

- `home-order-flow`: connected journey, retaining its existing model and interaction API.
- `home-product-suite`: real APPZPOS module explorer using existing content and assets.
- `home-industries`: editorial F&B, retail and salon stories.
- `home-hardware-integrations`: differentiated hardware, integrations and PSG chapters.
- `home-proof`: customer logos and testimonials.
- Existing request-demo component: preserved and restyled, not reimplemented.

Public-page templates may share structural primitives for mastheads, feature indices, product stories and conversion sections, but each route keeps its current copy, metadata and links. Shared components should accept explicit content inputs rather than infer or invent content.

## Validation

- Characterization tests continue to guard the current hero, unique template wording, routes, CTAs and tracking hooks.
- Component tests cover new selectors, content inputs and responsive interaction behavior.
- Browser regression checks run at 1440, 1280, 1024, 768, 430 and 390 pixels.
- Verify no horizontal overflow, layout shift or console errors.
- Verify GTM, Meta Pixel, WhatsApp, Messenger, Tawk, phone links and demo forms on the homepage, Chinese landing page and representative product, industry, hardware and PSG routes.
- Verify the production Angular build and the complete Jasmine suite before handoff.

## Success criteria

The area below the unchanged hero must no longer resemble the original homepage structure. Visitors should encounter a connected product narrative with varied layout families, real APPZPOS imagery and clear operational flow. Other public pages should feel related to the homepage without repeating one template. The experience must remain coherent and usable on large desktop, laptop, tablet and mobile devices while preserving every existing business-critical integration.
