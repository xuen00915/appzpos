# POS Machine Hero Implementation Plan

> **For agentic workers:** Implement task-by-task with a red/green test cycle and fresh verification before completion.

**Goal:** Replace the duplicated desktop/mobile slider hero with one responsive, product-led APPZPOS hero centered on a premium POS terminal.

**Architecture:** Keep the existing Angular component and its demo-dialog behavior. Replace only the opening hero markup, add namespaced component CSS, and store the generated terminal image under the compiled `src/assets` tree so deployment remains self-contained.

**Tech Stack:** Angular 17 template, component-scoped CSS, Jasmine/Karma, generated PNG asset.

**Spec:** Approved 2026-09-18 direction based on the supplied visual reference and the generated section reference at `/Users/dmsyx/.codex/generated_images/01a0b32f-0d7a-7b93-ab9f-53dc5463ce0c/exec-4a139aff-f122-4f70-80f4-f38195a11a54.png`.

## Global Constraints

- Preserve all homepage content after the current hero.
- Preserve `openDialog()` and the existing WhatsApp destination.
- Keep all headline, feature, and CTA copy as semantic HTML.
- Use one responsive hero instead of separate desktop/mobile markup.
- Add no dependency and do not change tracking tags.
- Do not commit or push unless the user asks.

---

### Task 1: Define the hero's user-visible contract

**Files:**
- Create: `UI/src/app/components/index/app/home-hero.spec.ts`

**Interfaces:**
- Consumes: `CustomHomeComponent` and its existing `openDialog()` method.
- Produces: A browser-rendered assertion for the hero heading, product image, and primary action.

- [x] **Step 1: Write the failing component test**

  Render `CustomHomeComponent`, query `.appzpos-product-hero`, and assert the approved heading, descriptive terminal image, and `Request a demo` control are present.

- [x] **Step 2: Run the focused test to verify it fails**

  Run: `node ./node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include src/app/components/index/app/home-hero.spec.ts`

  Expected: FAIL because `.appzpos-product-hero` does not exist in the old slider markup.

### Task 2: Implement and verify the responsive hero

**Files:**
- Create: `UI/src/assets/images/appzpos-pos-terminal-hero.png`
- Create: `UI/src/styles/_appzpos-home-hero.scss`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html`
- Modify: `UI/src/custom-theme.scss`

**Interfaces:**
- Consumes: The generated RGBA terminal asset and existing `openDialog()` method.
- Produces: A responsive `<section>` with live copy, feature callouts, an accessible product image, and working demo/WhatsApp actions.

- [x] **Step 1: Add the generated asset to `src/assets/images`**

  Copy the selected RGBA image without altering the generated original.

- [x] **Step 2: Replace only the opening slider markup**

  Use a semantic heading, concise copy, existing CTA behavior, four feature callouts, and one descriptive product image.

- [x] **Step 3: Add namespaced responsive CSS**

  Implement the ice-blue studio surface, off-grid desktop composition, subtle connector lines, hover/focus states, stacked mobile layout, and reduced-motion support.

- [x] **Step 4: Run the focused test to verify it passes**

  Run the same focused Karma command and expect one passing spec.

- [x] **Step 5: Build and inspect**

  Run the production Angular build, serve `dist/e-commerce`, and inspect desktop and mobile first-view layouts. Confirm the rest of the homepage remains below the hero and both CTAs remain usable.
