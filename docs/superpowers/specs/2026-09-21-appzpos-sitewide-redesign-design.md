# APPZPOS Site-wide Redesign Design Specification

Date: 2026-09-21

## Objective

Redesign the APPZPOS English marketing website and its Chinese Google Ads landing page into one cohesive, premium, responsive product experience.

The existing homepage hero is explicitly out of scope and must remain visually and functionally unchanged.

## Approved Direction

The approved direction is **Connected Product Story**.

The site should present APPZPOS as one connected platform that brings together customer ordering, POS operations, kitchen workflows, queue management, delivery platforms, hardware, and reporting.

Design read: a premium B2B product website for Singapore F&B, retail, and salon operators, using a clean white interface, strong real-product visuals, APPZPOS blue, restrained orange accents, and purposeful motion.

Design settings:

- Design variance: 7
- Motion intensity: 5
- Visual density: 4

## Non-negotiable Preservation Requirements

### Content

- Preserve every unique piece of existing English and Chinese wording verbatim.
- Do not rewrite, shorten, rephrase, translate, or invent product claims.
- Preserve headings, body copy, feature descriptions, grant information, form labels, legal text, CTA labels, metadata, and accessibility text.
- Exact duplicate content may be rendered once when consolidating separate desktop/mobile blocks or repeated presentations.
- Content can be reorganized into a clearer hierarchy, tabs, accordions, or page sections without changing its wording.
- Do not invent statistics, customers, testimonials, integrations, awards, features, or URLs.

### Navigation, URLs, and SEO

- Preserve every existing public route and route slug.
- Preserve page titles, descriptions, canonical information, structured data, and existing search-critical headings.
- Do not silently redirect, rename, or remove existing pages.
- Keep all destinations reachable from either the primary navigation or footer.
- Preserve the dedicated Chinese Google Ads landing-page route.

### Measurement and conversion

- Preserve Google Tag Manager.
- Preserve Google Ads tags and conversion behavior.
- Preserve Meta Pixel.
- Preserve analytics events, CTA hooks, form identifiers, and submission behavior.
- Preserve existing Request a Demo actions.
- Preserve phone, WhatsApp, and Messenger URLs.
- Keep the floating WhatsApp and Messenger widgets working.
- Compare tracking code and conversion hooks before and after the redesign.

### Brand and assets

- Preserve the APPZPOS logo and existing real product assets.
- Reuse existing APPZPOS screenshots, hardware images, customer logos, and integration assets.
- Do not replace real APPZPOS imagery with generic stock imagery or CSS-drawn hardware.
- Use APPZPOS blue as the main accent and orange selectively.

## Design System

### Theme

- One light theme across the marketing site.
- White and very pale cool-neutral surfaces.
- Very dark navy for primary text.
- APPZPOS blue for primary actions, navigation states, and meaningful highlights.
- APPZPOS orange for selective emphasis only.
- Avoid large dark section changes, excessive gradients, generic glassmorphism, and continuous glow effects.

### Typography

- Use one modern sans-serif family appropriate for a technology product.
- Establish a consistent display, heading, body, caption, and navigation scale.
- Preserve all copy while improving line length, wrapping, and hierarchy.
- Keep Chinese text legible with an appropriate CJK fallback stack.

### Shape and elevation

- Buttons may use a consistent pill or softened rectangular shape.
- Content surfaces use one consistent medium-radius scale.
- Prefer whitespace, alignment, and subtle dividers over placing every item inside a card.
- Shadows communicate actual depth and hierarchy and remain cool-tinted and restrained.

### Components

Create reusable Angular styling and components where they materially reduce duplication:

- Primary header and navigation
- Mobile navigation accordion
- Shared footer
- Section heading pattern
- Primary and secondary buttons
- Product media frame
- Solution selector
- Industry selector
- Feature and benefit presentation
- Trust/logo presentation
- CTA section
- Accessible accordion
- Shared contact and demo form styling

Do not introduce a heavy visual or animation framework.

## Information Architecture

### Desktop header

The reduced primary navigation is:

**Logo | Solutions | Industries | PSG Grant | Resources | POS餐饮系统 | Request a Demo**

Solutions contains:

- POS / E-Waiter
- Website Ordering
- Self Ordering Kiosk
- Kitchen Display System (KDS)
- Queue Number Display
- Table QR Ordering
- Order Hub
- Hardware
- Features

Industries contains:

- F&B Restaurant
- Retail Stores & Boutiques
- Beauty Salons, SPA & Wellness

Resources contains:

- Blog
- Partner Integrations
- Contact

Rules:

- The logo links to the English homepage.
- The redundant Home menu item is removed.
- The existing `POS餐饮系统` wording remains a visible top-level destination because it is an active Google Ads landing page.
- Request a Demo is the primary navigation CTA.
- Menus support keyboard navigation, focus management, Escape dismissal, and touch.
- Desktop navigation stays on one line and within 80px height.

### Mobile header

