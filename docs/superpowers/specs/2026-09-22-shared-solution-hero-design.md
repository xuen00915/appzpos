# Shared Solution Hero — POS/E-Waiter Pilot

## Objective

Create one reusable Angular hero component for APPZPOS solution pages and pilot it only on the existing POS/E-Waiter route. The pilot must reproduce the approved light product-launch direction: the module-specific diagram appears on the left and the existing solution title appears on the right.

This change is intentionally limited to the hero. All POS/E-Waiter content below the hero remains in its current component template, and the other six solution pages remain unchanged.

## Approved Visual Direction

- Use the light APPZPOS product-launch treatment selected as option A.
- Use the supplied POS/E-Waiter illustration showing a waiter taking an order at a customer table and a cashier operating a counter POS system.
- Place the illustration on the left and the existing title on the right at desktop and tablet widths.
- Stack the illustration above the title on mobile.
- Retain the pale blue background, subtle grid, restrained blue-to-orange accent rule, navy title, and gentle island shadow used by the current solution heroes.
- Do not use the old dark photographic banner.
- Do not place wording inside the illustration.

## Component Boundary

Add a shared `SolutionHeroComponent` under the client-specific components directory. It owns only:

- hero semantic markup;
- responsive illustration/title layout;
- hero styling and reduced-motion behavior;
- accessible image and heading attributes.

It does not own page metadata, routing, body content, feature grids, hardware sections, forms, floating contact widgets, or tracking.

## Typed Input Contract

The component receives one immutable configuration object:

```ts
export interface SolutionHeroConfig {
  headingId: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}
```

The title is rendered as normal Angular text, not `innerHTML`. Responsive wrapping is controlled by CSS so the exact wording remains accessible and searchable.

The POS/E-Waiter component exposes a readonly configuration using its existing heading:

`APPZPOS Cutting-Edge POS Point of Sales and E-Menu System`

## POS/E-Waiter Integration

Replace only the current inline `.solution-island-hero` block with:

```html
<app-solution-hero [config]="solutionHero"></app-solution-hero>
```

The rest of `cloud-pos-point-of-sales-system.component.html` stays byte-for-byte unchanged unless formatting is required immediately around the replaced block.

The supplied illustration is copied into the local ecosystem assets directory and optimized as WebP. The shared component uses explicit image dimensions to prevent layout shift.

## Responsive and Motion Behavior

- Desktop: two balanced columns, illustration left and title right.
- Tablet: retain two columns with reduced gaps and type size.
- Mobile: one column, illustration first and centered title second.
- No page-level horizontal overflow.
- Use only `transform` and `opacity` for the existing subtle float treatment.
- Disable continuous floating under `prefers-reduced-motion: reduce`.

## Accessibility

- Render a semantic `<section>` labelled by its `<h1>`.
- Bind `aria-labelledby` to the configured heading ID.
- Require descriptive alternative text and intrinsic image dimensions.
- Preserve one and only one page-level H1.
- Keep visible keyboard and navigation behavior outside the hero unchanged.

## Preservation Requirements

- Preserve the POS/E-Waiter route and all content below the hero.
- Preserve the existing SEO title and meta description.
- Preserve all CTA links and request-demo behavior.
- Preserve GTM `GTM-N7VKTGG`, Meta Pixel `892134809204935`, and `connect.facebook.net`.
- Do not migrate or alter the other solution-page heroes in this pilot.
- Do not publish or deploy the change.

## Testing Strategy

Follow test-driven development:

1. Add a failing shared-component test that verifies semantic markup, configured title, local image, intrinsic dimensions, and accessible labelling.
2. Change the existing POS solution-hero test to require `app-solution-hero` and the supplied POS/E-Waiter asset while verifying the exact H1.
3. Confirm those tests fail for the missing shared component and old inline hero.
4. Implement the minimal shared component and POS integration.
5. Run the targeted tests, then the complete Angular suite.
6. Build the production application and run the existing content contract.
7. Extend the browser regression to confirm the POS hero is left/right on desktop and tablet, stacked on mobile, image-loaded, and overflow-free.
8. Verify the compiled bundle still contains all analytics markers.

## Future Migration

After the POS/E-Waiter pilot is visually approved, each remaining solution page can adopt the same component by supplying its own `SolutionHeroConfig`. That later migration is explicitly outside this implementation.
