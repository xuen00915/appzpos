# Shared typography — 3 November 2026

The browser audit found Manrope body text mixed with Canvas's Inter heading family, Georgia quote marks and legacy Material/slider font definitions. The new solution banners inherited Inter, while their surrounding copy used Manrope.

Standardized Canvas, Bootstrap, Angular Material, native controls and APPZPOS display tokens on the existing Manrope family. Headings use the shared 700 weight; labels use the existing 500/600 roles and prose keeps its regular weight. Replaced 650/750/760/800 variations with supported 600/700 weights. Removed unused Roboto, PT Serif and 800-weight downloads. Icon fonts and Chinese glyph fallback remain intact. Responsive type sizes, layouts, content and interactions were preserved.

Validation: 20 public routes at 1440 and 390px, with no visible text-family outliers or horizontal overflow. Demo dialog controls use Manrope. Desktop solution and mobile homepage/contact layouts visually reviewed. Production build passed with warning-level existing bundle budgets; the Impeccable typography scan reported no findings and git diff whitespace check passed. Component weight declarations remain compact numeric values to stay inside existing stylesheet budgets.
