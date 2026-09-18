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

## API access

`UI/src/app/services/shared_function/api.service.ts` contains the shared HTTP service. Application startup retrieves configuration data from `/api/IndexController/GetConfigurationValues` and stores it through the shared configuration service.

The application requires access to the configured AppzPOS backend for server-driven content and settings.

## Generated and local files

Git excludes dependency folders, Angular caches, compiled output, operating-system metadata, and ZIP archives. Recreate dependencies and production files with `npm ci` and `npm run build`.
