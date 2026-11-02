# Solution pages: stronger visual direction

Local revision following the published c425b56 solution refinements. Not published.

All nine solution routes now use larger opening imagery and typography. The seven shared product pages have a navy feature section with a desktop introduction column and an accessible demo shortcut. Product examples alternate images and copy on desktop and stack on phones. Hardware uses a category sidebar and three-column desktop catalogue; Features uses larger alternating product illustrations and photographs.

Verification: all nine routes at 1440, 768, 390 and 320px had no horizontal overflow or broken visible images. Feature icons remain 72px on desktop/tablet and 56px on phones. Desktop and phone screenshots reviewed; corrected inherited subgrid styles that separated product headings from their descriptions. Production build passed with existing warning-level bundle budgets. Git diff whitespace check passed.

The demo shortcut scrolls to and focuses the existing form, respecting reduced motion. No forms submitted during verification. Existing product descriptions, assets and routes retained.

## Scroll continuity — 2 November

Replaced the legacy overflow scroll container with clipping and a flow root so the feature introduction follows the viewport within its section. The hardware category headings use the same correction. Narrow or short screens keep headings in normal flow.

The seven shared feature sections highlight the features passing through the reading area with a blue heading, divider and small icon emphasis. IntersectionObserver runs outside Angular change detection, with no scroll listener, no hidden content and cleanup on route destruction. Reduced motion retains the color cue without icon movement. The production build passed with existing budget warnings.

Browser checks passed on all seven feature routes at desktop and phone widths: heading pin/release, reading focus changes and no horizontal overflow. Also verified the hardware heading, tablet/small-phone widths, short viewport fallback, reduced motion and demo focus. Desktop and phone screenshots reviewed. The scroll assertion uses current section geometry to account for images settling during navigation.

## Product banners — 2 November

All nine Solutions banners now share a standalone banner component: solid APPZPOS blue, shorter product headings, brief product descriptions, a larger illustration stage and three relevant capabilities. Original product illustrations remain local assets. Demo actions scroll to the existing form on the seven product pages and open the existing dialog on Hardware/Features. Explore actions scroll and move keyboard focus to the relevant section, with space below the fixed navigation. Existing page content and scroll-following sections are retained.

Verified all nine banners at 1440, 768, 390 and 320px: one H1, loaded artwork, no horizontal overflow and actions at least 44px high. All nine Explore and Demo actions passed without submitting forms. Desktop overview and mobile screenshots reviewed. Production build, the updated seven-route Angular banner test and tracking-preservation tests passed. The older site-content contract has 68 failures on both HEAD and this revision after accounting for intentional banner copy changes; no new failures. Its unrelated historical copy/homepage expectations remain unresolved.

The design checker misidentified Angular's required `[src]` binding as a missing image. After browser verification of all nine actual assets, added a broken-image ignore scoped only to the new banner component in `.impeccable/config.json`. No real image warning remains open. This iteration is local and unpublished.
