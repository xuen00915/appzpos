# Solution page refinement — 1 November 2026

Scope: the seven shared product solution pages, Hardware and Features. Validated locally before the user-authorised GitHub Pages publication.

The legacy Canvas feature-box padding and generic 38px image rule reduced icon width to 24px. The shared solution refinement layer now resets those inherited dimensions and margins, presenting 72px square icons on desktop/tablet and 56px on phones. Feature descriptions use a consistent blue icon family, left-aligned headings, restrained dividers and balanced rows. Narrow screens place icons alongside text and keep floating shortcuts out of the reading area; inline contact actions and the header demo link remain available.

Hardware uses four/two-column product grids, consistent image stages and corrected Bootstrap gutters. Removed 29 inline image-width limits so the stylesheet can control image sizing. Features uses the shared page width and readable, left-aligned card text. Product copy, assets, routes, CTA destinations and tracking hooks were preserved.

Validation: production build passed with the existing warning-level budgets. All nine routes checked at 1440, 768, 390 and 320px: no horizontal overflow, no broken visible images and all feature icons at least 56px square. A 1920px check also passed. POS hardware filtering returned 16 → 2 printers → 16. Hardware and Features demo dialogs opened. Tracking preservation test passed; git diff --check passed. The first final-pass browser run was interrupted by live reload while normalizing an edited file; only the two interrupted catalogue routes were rerun successfully.

Files: UI/src/styles/_appzpos-solution-refinements.scss, its import in UI/src/custom-theme.scss, and hardware template inline-width cleanup.
