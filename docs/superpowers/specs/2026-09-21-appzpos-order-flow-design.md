# APPZPOS Homepage Order Flow Section

Date: 2026-09-21

## Purpose

Add a scroll-controlled product story immediately below the existing APPZPOS homepage hero. The section must explain that orders enter APPZPOS through four channels, converge into one queue, move through the kitchen, and arrive at Order Hub while third-party delivery orders join the system.

The section must read as a converging-lanes system diagram. It must not resemble a single character walking through a linear timeline.

## Scope

This change will:

- Insert one new section directly after the current homepage hero and before the existing `#content` section.
- Preserve the current hero, header, routes, links, analytics, floating WhatsApp and Messenger widgets, and all existing homepage sections.
- Add an isolated Angular component for the order-flow scene.
- Use native Angular, inline SVG, CSS transforms, opacity, `IntersectionObserver`, `ResizeObserver`, and `requestAnimationFrame`.
- Avoid new animation dependencies.
- Provide a static seven-step list when reduced motion is requested.

This change will not:

- Rewrite or remove the existing product sections below the new flow.
- Change navigation or route behavior.
- Add invented product claims, statistics, integrations, URLs, or features.
- Add tracking or change existing tracking identifiers.

## Design Direction

The section uses the existing APPZPOS light visual language:

- Warm off-white scene surface within the current white page theme.
- Very dark navy text.
- APPZPOS blue and orange for active-state details.
- Green only for completed order routes and completed steps.
- Stroke-based SVG nodes and figures with restrained shadows.
- One consistent soft corner-radius system matching the homepage hero.

Design settings:

- Design variance: 6
- Motion intensity: 8
- Visual density: 5

The animation is motivated by product storytelling. It shows multiple ordering channels becoming one operational flow.

## Angular Architecture

Create a dedicated `HomeOrderFlowComponent` under the APPZPOS client-specific component area. The component owns:

- The seven product steps and their exact bullet content.
- SVG node and route geometry.
- Scroll progress calculation.
- Active-step calculation.
- Figure positions and visibility.
- Reduced-motion detection.
- Observer and animation-frame cleanup.

Declare the component in `custom-app.module.ts` and render its selector immediately after the current hero closing tag in `index.component.html`.

Keep styles in a dedicated SCSS partial imported by `custom-theme.scss`. Do not add the order-flow styles to the existing hero stylesheet.

## Content Model

The seven caption steps, in order, are:

### 1. Table QR Ordering

- `E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones`
- `Cost Savings - Reduce Printed Menu & dependence on manpower`
- `Online Payment - Multiple integrated payment options for customer to pay securely through mobile`

### 2. Self Ordering Kiosk

- `Contactless Ordering - Allow customers to use the self-service kiosk to browse the menu, place orders, process payments, and reduce their wait times`
- `Interactive Interface - User-friendly touchscreen interfaces allow customers to easily navigate through the ordering process`
- `Secure Payment - Multiple payment options with integrated payment terminals & online payment gateways`

### 3. Website Ordering

- `Online Ordering - Allow customers to place orders online and easily track order status`
- `Order Scheduling - Allow customers reserve or schedule Future Delivery or Pickup Orders`
- `Online Payment - Multiple integrated payment options for customer to pay securely through website`

### 4. POS / E-Waiter

- `Cloud based POS system - access the data anywhere`
- `Easy menu setup - modifiers, promotion items or bundle`
- `Report - Daily Sales, Item Sales, Customer Sales`
- `CRM - collect customer data and offer loyalty programs with tier based`

### 5. Queue Number Display

- `Order Management - An unique queue number is assigned to orders from all ordering portals`
- `Queue Number Display - Syncs with KDS, real time queue number updates when orders are ready for pickup.`

### 6. Kitchen Display System (KDS)

- `Order Tracking - Receive real-time updates for new orders, modifications, or cancellations`
- `Visual Alerts - Color indication to convey the status of orders (e.g., new orders, in progress, completed)`
- `Error Reduction - Minimize order errors`

### 7. Order Hub

- `Centralized Order Management - Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform`
- `Order tracking - Receive real-time order status updates and directly send to POS and KDS systems`
- `Real-time Overview Report - Easily monitor all your delivery, online and in-store orders in one POS system`

