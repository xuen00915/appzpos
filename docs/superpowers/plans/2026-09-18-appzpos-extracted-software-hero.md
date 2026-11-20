# APPZPOS Extracted Software Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved APPZPOS homepage hero where software rises out of stationary flat POS hardware and rebuilds its modules for four business types.

**Architecture:** Extend `CustomHomeComponent` with a small deterministic industry state machine and timer lifecycle. Render the physical asset and software UI as separate template layers, then animate only transforms and opacity through namespaced SCSS.

**Tech Stack:** Angular 17, TypeScript 5.3, Angular template syntax, SCSS, Jasmine/Karma, CSS keyframes and transitions.

**Spec:** `docs/superpowers/specs/2026-09-18-appzpos-extracted-software-hero-design.md`

## Global Constraints

- Change only the opening homepage hero, its component logic, namespaced hero stylesheet, and focused tests.
- Preserve the existing header, floating widgets, routes, all content below the hero, `openDialog()`, and the exact existing WhatsApp URL.
- Reuse `UI/src/assets/images/appzpos-pos-terminal-reclined.png`; generate no hardware.
- Use only existing APPZPOS module/function names.
- Add no dependency and animate only `transform` and `opacity`.
- Support reduced motion and widths 1440, 1280, 1024, 768, 430, and 390.
- Do not commit or push unless the user asks.

---

### Task 1: Define the hero interaction contract

**Files:**
- Modify: `UI/src/app/components/index/app/home-hero.spec.ts`
- Test: `UI/src/app/components/index/app/home-hero.spec.ts`

**Interfaces:**
- Consumes: `CustomHomeComponent`, `activeIndustryId`, `selectIndustry(id, manual)`, and rendered hero DOM.
- Produces: Regression coverage for separate hardware/software layers, real actions, four tabs, autoplay, and permanent manual-stop behavior.

- [ ] **Step 1: Write failing rendering tests**

  Assert a stationary `.appzpos-product-hero__machine`, distinct `.appzpos-software-screen`, `.appzpos-software-screen__projection`, four switcher buttons, exact copy, exact WhatsApp URL, and existing product asset.

- [ ] **Step 2: Write failing timer tests**

  Use `fakeAsync` and `tick(7000)` to assert Quick Service advances to Restaurant. Click Retail, advance at least 14 seconds, and assert Retail remains active.

- [ ] **Step 3: Run the focused spec and verify RED**

  Run `node ./node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include src/app/components/index/app/home-hero.spec.ts` and confirm failures name the missing screen, switcher, and state behavior.

### Task 2: Implement the Angular industry state machine

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.ts`
- Test: `UI/src/app/components/index/app/home-hero.spec.ts`

**Interfaces:**
- Produces: `IndustryId`, `HeroIndustry`, `industryOptions`, `activeIndustry`, `activeIndustryId`, `transitionPhase`, `selectIndustry(id: IndustryId, manual?: boolean): void`, `trackModule(index: number, module: string): string`, and `ngOnDestroy(): void`.

- [ ] **Step 1: Add literal industry data**

  Define the four approved industry states and only their validated module names.

- [ ] **Step 2: Add transition sequencing**

  Set `transitionPhase` to `breaking`, swap the active state after 480ms, set `rebuilding`, and settle after another 720ms. Guard concurrent transitions and clean up every timeout.

- [ ] **Step 3: Add autoplay and manual stop**

  Start a 7000ms interval after initialization. The first manual selection clears it permanently; automatic selection continues cycling until then.

- [ ] **Step 4: Run focused tests and verify the state tests pass**

### Task 3: Render the separated product layers

**Files:**
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html`
- Modify: `UI/src/styles/_appzpos-home-hero.scss`
- Test: `UI/src/app/components/index/app/home-hero.spec.ts`

**Interfaces:**
- Consumes: Task 2 state and existing `openDialog()`.
- Produces: Semantic hero copy, two real actions, industry line, software UI modules, switcher, projection, surface glow, and stationary hardware.

- [ ] **Step 1: Replace only the current hero section markup**

  Keep every node after the closing hero `</section>` byte-for-byte. Add ARIA tab semantics and an `aria-live="polite"` status for the active business type.

- [ ] **Step 2: Render actual APPZPOS interface pieces**

  Use the existing APPZPOS navigation terms Orders, Menu, Tables, Customers, Reports, and Settings; render a POS workspace, order summary, and data-driven module rail inside the glass panel.

- [ ] **Step 3: Preserve exact actions and asset**

  Keep `(click)="openDialog()"`, the existing WhatsApp URL, and `assets/images/appzpos-pos-terminal-reclined.png`.

- [ ] **Step 4: Run focused tests and verify GREEN**

### Task 4: Build the motion and responsive visual system

**Files:**
- Modify: `UI/src/styles/_appzpos-home-hero.scss`
- Test: `UI/src/app/components/index/app/home-hero.spec.ts`

**Interfaces:**
- Consumes: `.is-breaking`, `.is-rebuilding`, and `.is-settled` phase classes plus the layer markup from Task 3.
- Produces: Load extraction, settle, idle drift, projection pulse, module scatter/rebuild, responsive layouts, and reduced-motion behavior.

- [ ] **Step 1: Lay out a one-viewport white hero**

  Keep the copy above a 650–850px screen, a 120–180px visible layer gap, and wider flat hardware partially cropped below the fold.

- [ ] **Step 2: Add extraction and drift wrappers**

  Animate the outer wrapper from `translateY(12.5rem) scale(.94)`, opacity zero, and 5px blur from 0.4–1.6s, settle through 1.9s, then animate only the inner wrapper ±4px over 4.8s.

- [ ] **Step 3: Add phase-specific module motion**

  Move nav left, workspace up, summary right, and the module rail down by 30–100px during break. Fade and scale modules, then reassemble with a small `1.015` settle.

- [ ] **Step 4: Add responsive and reduced-motion rules**

  Reduce scale/gaps at tablet and mobile, horizontally scroll tabs on mobile, prevent body overflow, fade rather than scatter when reduced motion is requested, and retain the core extraction fade.

### Task 5: Verify the production result

**Files:**
- Verify only; no new production files.

**Interfaces:**
- Consumes: completed Tasks 1–4.
- Produces: fresh evidence that the requested hero builds and behaves correctly.

- [ ] **Step 1: Run focused Karma tests**

- [ ] **Step 2: Run the Angular production build**

- [ ] **Step 3: Run `git diff --check`**

- [ ] **Step 4: Inspect 1440, 1280, 1024, 768, 430, and 390 viewports**

  Confirm no horizontal overflow, copy/action separation, visible software/hardware gap, active tabs, manual autoplay stop, demo dialog, WhatsApp link, and unchanged downstream homepage content/widgets.

- [ ] **Step 5: Inspect reduced-motion emulation**

  Confirm the screen fades into its final position, idle drift is disabled, and module changes crossfade.