- Compact logo, menu trigger, and primary demo action.
- Menu groups open as accessible accordions.
- All existing destinations remain reachable.
- Touch targets meet accessibility sizing requirements.
- The navigation cannot cause horizontal overflow.

### Footer

- Acts as the complete site directory.
- Preserves all existing company, contact, social, legal, and destination information.
- Groups links according to the new navigation structure.
- Provides a clear final route to Request a Demo and WhatsApp.

## English Homepage

### 1. Existing hero

- Preserve exactly as currently implemented.
- Do not alter its layout, visual composition, animation, copy, links, or product imagery.
- Only make integration adjustments if required by the new shared header or adjacent section spacing, with no visible redesign.

### 2. Connected order journey

- Replace the current visual styling with a shorter, more premium connected-system story.
- Show the existing ordering channels converging into Queue, KDS, and Order Hub.
- Preserve all supplied and existing step wording verbatim.
- Support both scroll progress and direct numbered controls.
- Avoid an excessively tall pinned section.
- Provide a visible skip action to the next homepage section.
- On reduced motion, present the complete content as an accessible static sequence.

### 3. One platform, selected solution

- Replace duplicated legacy solution tabs and separate mobile markup.
- Present one large real product visual with a compact solution navigator.
- Support POS / E-Waiter, Website Ordering, Table QR Ordering, Self Ordering Kiosk, Queue Number Display, KDS, and Order Hub.
- Selecting a solution changes the associated real visual and existing copy.
- Preserve every unique solution detail and Learn More destination.
- Use one responsive implementation for desktop and mobile.

### 4. Built around your business

- Replace four identical industry cards with one featured industry composition and a selector.
- Cover Quick Service where existing content supports it, F&B Restaurant, Retail, and Salon.
- Show only real APPZPOS modules relevant to each industry.
- Preserve the existing industry wording and destination routes.

### 5. Hardware and integrations

- Use real existing hardware and integration imagery.
- Present physical products and connected partners as one operational ecosystem.
- Preserve all existing hardware and integration claims and links.
- Avoid a generic equal-card catalogue.

### 6. PSG support

- Preserve existing PSG wording and external links.
- Present the section as a concise, high-trust information block within the light page theme.
- Keep the route to the full PSG page and enquiry path clear.

### 7. Customer proof

- Use only existing customer logos, testimonials, or trust content already present in the project.
- Do not invent statistics or endorsements.
- Keep logo presentation clean and accessible.

### 8. Conversion close

- Finish with one strong Request a Demo section.
- Preserve existing CTA wording and behavior.
- Keep WhatsApp available as the secondary path.
- Transition naturally into the shared footer.

## English Page Families

### Solution pages

Applies to POS / E-Waiter, Website Ordering, QR Ordering, Kiosk, KDS, Queue Display, and Order Hub.

- Product-specific introduction using existing copy.
- Real product visual or interface asset.
- Existing capabilities organized into a clearer hierarchy.
- Workflow or operational context when supported by existing content.
- Existing related-product and Learn More links.
- Request a Demo close.

### Solutions overview

- Preserve the existing `/custom-solutions` route and every unique wording item it contains.
- Use the same shared design system while presenting the full solution family as an overview rather than duplicating a detail page.
- Preserve its existing images, links, WhatsApp action, and floating contact widgets.

### Industry pages

Applies to Restaurant, Retail, and Salon.

- Industry-specific introduction.
- Existing operational challenges and APPZPOS solution wording.
- Relevant existing modules.
- Existing images and destination links.
- Conversion CTA.

### Hardware, Features, and Partner Integrations

- Use a more visual product layout.
- Preserve existing specifications, functions, partner names, and links.
- Keep long content scannable with structured groups and accessible disclosure where appropriate.

### PSG Grant

- Establish trust immediately.
- Preserve all grant, eligibility, process, and external portal wording and links.
- Improve reading hierarchy without making new eligibility promises.
- Keep enquiry actions visible throughout long content.

### Contact and Demo

- Preserve field names, order, validation, submission, and tracking behavior.
- Reduce visual friction around the form.
- Preserve telephone, WhatsApp, Facebook, Instagram, and other existing contact details.
- Provide clear validation, focus, loading, error, and success states.

### Blog

- Redesign the listing and article presentation for clearer editorial reading.
- Preserve article content, URLs, dates, metadata, and existing links.
- Do not fabricate authors, categories, or reading times.

## Chinese Google Ads Landing Page

The Chinese page remains a dedicated conversion landing page, not merely a translated copy of the English homepage.

### Purpose

- Maintain strong continuity with its Google Ads promise and audience.
- Focus visitors on booking a demo, calling, or using WhatsApp.
- Preserve the existing Chinese route and every unique Chinese wording item verbatim.

### Structure

- Focused header with APPZPOS logo, contact actions, and an English-site link if already supported.
- Existing Chinese value proposition and government grant wording.
- Real APPZPOS product visual.
- Existing Chinese solution and feature content in a clearer responsive hierarchy.
- Existing trust, grant, and contact information.
- Repeated conversion opportunities using the existing CTA wording.
- Existing Chinese demo modal and form behavior.