No visible product copy may be rephrased.

## Scene Geometry

Use one responsive inline SVG with `viewBox="0 0 1000 460"`.

Nodes:

- Table QR Ordering: `(30, 50)`
- Self Ordering Kiosk: `(30, 160)`
- Website Ordering: `(30, 270)`
- POS / E-Waiter: `(30, 380)`
- Queue: `(420, 215)`
- KDS: `(620, 215)`
- Order Hub: `(860, 215)`
- Delivery apps entry: `(680, 40)`, not numbered

Each numbered node has a circular marker with radius `16`. The delivery entry uses the same visual family with a different accent so it remains clearly separate from the seven numbered steps.

Routes:

- Four straight routes connect the four left entry points to Queue.
- One straight route connects Queue to KDS.
- One straight route connects KDS to Order Hub.
- One straight route connects the delivery entry to Order Hub.

Every route renders as two layers:

1. A muted dashed base line representing untraveled distance.
2. A solid green overlay representing completed distance.

Use `pathLength="1"` so progress can be expressed consistently with `stroke-dasharray` and `stroke-dashoffset` without measuring path lengths.

SVG labels use short titles only. Full product copy remains in the caption panel. Labels are centered above or placed beside nodes with at least 26 SVG units of clearance. Entry labels sit to the right of their nodes to prevent clipping at the left viewBox edge. The delivery label sits to the right of its entry node to prevent clipping at the top edge.

## Scroll Progress Controller

The outer wrapper is approximately `760vh` on desktop and `650vh` on tablet and mobile. Its inner stage is sticky beneath the actual fixed navigation height and fills the remaining dynamic viewport.

Use `ResizeObserver` to measure `#header-wrap` and expose its current height through a component CSS custom property. This prevents overlap when the Canvas header changes between desktop, sticky, and mobile states.

Use `IntersectionObserver` to start a `requestAnimationFrame` measurement loop only while the wrapper intersects the viewport. Each active frame:

1. Reads the wrapper's `getBoundingClientRect()`.
2. Computes the usable scroll distance as `wrapper.height - stage.height`.
3. Computes progress as `clamp(-wrapper.top / usableDistance, 0, 1)`.
4. Updates SVG transforms and route completion using transform and opacity only.
5. Updates Angular caption state only when a progress breakpoint changes the active step.

Stop the frame loop when the section leaves the viewport and cancel it in `ngOnDestroy`.

## Progress Phases

### Phase A: Entry channels, progress `0.00-0.40`

- Show four simple stroke-based stick figures.
- Move all four simultaneously from their entry nodes to Queue using linear interpolation.
- Complete each route behind its figure.
- Apply a small scroll-driven limb swing so the figures read as walking without using time-based animation.
- Hide all four entry figures when progress reaches `0.40`.

### Phase B: Merge, progress `0.40-0.55`

- Show one merged figure at Queue.
- Keep the figure stationary during this interval.
- Use a short opacity and scale settle driven by local phase progress.

### Phase C: Kitchen, progress `0.55-0.75`

- Move the merged figure from Queue to KDS.
- Complete the Queue-to-KDS route behind it.

### Phase D: Order Hub, progress `0.75-1.00`

- Move the merged figure from KDS to Order Hub.
- Move a differently colored delivery rider from the delivery entry to Order Hub simultaneously.
- Complete both routes behind their corresponding figures.
- Both figures arrive at Order Hub at progress `1.00`.

All animation is controlled by scroll position. There are no autoplay timers or infinite animations.

## Active Step Logic

Use the fixed breakpoints:

`[0, 0.10, 0.20, 0.30, 0.40, 0.55, 0.75, 1.00]`

The active step is the interval containing the current progress:

- `0.00-0.10`: Table QR Ordering
- `0.10-0.20`: Self Ordering Kiosk
- `0.20-0.30`: Website Ordering
- `0.30-0.40`: POS / E-Waiter
- `0.40-0.55`: Queue Number Display
- `0.55-0.75`: Kitchen Display System (KDS)
- `0.75-1.00`: Order Hub

The indicator row marks earlier steps complete in green, the current step active in APPZPOS orange and navy, and future steps muted.

