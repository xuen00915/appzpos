# Chinese demo CTA scroll

Deployed 20 November 2026 to both live hostnames. Chinese landing-page demo actions scroll to the existing #requestdemo section, leaving sticky-header clearance and focusing its heading. Reduced-motion preference is respected. The Chinese modal-opening code and unused dialog dependency were removed; English popup behavior remains intact.

Build passed with existing budget warnings. Four preview cases and eight deployed cases across 1440px/390px, appzpos.com/www.appzpos.com, smooth/reduced motion passed. Confirmed no Chinese dialog, existing embedded form, no API submissions, no page errors and English dialog still opening. Analytics blocked throughout. Both live Chinese route entry hashes match the package.

Rollback: copy /_forms-review-20261113/live.pre-cn-scroll-20261120.html to live.html. Prior assets retained. Package attached as appzpos-cn-scroll.zip to the live-repair-20261120 GitHub release. Full artifacts: /Users/dmsyx/.codex/appzpos-staging-deployments/20261120-cn-scroll.
