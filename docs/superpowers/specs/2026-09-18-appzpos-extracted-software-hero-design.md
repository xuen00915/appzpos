# APPZPOS Extracted Software Hero Design

## Scope

Redesign only the first homepage hero in the existing Angular application. Preserve the header, floating WhatsApp and Messenger widgets, demo-dialog behavior, WhatsApp URL, every route, and all homepage content after the hero.

## Product composition

Keep `appzpos-pos-terminal-reclined.png` as stationary physical hardware lying flat at the bottom. Visually mute its built-in display with a precisely aligned dark glass surface. Above it, render a smaller landscape software panel made from Angular HTML and real APPZPOS interface terminology. The panel must read as software rather than a monitor: a thin navy/glass edge, restrained blue edge lighting, one orange accent, minimal tilt, and no stand or hinge.

The desktop panel is 650–850px wide. It sits 120–180px above the visible hardware with a soft light/shadow projection bridging the gap. The product layers dominate the hero; copy remains minimal and centered.

## Copy and actions

- Eyebrow: `SINGAPORE CLOUD POS`
- Headline: `One POS. Every Order.` / `One Connected System.`
- Description: `Cloud POS for F&B, retail and salons—built to keep every outlet in sync.`
- Primary CTA: `Request a Demo`, retaining `openDialog()`
- Secondary CTA: `WhatsApp Us`, retaining the existing `wa.me/6583109631` URL and message
- Industry line: `F&B • RETAIL • SALONS`

## Motion

On load, the physical hardware is already present. At 0.2s its screen surface starts glowing. From 0.4s to 1.6s, an outer wrapper lifts the software panel mostly vertically from `translateY(200px) scale(.94)`, opacity zero, and 5px blur to its final position. From 1.6s to 1.9s it settles with a small overshoot. After 1.9s, an independent inner wrapper begins a ±4px, 4–5 second alternate float. The projection beneath it pulses subtly. No laptop-opening rotation is allowed.

## Industry states

The outer glass panel stays in place while its real UI regions transition through `breaking`, `rebuilding`, and `settled` phases. During break, navigation, workspace, module rail, and summary move 30–100px in controlled directions while fading slightly. Obsolete modules exit with scale `.85`; new modules enter from nearby positions at scale `.9`; all modules then reassemble and settle from scale `1.015` to `1`.

States use only names already present in the project:

- Quick Service: POS System, Website Ordering, Self Order Kiosk, Kitchen Display System (KDS), Queue Number Display
- Restaurant: POS System, Website Ordering, Table QR Ordering, Kitchen Display System (KDS)
- Retail: POS System, Website Ordering, Self Order Kiosk
- Salon: POS System, Website Ordering, CRM, Inventory Management, Payment Integration

A horizontal switcher exposes Quick Service, Restaurant, Retail, and Salon. It advances every seven seconds. The first manual click permanently stops autoplay for that component instance.

## Responsive and accessibility

Fit the hero to approximately one desktop viewport without scroll pinning. At tablet widths, reduce panel size, rise distance, and layer gap. At mobile widths, preserve the flat hardware and extraction effect, use a smaller gap, keep copy and CTAs unobstructed, and make the switcher horizontally scrollable. Prevent horizontal page overflow at 1440, 1280, 1024, 768, 430, and 390 CSS pixels.

With `prefers-reduced-motion: reduce`, replace extraction with a simple fade in at the final position, remove continuous drift and projection pulsing, and crossfade industry content without scatter motion.

## Implementation boundary

Use the existing Angular component, CSS transforms, opacity, and timers. Add no animation dependency. Modify no section after the opening hero.