### Paid-ad safeguards

- Preserve Google Ads and analytics tags.
- Preserve conversion IDs, event hooks, form IDs, and destination URLs.
- Avoid navigation changes that distract from the conversion objective.
- Keep the primary CTA visible early on mobile.
- Do not alter regulated, grant-related, or offer wording.

## Motion and Interaction

- Motion must explain hierarchy, product relationships, or UI state changes.
- Use CSS transforms and opacity for visual transitions.
- Use IntersectionObserver for entrance states where appropriate.
- Avoid window-level unthrottled scroll handlers.
- Do not add scroll hijacking or long forced pinning.
- Do not add constant decorative movement to every section.
- Hover behavior must have an equivalent focus and touch behavior.
- Respect `prefers-reduced-motion: reduce` across all new motion.

Approved interaction palette:

- Animate the connected-order routes as orders converge into the shared APPZPOS workflow.
- Crossfade and mask-reveal real product imagery when visitors select a solution or industry.
- Use short staggered entrances for related feature groups when they first enter the viewport.
- Give navigation dropdowns a quick opacity and vertical-transform reveal with full keyboard behavior.
- Add restrained depth response to large hardware imagery on pointer-capable devices only.
- Use tactile press feedback and directional arrow movement for primary CTAs.
- Use animated disclosure for long feature and grant sections while keeping all content available in the DOM.
- Give the Chinese landing-page product visual a focused entrance that does not delay its primary CTA.
- Replace all of the above with immediate state changes or simple crossfades under reduced motion.

## Responsive Behavior

Verify at the following viewport widths:

- 1440px
- 1280px
- 1024px
- 768px
- 430px
- 390px

Rules:

- No horizontal overflow.
- No duplicate desktop/mobile content trees where responsive CSS can handle one semantic structure.
- Product imagery scales without clipping important content.
- Touch controls remain reachable and large enough.
- Long selectors can scroll horizontally only when clearly signaled and keyboard accessible.
- Forms and CTA labels do not overflow or wrap unexpectedly.
- Floating WhatsApp and Messenger widgets do not obscure primary content or form controls.

## Accessibility

- Preserve and improve semantic heading order.
- Use landmarks for header, navigation, main content, and footer.
- Provide visible focus styles.
- Ensure keyboard access to navigation, selectors, accordions, and dialogs.
- Preserve useful existing alt text and repair empty or misleading text without changing product claims.
- Maintain WCAG AA contrast for text and controls.
- Ensure form labels and errors are programmatically associated.
- Ensure interactive state is not communicated by color alone.
- Provide reduced-motion behavior.

## Technical Approach

- Continue using the existing Angular component structure.
- Establish shared tokens for color, typography, spacing, radius, shadow, and transition timing.
- Extract reusable presentation patterns where this reduces repetition.
- Remove inline styles and inline mouse event styling as sections are redesigned.
- Preserve component inputs, form bindings, dialog behavior, services, and route configuration unless a compatible refactor is required.
- Avoid new heavy dependencies.
- Keep changes isolated from unrelated application behavior.

## Verification

### Automated

- Production Angular build.
- Existing test suite.
- New regression tests for navigation destinations, preserved copy, homepage hero preservation, and critical conversion links.
- Tracking and tag source comparison.
- Route crawl for all public pages.
- Check for console errors and broken asset requests.

### Visual and interaction

- Capture and inspect each redesigned page family at required viewport widths.
- Verify header dropdowns, mobile navigation, selectors, accordions, modals, and forms.
- Verify reduced-motion rendering.
- Verify all important copy is present.
- Verify the current homepage hero remains unchanged.
- Verify WhatsApp and Messenger widgets remain usable.

### Conversion and SEO

- Confirm GTM, Google Ads, Meta Pixel, and analytics code remains present.
- Confirm existing conversion hooks and form identifiers remain intact.
- Confirm phone, WhatsApp, Messenger, and external grant links.
- Confirm page titles, descriptions, route slugs, and structured data.

## Implementation Sequence

1. Record the content, routes, tags, conversion hooks, and responsive baseline.
2. Create shared design tokens and common page primitives.
3. Redesign the shared header, mobile navigation, and footer.
4. Redesign the English homepage below the existing hero.
5. Redesign solution page families.
6. Redesign industry page families.
7. Redesign Hardware, Features, Integrations, PSG, Contact, and Blog pages.
8. Redesign the Chinese Google Ads landing page with conversion safeguards.
9. Run complete responsive, content, route, tracking, accessibility, and build verification.

## Explicitly Out of Scope

- Redesigning the existing homepage hero.
- Changing APPZPOS product claims or wording.
- Changing URLs or removing public pages.
- Replacing real assets with fabricated product imagery.
- Pushing changes to a remote Git repository without a separate user request.