The caption panel swaps only when the active index changes. Use a short CSS opacity and transform transition. The transition communicates a state change and does not run continuously.

## Responsive Layout

### Desktop and laptop, `1024px` and wider

- Sticky stage uses a two-column layout.
- The SVG scene receives the larger column.
- The caption panel sits beside it and remains vertically centered.
- Seven indicators remain on one row.
- The complete scene remains visible without horizontal scrolling.

### Tablet, `768px-1023px`

- Use a slightly denser two-column layout when height permits.
- Stack the caption under the scene on shorter viewports.
- Reduce wrapper height while preserving every progress phase.
- Keep the indicator row horizontally scrollable if necessary.

### Mobile, below `768px`

- Stack the SVG above the caption.
- Use `100dvh` calculations so browser chrome does not cause jumps.
- Keep the exact SVG viewBox and node geometry.
- Use non-scaling route strokes and larger SVG label type so labels remain legible after scaling.
- Use short node labels in the scene and full titles in the caption.
- Allow the indicator row to scroll horizontally and keep the active indicator visible.
- Ensure the caption panel fits without overlapping the scene or fixed navigation.

## Reduced Motion

When `prefers-reduced-motion: reduce` matches:

- Do not render the tall wrapper or sticky stage.
- Do not start observers or an animation-frame loop.
- Render all seven steps as a static semantic vertical list.
- Show the step number, exact title, and exact bullets for every step.
- Preserve the same light theme, typography, and content hierarchy.

This is a structural fallback, not merely disabled CSS animation.

## Accessibility

- Use a section heading available to assistive technology.
- Treat the animated SVG as a summarized product-flow figure with a concise accessible label.
- Mark decorative route layers and moving figures `aria-hidden="true"`.
- Expose the active caption as the primary readable description during the animated experience.
- Use an ordered list for the static reduced-motion fallback.
- Ensure active, completed, and future steps differ by text treatment and shape as well as color.
- Maintain WCAG AA contrast for body copy and step labels.
- Avoid focus traps and scroll interception. Native page scrolling remains fully available.

## Performance

- No new runtime dependency.
- No scroll event listener.
- Run measurements only while the section intersects the viewport.
- Animate SVG `transform`, `opacity`, and stroke dash values.
- Avoid animating HTML layout properties.
- Update Angular state only when the active step changes.
- Cancel observers and animation frames on component destruction.

## Failure and Progressive Enhancement

- If `IntersectionObserver` is unavailable, render the static seven-step list.
- If `ResizeObserver` is unavailable, use a safe CSS fallback navigation offset.
- If JavaScript fails before animation initialization, the first caption and complete route diagram remain visible rather than leaving an empty section.
- The existing homepage continues normally after the section.

## Testing

Unit tests will verify:

- All seven titles and every bullet are rendered exactly.
- Progress breakpoints select the correct active step.
- Phase A positions all four entry figures correctly at start, midpoint, and Queue arrival.
- Phase C interpolates Queue to KDS correctly.
- Phase D interpolates both the merged figure and delivery rider to Order Hub.
- Reduced-motion mode renders the static list and does not initialize pinning.
- Observer and animation-frame resources are cleaned up.

Browser regression tests will verify:

- The new section appears immediately after the hero.
- The existing hero, tracking tags, actions, and floating widgets remain present.
- Sticky navigation does not cover the scene.
- Labels do not overlap their node markers at `1440`, `1280`, `1024`, `768`, `430`, and `390` widths.
- The section creates no horizontal page overflow.
- The reduced-motion layout has no tall pinned wrapper.
- The page can continue scrolling normally after the order-flow section.

## Acceptance Criteria

The implementation is complete when:

1. The four ordering channels visibly converge into Queue.
2. Queue continues to KDS and then Order Hub.
3. Delivery-platform orders join independently at Order Hub.
4. The seven captions use the supplied product copy exactly.
5. The animation position is determined by scroll progress rather than elapsed time.
6. Desktop, laptop, tablet, and mobile layouts remain usable and legible.
7. Reduced-motion users receive the complete static seven-step story.
8. Existing homepage behavior and unrelated sections remain unchanged.
9. Unit tests, production build, responsive browser checks, and source formatting checks pass.
