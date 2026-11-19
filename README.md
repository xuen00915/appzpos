# AppzPOS web UI

This repository contains the Angular storefront and marketing website for AppzPOS. The application includes shared website components and customer-specific pages for point-of-sale products, restaurant systems, retail, salons, integrations, and blog content.

## Technology

The application uses:

- Angular 17
- Angular Material and Angular CDK
- TypeScript 5.3
- RxJS 7.8
- Canvas HTML theme assets
- Jasmine and Karma for unit tests

## Prerequisites

Install the following tools before starting development:

- Node.js 20 LTS
- npm, included with Node.js

## Run the application locally

Install the dependencies from the Angular project directory:

```bash
cd UI
npm ci
```

Start the development server:

```bash
npm start
```

Open [the local AppzPOS application](http://localhost:4200/) in your browser. The development server reloads the page when source files change.

## Build the application

Create a production build:

```bash
cd UI
npm run build
```

Angular writes the build output to `UI/dist/e-commerce/`.

Create a development build that watches for changes:

```bash
cd UI
npm run watch
```

## Run the tests

Run the Karma unit test suite:

```bash
cd UI
npm test
```

## Configure the application

Runtime settings are defined in `UI/src/environment.ts`. The current configuration connects to `https://appzpos.com` and includes the application version and analytics identifiers.

Review these values before building for another environment. Do not commit credentials or private tokens to this file.

## Understand the repository structure

```text
appzpos/
├── UI/
│   ├── client_specifc/   # Customer-specific components and routes
│   ├── src/
│   │   ├── app/          # Shared components, modules, pipes, and services
│   │   ├── assets/       # Canvas theme files, images, fonts, and media
│   │   ├── environment.ts
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── README.md         # Angular CLI reference
└── README.md
```

The directory name `client_specifc` is retained for compatibility with the existing Angular imports.

## Application routing

Shared routes are configured in `UI/src/app/modules/app-routing.module.ts`. They include the home, about, contact, reservation, order, and profile flows.

Customer-specific routes are configured in `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app-routing.module.ts`. They include:

- Industry pages for restaurants, retail stores, and salons
- Product pages for ordering, kiosks, kitchen displays, and queue systems
- POS features, hardware, partner integrations, and grant information
- Demo request and contact pages
- Blog pages
- The Google Ads landing page (`/lp/restaurant-pos-system-singapore`, see below)

## Google Ads landing page

The repository includes a focused landing page for Google Ads traffic:

- **Route:** `/lp/restaurant-pos-system-singapore`, declared in `custom-app-routing.module.ts`
- **Live URL (GitHub Pages):** <https://xuen00915.github.io/appzpos/lp/restaurant-pos-system-singapore/>
- **Ad keyword:** "Restaurant POS System in Singapore" appears above the offer headline, "POS software for less than S$2 a day."
- **Component:** `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/landing-pos-singapore/`
- **Styles:** `UI/src/styles/_appzpos-landing.scss`. Every selector uses the `lp-` prefix. A single `$lp-radius` token sets the corner radius for the whole page.
- **Tests:** `UI/src/app/components/index/app/landing-pos-singapore.component.spec.ts`

What the page contains, in order: a slim top bar (logo, WhatsApp, Get a Free Demo), a one-screen hero with the demo form, the EDGE Grant packages, the six product modules, the EDGE Grant band, three steps, a ten-question FAQ in two columns, a final call to action and a compact footer.

Behaviour to keep in mind when editing:

- The hero uses the user-supplied S$660 software price, showing the equivalent S$1.81/day over 365 days explicitly. This is a daily cost comparison, not a daily billing option. Hardware packages retain their separate pricing; the software offer does not state a grant deduction or renewal price.
- The site header and footer are hidden while the page is shown (the component toggles `body.appz-landing`). The floating WhatsApp bubble stays, the Messenger bubble becomes a phone-call link (`tel:+6583109631`) and is restored when the visitor leaves, and all floating controls share one size and gap.
- The form is the shared `CustomRequestDemoComponent` in `compact` mode (name, email and mobile number only). Other pages are unchanged. The shared form posts to the production `SendEmail` API, so do not submit test enquiries.
- The page sets `noindex, nofollow`. The sitewide Google Tag Manager container and Meta Pixel still load through the hidden header. No landing-specific Ads conversion action exists yet.
- The 4.8 Google rating is a static value copied from the Google Business Profile listing. Update it by hand in `landing-pos-singapore.component.ts` when the listing changes.
- Facts on the page (up to 50% EDGE Grant support, the five packages, the supported delivery platforms) come from existing site copy. Keep the qualifier "support levels vary by activity" next to grant claims.

### Deploy the landing page (GitHub Pages only)

`.github/workflows/deploy-pages.yml` builds the app with `--base-href /appzpos/` and publishes it to GitHub Pages when a change reaches `main`. `UI/scripts/prepare-github-pages.mjs` writes a real `index.html` for the landing route, with the landing title, description and `noindex` in the static HTML, so the ad URL returns HTTP 200 instead of the Pages 404 fallback that Google Ads rejects.

This workflow has no cPanel, Vodien, FTP or SSH step. Landing page changes must never touch `appzpos.com` or `website.appzpos.com`.

## Landing page price comparison draft

The landing page includes a responsive comparison of four selected SMEs Go Digital listings, in the same order as the source screenshot. Static figures are transcribed from the user-supplied screenshot dated 18 November 2026: APPZPOS S$1,660, Getz S$3,120, Ellie S$3,250 and Yumstone S$4,025. The section follows the screenshot’s purple featured column and alternating rows, attributes the data to IMDA, and offers a “View more on IMDA” link to the official APPZPOS listing. Package inclusions differ. It does not claim market-wide cheapest pricing or highest ratings. Comparison ratings are from SMEs Go Digital, separate from the existing Google rating.

The IMDA page blocks third-party iframe embedding (`X-Frame-Options: SAMEORIGIN` and restricted `frame-ancestors`, checked 18 November 2026), so this is a native static section, not a live embed. Refresh figures against the source before publishing price changes.

## References

- [SMEs Go Digital solution listing: APPZPOS F&B Point of Sales](https://smesgodigital.gov.sg/web/solution/20240028/appzpos-f-b-point-of-sales). The public SMEs Go Digital (IMDA) listing for this product, solution ID 20240028. Check the EDGE Grant and "IMDA pre-approved" wording on the website and the landing page against this listing.

## API access

`UI/src/app/services/shared_function/api.service.ts` contains the shared HTTP service. Marketing pages render from bundled public branding in `ConfigService` and local page content. Startup makes no `GetConfigurationValues` or `GetHomePageDetails` request, so disabling those endpoints cannot block the homepage or landing page. No operational POS configuration is downloaded or cached by this marketing build.

Enquiry forms still use `/api/WebSiteController/SendEmail`. Requests are asynchronous, time out after 15 seconds and are never retried automatically. Only the explicit success response clears the form. Failed, timed-out or malformed responses preserve entered details and display a WhatsApp contact alternative; repeat clicks are blocked while a request is pending.

Some existing images are still hosted at `appzpos.com/admin/Upload/`. API independence does not guarantee those images remain available if the entire hosting domain is offline.

## Generated and local files

Git excludes dependency folders, Angular caches, compiled output, operating-system metadata, and ZIP archives. Recreate dependencies and production files with `npm ci` and `npm run build`.
