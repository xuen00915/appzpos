# APPZPOS website and API migration handover

Prepared 20 November 2026. Preparation only; no production, DNS, backend or hosting changes applied.

## Intended result and implemented API change

Visitors to `https://appzpos.com` should see the design currently served at `https://website.appzpos.com`. The two changes supplied in the IT screenshots are already present in the staging build and backup source:

```ts
serverDomain: "https://appzpos.com",     // uploaded image origin
apiserverDomain: "https://appzpos.com",  // backend API origin
```

`CommonFunctionService.BindURL_API()` reads `apiserverDomain`. `BindURL_Image()` still reads `serverDomain`. Both properties are build-time values in `UI/src/environment.ts`; editing source on the server alone does not update an existing compiled bundle. Rebuild and deploy the resulting assets if either changes.

Current enquiry endpoint: `POST https://appzpos.com/api/WebSiteController/SendEmail`. Shared forms retain the `ContactUs` payload envelope. Confirmed success requires `APIResponse.Message` to equal an empty string, including supported JSON-string-wrapped responses. Failures retain input; no automatic retry should duplicate email sends. Page rendering no longer requires the configuration/homepage startup APIs.

## Hosting contract for retaining the current API URL

IT must choose and implement the final hosting arrangement before switching traffic. With the API URL unchanged, the server or gateway answering `appzpos.com` must route these requests independently:

| Request | Required destination |
| --- | --- |
| Marketing routes and their static assets | Tested new website build |
| `/api/*` | Existing working application backend; never the Angular HTML fallback |
| `/admin/Upload/*` | Existing uploaded-image store, or an explicitly migrated equivalent |
| Other existing backend/admin routes | Preserve according to IT's inventory; do not overwrite with the marketing fallback |

DNS maps the hostname, not individual URL paths. If DNS moves to the staging host, it does not automatically preserve the old backend. Configure a verified backend upstream before that move. Do not proxy to the same public `appzpos.com` hostname after repointing it, which could loop. The observed old IP `4.193.116.8` is evidence of current DNS, not a verified permanent upstream or TLS configuration.

Alternative: IT provides a separate HTTPS API hostname. Update `apiserverDomain`, rebuild, and configure backend CORS for the actual website origins and JSON POST/preflight requests. Uploaded images still require their own preserved routing or an updated `serverDomain`. No alternative API hostname has been supplied yet.

## Required website promotion work

The API split alone is not full production readiness. The current deployment deliberately restricts these behaviors to `website.appzpos.com`:

1. Namespaced entry rewrites in staging `.htaccess`. Prepare equivalent public-route handling on the destination while excluding backend paths; do not copy host-restricted rules unchanged.
2. `UI/src/app/services/shared_function/staging-measurement.ts`: its exact-host guard owns corrected APPZPOS Ads mappings, excludes Appzgate reporting and prevents duplicate legacy Ads tags. For the approved production release, preserve this behavior for the actual production hostnames or correct the shared GTM rules and remove the adapter coherently. Do not run both conversion owners together.
3. `LeadSubmissionService` and contact/demo components use that guard for spam protection, immediate thank-you navigation and success markup. Promotion must retain the tested behavior; simply changing DNS leaves the guard false on production.
4. Serve HTTPS for approved public hostnames, choose the canonical hostname, and check canonical URLs, sitemap/robots, internal navigation, asset paths and direct thank-you routes.

Current authorization remains staging-only. The above production changes are outstanding release work for the authorized migration, not changes made by this preparation.

## Release source and rollback

Recovery source branch: `backup/staging-complete-20261120`. Release: https://github.com/xuen00915/appzpos/releases/tag/staging-backup-20261120 . Use the separately attached tested staging source as the baseline for a production candidate; the workspace snapshot also contains draft landing work. Reconcile newer main changes deliberately. Do not assume main contains all staging behavior.

Current staging entry references `main.29755e39b3f92626.js`. Previous entry: `/_forms-review-20261113/site.pre-api-domain-20261120.html`. Archived packages preserve older hashed assets. Before migration, IT should also back up production files, routing, backend configuration and any affected data; the GitHub staging archive is not a production database/server backup.

## Acceptance before and after cutover

Before DNS changes, test the production candidate using the intended hostname against the destination in an isolated browser or hosts override. Check all public routes at desktop/mobile, API routing and images, certificate validity, and exact-host tracking behavior. Intercept enquiry requests and analytics for rehearsals. Confirm contact, embedded and popup success/failure, single conversion per success and no refresh conversion. Verify API responses are API responses rather than HTML from a fallback.

IT must separately verify a controlled real enquiry reaches the intended mailbox under explicit approval; mocked tests cannot prove email delivery. Verify reporting delivery under an approved test plan. Keep the old hosting/backend available through cutover and propagation. Define rollback for traffic routing and website files; reverting a frontend entry alone cannot undo a DNS/backend change.

## Recheck evidence

Current staging checks and limitations are recorded in `migration-readiness-20261120/` alongside this document. Tests use mocked submissions and blocked analytics. No live enquiries, calls or messages were sent. Physical iOS Safari and actual mail/reporting delivery are outside these checks.
