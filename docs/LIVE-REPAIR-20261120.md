# Live website repair — 20 November 2026

User explicitly authorized repairing the blank live site after DNS moved to Vodien, then requested appzpos.com show the website.appzpos.com design.

The root served the old index because the tested design rewrite matched only the staging hostname. Added an exact public-route rule for appzpos.com and www.appzpos.com to `/_forms-review-20261113/live.html`. Existing staging rules and site.html remain unchanged; old root fallback retained. No backend, DNS, certificate or analytics-account settings modified.

The live bundle is `main.edf77d588efaa7c5.js`. API and uploaded-image domains point to `https://website-api.appzpos.com`, verified at the existing backend IP with valid HTTPS and a successful CORS preflight. Hardcoded uploaded-image references were updated. Existing APPZPOS measurement/form guard now includes both live hostnames, retaining single conversions, Appzgate exclusion, spam guards and immediate thank-you behavior. Backend API contract is unchanged; actual email delivery is not established by mocked tests.

Rollback: `/home2/appzgate/public_html/appzpos.com/.htaccess.pre-live-20261120`. Restore this as `.htaccess` only if rolling back routing; it restores the previous live fallback and its known blank-page problem. Earlier staging entry/assets remain intact. Keep `.htaccess` at 0644. Deployment IP: 101.100.228.105, user appzgate. This directory now serves production; future changes require production-aware checks.

Build source: tested staging snapshot in the backup release, with this commit's API/image/hostname changes. Local draft landing work was excluded from the deployed compilation. Current branch remains a recovery/deployment source branch, not a merge to main. Package and complete QA artifacts: `/Users/dmsyx/.codex/appzpos-staging-deployments/20261120-live-repair`.

Validation: build passed with existing budget warnings. All 44 deployed desktop/mobile route checks passed without page errors, missing images or overflow. Eight live mocked form scenarios plus one www contact scenario passed, including failure/malformed responses, duplicate submission, immediate thank-you, single Ads/GA4 success and refresh/direct-entry guards. All 44 HTTP route hashes across both live hostnames match the release. Staging entry hash is unchanged. Two API-domain and two measurement contracts passed. Real email delivery and physical Safari were not exercised.
