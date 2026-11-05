# Git sync and website revisit — 5 November 2026

Fetched origin. The working branch and remote main were already at 1931006; local main was four commits behind and was fast-forwarded without conflicts.

Reviewed the deployed site across all 20 public routes at 1440, 768, 390 and 320px. All 80 checks showed no horizontal overflow, broken visible images or text-family outliers. The published Manrope system remains consistent.

Two scoped corrections followed the review:

- Mobile floating contact/back-to-top controls now yield to the existing form-visibility state so they do not cover form fields. Header and in-page contact actions remain available; the shortcuts return away from forms and remain available on desktop.
- The BCRS article's main title is now H1, with its existing title styling retained. Updated the corresponding regression-script selector.

Verified desktop keyboard navigation, mobile solution navigation, solution Explore/Demo actions, grant FAQ expansion, phone form clearance, desktop shortcut visibility, article layout at four widths and demo-dialog open/close. No form was submitted. Production build passed with existing warning-level budgets; whitespace check passed.
