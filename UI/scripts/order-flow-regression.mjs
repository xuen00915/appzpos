import { mkdirSync, writeFileSync } from 'node:fs';

const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4300/';
const screenshotDirectory = process.env.APPZPOS_SCREENSHOT_DIR;
const chromeEndpoint = `http://127.0.0.1:${cdpPort}`;
const viewports = [1440, 1280, 1024, 768, 430, 390];
const failures = [];

const target = await fetch(
  `${chromeEndpoint}/json/new?${encodeURIComponent(`${previewUrl}?ecosystem-regression`)}`,
  { method: 'PUT' }
).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 0;

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  message.error ? reject(new Error(message.error.message)) : resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  }
  return result.result.value;
};

await send('Page.enable');
await send('Runtime.enable');

for (const width of viewports) {
  const height = width <= 430 ? 844 : width <= 768 ? 1024 : 900;
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width <= 768,
    screenWidth: width, screenHeight: height
  });
  await send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });
  await send('Page.navigate', { url: `${previewUrl}?ecosystem-regression-${width}` });
  await wait(900);
  await evaluate(`document.querySelector('.appz-ecosystem')?.scrollIntoView({ block: 'center' })`);
  await wait(1200);

  const layout = JSON.parse(await evaluate(`JSON.stringify((() => {
    const section = document.querySelector('.appz-ecosystem');
    const host = section?.closest('app-home-order-flow');
    const hero = document.querySelector('.appzpos-product-hero');
    const ecosystemLayout = document.querySelector('[data-ecosystem-layout]');
    const stage = document.querySelector('.appz-ecosystem__stage');
    const details = document.querySelector('[data-island-details]');
    const detailsHeading = details?.querySelector('.appz-ecosystem__details-header h2');
    const content = document.querySelector('#content');
    const svg = document.querySelector('.appz-ecosystem__connections');
    const islands = [...document.querySelectorAll('[data-ecosystem-island]')];
    const islandModules = [...document.querySelectorAll('[data-island-module]')];
    const contactForms = [...document.querySelectorAll('#requestdemo app-custom-request-demo form')];
    const contactFields = [...document.querySelectorAll('#requestdemo .appz-demo__field input')];
    const heading = section?.querySelector('h2');
    const hubLogo = document.querySelector('[data-ecosystem-hub-logo]');
    const integratedTitle = document.querySelector('#ecosystem-title');
    const hardwareWhatsapp = document.querySelector('[data-hardware-whatsapp]');
    const grant = document.querySelector('.ecosystem__grant');
    const grantVisual = document.querySelector('.ecosystem__grant-visual');
    const grantImage = grantVisual?.querySelector('img');
    const grantCopy = document.querySelector('.ecosystem__grant-copy');
    const features = document.querySelector('.ecosystem__features');
    const featureList = document.querySelector('.ecosystem__feature-list');
    const featureEntries = [...document.querySelectorAll('.ecosystem__feature-entry')];
    const customerGrid = document.querySelector('.proof__customer-grid');
    const customerItems = [...document.querySelectorAll('.proof__customer-grid > li')];
    const adminLabel = document.querySelector('[data-island-id="admin"] .appz-ecosystem__label')?.getBoundingClientRect();
    const kioskImage = document.querySelector('[data-island-id="kiosk"] img')?.getBoundingClientRect();
    const kioskLabel = document.querySelector('[data-island-id="kiosk"] .appz-ecosystem__label')?.getBoundingClientRect();
    const queueImage = document.querySelector('[data-island-id="queue"] img')?.getBoundingClientRect();
    const box = stage?.getBoundingClientRect();
    const lineCount = (element) => {
      if (!element) return 0;
      const range = document.createRange();
      range.selectNodeContents(element);
      return [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0).length;
    };
    return {
      exists: Boolean(section && host && hero && stage && svg),
      placement: hero?.nextElementSibling?.tagName?.toLowerCase(),
      nextSectionId: host?.nextElementSibling?.id,
      contentOrder: [...(content?.children ?? [])].slice(0, 3).map((element) => element.tagName.toLowerCase()),
      productSuitePresent: Boolean(document.querySelector('app-home-product-suite')),
      heading: heading?.textContent.trim(),
      headingSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : 0,
      islandCount: islands.length,
      islandModuleCount: islandModules.length,
      islandModuleTitles: islandModules.map((module) => module.querySelector('strong')?.textContent.trim()),
      islandLabelsVisible: islands.every((island) => getComputedStyle(island.querySelector('.appz-ecosystem__label')).opacity === '1'),
      hubCount: document.querySelectorAll('[data-ecosystem-hub]').length,
      hubLogo: {
        loaded: Boolean(hubLogo?.complete && hubLogo?.naturalWidth > 0),
        src: hubLogo?.getAttribute('src')
      },
      connectionCount: document.querySelectorAll('[data-ecosystem-connection]').length,
      svgText: svg?.textContent.trim(),
      loadedImages: islands.filter((island) => {
        const image = island.querySelector('img');
        return image?.complete && image?.naturalWidth > 0;
      }).length,
      hrefs: islands.map((island) => island.dataset.route),
      moduleTabCount: document.querySelectorAll('[data-module-tab]').length,
      modulePanelCount: document.querySelectorAll('[data-module-panel]').length,
      persistentDetails: details?.parentElement === ecosystemLayout,
      defaultDetailsTitle: detailsHeading?.textContent.trim(),
      detailsHeading: {
        whiteSpace: detailsHeading ? getComputedStyle(detailsHeading).whiteSpace : null,
        overflows: detailsHeading ? detailsHeading.scrollWidth > detailsHeading.clientWidth + 1 : null
      },
      detailsCloseCount: details?.querySelectorAll('[data-details-close]').length,
      contactFormCount: contactForms.length,
      contactFieldIds: contactFields.map((field) => field.id),
      legacyContactVariants: document.querySelectorAll('#requestdemo #webview, #requestdemo #mobile_view').length,
      integratedTitleLines: lineCount(integratedTitle),
      hardwareWhatsapp: {
        text: hardwareWhatsapp?.textContent.replace(/\\s+/g, ' ').trim(),
        href: hardwareWhatsapp?.getAttribute('href'),
        target: hardwareWhatsapp?.getAttribute('target')
      },
      legacyHardwareContactText: document.querySelector('.ecosystem__hardware-copy')?.textContent.includes('Contact us to explore the ideal solutions for your business.'),
      grant: (() => {
        const grantBox = grant?.getBoundingClientRect();
        const visualBox = grantVisual?.getBoundingClientRect();
        const copyBox = grantCopy?.getBoundingClientRect();
        return {
          imageLoaded: Boolean(grantImage?.complete && grantImage?.naturalWidth > 0),
          visualLeftOfCopy: Boolean(visualBox && copyBox && visualBox.right <= copyBox.left + 1),
          visualAboveCopy: Boolean(visualBox && copyBox && visualBox.bottom <= copyBox.top + 1),
          visualWidthRatio: grantBox && visualBox ? visualBox.width / grantBox.width : 0,
          height: grantBox?.height ?? 0,
          redundantKicker: Boolean(grant?.querySelector('.appz-kicker')),
          redundantRate: Boolean(grant?.querySelector('.ecosystem__grant-rate'))
        };
      })(),
      features: {
        count: featureEntries.length,
        indexes: featureEntries.map((entry) => entry.dataset.featureIndex),
        columns: featureList ? getComputedStyle(featureList).gridTemplateColumns.split(' ').length : 0,
        headingSize: features?.querySelector('h2') ? Number.parseFloat(getComputedStyle(features.querySelector('h2')).fontSize) : 0
      },
      customers: {
        count: customerItems.length,
        columns: customerGrid ? getComputedStyle(customerGrid).gridTemplateColumns.split(' ').length : 0,
        overflows: customerGrid ? customerGrid.scrollWidth > customerGrid.clientWidth + 1 : true
      },
      clusterGaps: {
        adminToKiosk: adminLabel && kioskImage ? kioskImage.top - adminLabel.bottom : null,
        kioskToQueue: kioskLabel && queueImage ? queueImage.top - kioskLabel.bottom : null
      },
      stage: box ? { left: box.left, right: box.right, width: box.width, height: box.height } : null,
      page: { clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth },
      visible: section?.classList.contains('is-visible'),
      tracking: {
        googleTagManager: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
        facebookPixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'))
      }
    };
  })())`));

  if (!layout.exists) failures.push(`${width}px: ecosystem structure is incomplete`);
  if (layout.placement !== 'app-home-order-flow') failures.push(`${width}px: ecosystem is not directly after the hero`);
  if (layout.nextSectionId !== 'content') failures.push(`${width}px: existing homepage content does not follow the ecosystem`);
  if (JSON.stringify(layout.contentOrder) !== JSON.stringify(['app-home-ecosystem', 'app-home-industries', 'app-home-proof'])) failures.push(`${width}px: homepage sections are in the wrong order`);
  if (layout.productSuitePresent) failures.push(`${width}px: removed product-suite section still renders`);
  if (layout.heading !== 'Everything Works Together') failures.push(`${width}px: ecosystem heading changed`);
  if (layout.headingSize > 74) failures.push(`${width}px: ecosystem heading is still oversized (${layout.headingSize}px)`);
  if (layout.islandCount !== 7) failures.push(`${width}px: expected seven islands, found ${layout.islandCount}`);
  if (layout.islandModuleCount !== 7) failures.push(`${width}px: expected seven module summaries beside the islands, found ${layout.islandModuleCount}`);
  if (!layout.islandLabelsVisible) failures.push(`${width}px: island module wording is not always visible`);
  if (layout.hubCount !== 1) failures.push(`${width}px: expected one central cloud hub, found ${layout.hubCount}`);
  if (!layout.hubLogo.loaded || layout.hubLogo.src !== 'https://appzpos.com/admin/Upload/0771BB36-9631-40F2-A204-C60247E9F1E1/Images/APPZPOS-300X150px.png') failures.push(`${width}px: APPZPOS hub logo is missing or did not load`);
  if (layout.connectionCount !== 0) failures.push(`${width}px: expected no connection lines, found ${layout.connectionCount}`);
  if (layout.moduleTabCount !== 0 || layout.modulePanelCount !== 0) failures.push(`${width}px: duplicated seven-category explorer still renders`);
  if (!layout.persistentDetails || layout.defaultDetailsTitle !== 'Table QR Ordering' || layout.detailsCloseCount !== 0) failures.push(`${width}px: persistent dining detail rail is missing`);
  if (layout.detailsHeading.whiteSpace !== 'nowrap' || layout.detailsHeading.overflows) failures.push(`${width}px: connected-modules heading is not a single visible row`);
  if (layout.contactFormCount !== 1) failures.push(`${width}px: expected one clean contact form, found ${layout.contactFormCount}`);
  if (JSON.stringify(layout.contactFieldIds) !== JSON.stringify(['name', 'email', 'mobilenum', 'restaurant_name'])) failures.push(`${width}px: contact form fields changed`);
  if (layout.legacyContactVariants !== 0) failures.push(`${width}px: duplicated desktop/mobile contact forms still render`);
  if (width >= 1280 && layout.integratedTitleLines !== 3) failures.push(`${width}px: integrated POS heading should use three lines, found ${layout.integratedTitleLines}`);
  if (layout.hardwareWhatsapp.text !== 'WhatsApp Us'
    || layout.hardwareWhatsapp.href !== "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    || layout.hardwareWhatsapp.target !== '_blank'
    || layout.legacyHardwareContactText) failures.push(`${width}px: hardware WhatsApp action is incorrect ${JSON.stringify({ action: layout.hardwareWhatsapp, legacyText: layout.legacyHardwareContactText })}`);
  if (width > 767 && !layout.grant.visualLeftOfCopy) failures.push(`${width}px: grant artwork is not positioned left of its copy ${JSON.stringify(layout.grant)}`);
  if (width <= 767 && !layout.grant.visualAboveCopy) failures.push(`${width}px: grant artwork is not stacked above its copy ${JSON.stringify(layout.grant)}`);
  if (width >= 1024 && (layout.grant.visualWidthRatio < .3 || layout.grant.visualWidthRatio > .5 || layout.grant.height > 620)) failures.push(`${width}px: side-by-side grant remains oversized ${JSON.stringify(layout.grant)}`);
  if (layout.grant.redundantKicker || layout.grant.redundantRate) failures.push(`${width}px: grant repeats its funding message ${JSON.stringify(layout.grant)}`);
  if (layout.features.count !== 6 || JSON.stringify(layout.features.indexes) !== JSON.stringify(['01', '02', '03', '04', '05', '06'])) failures.push(`${width}px: capability index structure changed ${JSON.stringify(layout.features)}`);
  if (layout.features.columns !== (width > 767 ? 2 : 1)) failures.push(`${width}px: capability index uses the wrong column count ${JSON.stringify(layout.features)}`);
  if (layout.features.headingSize > 50) failures.push(`${width}px: capability heading is oversized ${JSON.stringify(layout.features)}`);
  if (layout.customers.count !== 8 || layout.customers.overflows) failures.push(`${width}px: valued-customer grid is incomplete or overflowing ${JSON.stringify(layout.customers)}`);
  if (layout.customers.columns !== (width > 1100 ? 8 : width > 767 ? 4 : 2)) failures.push(`${width}px: valued-customer grid uses the wrong column count ${JSON.stringify(layout.customers)}`);
  if (width > 767 && (layout.clusterGaps.adminToKiosk < 24 || layout.clusterGaps.kioskToQueue < 24)) failures.push(`${width}px: right-side ecosystem islands remain too compact ${JSON.stringify(layout.clusterGaps)}`);
  if (layout.svgText) failures.push(`${width}px: SVG contains baked text`);
  if (layout.loadedImages !== 7) failures.push(`${width}px: not all island images loaded`);
  if (!layout.visible) failures.push(`${width}px: viewport entry did not reveal the ecosystem`);
  if (layout.page.scrollWidth > layout.page.clientWidth) failures.push(`${width}px: page has horizontal overflow`);
  if (layout.stage && (layout.stage.left < -1 || layout.stage.right > width + 1)) failures.push(`${width}px: ecosystem stage exceeds viewport`);
  if (!layout.tracking.googleTagManager) failures.push(`${width}px: Google Tag Manager is missing`);
  if (!layout.tracking.facebookPixel) failures.push(`${width}px: Meta Pixel is missing`);

  const expectedHrefs = [
    '/cloud-pos-point-of-sales-system',
    '/f&b-restaurant-emenu-qr-code-ordering-system',
    '/f&b-restaurant-kitchen-display-system',
    '/self-order-kiosk-restaurant',
    '/f&b-restaurant-queue-number-display-system',
    '/f&b-restaurant-online-ordering-website',
    '/f&b-restaurant-delivery-integration'
  ];
  if (JSON.stringify(layout.hrefs) !== JSON.stringify(expectedHrefs)) failures.push(`${width}px: island routes changed`);

  const expectedIslandModuleTitles = [
    'POS / E-Waiter',
    'Table QR Ordering',
    'Kitchen Display System (KDS)',
    'Self Ordering Kiosk',
    'Queue Number Display',
    'Website Ordering',
    'Order Hub'
  ];
  if (JSON.stringify(layout.islandModuleTitles) !== JSON.stringify(expectedIslandModuleTitles)) failures.push(`${width}px: island module mapping changed`);

  await evaluate(`document.querySelector('.ecosystem__grant')?.scrollIntoView({ block: 'center' })`);
  await wait(450);
  const grantImageLoaded = await evaluate(`(() => {
    const image = document.querySelector('.ecosystem__grant-visual img');
    return Boolean(image?.complete && image?.naturalWidth > 0);
  })()`);
  if (!grantImageLoaded) failures.push(`${width}px: grant artwork did not load when its section entered the viewport`);

  await evaluate(`document.querySelector('.appz-ecosystem')?.scrollIntoView({ block: 'center' })`);
  await wait(180);

  await evaluate(`document.querySelector('[data-island-id="kitchen"]')?.focus()`);
  await wait(300);
  const interaction = JSON.parse(await evaluate(`JSON.stringify((() => {
    const island = document.querySelector('[data-island-id="kitchen"]');
    const label = island?.querySelector('.appz-ecosystem__label');
    return {
      active: island?.classList.contains('is-active'),
      activeConnection: document.querySelector('[data-ecosystem-connection="kitchen"]')?.classList.contains('is-active'),
      labelOpacity: label ? getComputedStyle(label).opacity : null
    };
  })())`));
  if (!interaction.active || interaction.labelOpacity !== '1') {
    failures.push(`${width}px: focus interaction does not activate the island and label ${JSON.stringify(interaction)}`);
  }

  await evaluate(`document.querySelector('[data-island-id="kitchen"]')?.click()`);
  await wait(220);
  const detailsInteraction = JSON.parse(await evaluate(`JSON.stringify((() => {
    const details = document.querySelector('[data-island-details]');
    const layout = document.querySelector('[data-ecosystem-layout]');
    const stage = document.querySelector('.appz-ecosystem__stage');
    const detailsBox = details?.getBoundingClientRect();
    const stageBox = stage?.getBoundingClientRect();
    return {
      exists: Boolean(details),
      insideLayout: details?.parentElement === layout,
      besideStage: detailsBox && stageBox ? detailsBox.left >= stageBox.right - 1 : false,
      belowStage: detailsBox && stageBox ? detailsBox.top >= stageBox.bottom - 1 : false,
      live: details?.getAttribute('aria-live'),
      role: details?.getAttribute('role'),
      title: details?.querySelector('.appz-ecosystem__details-header h2')?.textContent.trim(),
      features: details?.querySelectorAll('[data-details-feature]').length,
      route: details?.querySelector('[data-details-learn-more]')?.getAttribute('href'),
      overflowY: details ? getComputedStyle(details).overflowY : null,
      allContentShown: details ? details.scrollHeight <= details.clientHeight + 1 : false,
      pageLocked: document.body.style.overflow === 'hidden'
    };
  })())`));
  if (!detailsInteraction.exists || !detailsInteraction.insideLayout
    || (width > 1100 ? !detailsInteraction.besideStage : !detailsInteraction.belowStage)
    || detailsInteraction.live !== 'polite'
    || detailsInteraction.role === 'dialog'
    || detailsInteraction.title !== 'Kitchen Display System (KDS)'
    || detailsInteraction.features !== 6
    || detailsInteraction.route !== '/f&b-restaurant-kitchen-display-system'
    || detailsInteraction.overflowY === 'auto' || detailsInteraction.overflowY === 'scroll'
    || !detailsInteraction.allContentShown
    || detailsInteraction.pageLocked) {
    failures.push(`${width}px: inline island details are incomplete ${JSON.stringify(detailsInteraction)}`);
  }

  if (screenshotDirectory && (width === 1440 || width === 430)) {
    await evaluate(`document.activeElement?.blur()`);
    await wait(350);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    mkdirSync(screenshotDirectory, { recursive: true });
    writeFileSync(`${screenshotDirectory}/ecosystem-${width}.png`, Buffer.from(screenshot.data, 'base64'));

    await evaluate(`document.querySelector('[data-island-id="kiosk"]')?.click()`);
    await wait(260);
    await evaluate(`document.querySelector('[data-island-details]')?.scrollIntoView({ block: 'center' })`);
    await wait(250);
    const detailsScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${screenshotDirectory}/details-${width}.png`, Buffer.from(detailsScreenshot.data, 'base64'));

    await evaluate(`document.querySelector('#requestdemo')?.scrollIntoView({ block: 'center' })`);
    await wait(350);
    const contactScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${screenshotDirectory}/contact-${width}.png`, Buffer.from(contactScreenshot.data, 'base64'));

    await evaluate(`document.querySelector('.ecosystem__hardware')?.scrollIntoView({ block: 'center' })`);
    await wait(350);
    const hardwareScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${screenshotDirectory}/hardware-${width}.png`, Buffer.from(hardwareScreenshot.data, 'base64'));

    await evaluate(`document.querySelector('.ecosystem__grant')?.scrollIntoView({ block: 'center' })`);
    await wait(350);
    const grantScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${screenshotDirectory}/grant-${width}.png`, Buffer.from(grantScreenshot.data, 'base64'));

    await evaluate(`document.querySelector('.ecosystem__features')?.scrollIntoView({ block: 'start' })`);
    await wait(350);
    const featureClip = JSON.parse(await evaluate(`JSON.stringify((() => {
      const box = document.querySelector('.ecosystem__features')?.getBoundingClientRect();
      return box ? {
        x: Math.max(0, window.scrollX + box.left),
        y: Math.max(0, window.scrollY + box.top),
        width: Math.min(document.documentElement.scrollWidth, box.width),
        height: box.height,
        scale: 1
      } : null;
    })())`));
    if (featureClip) {
      const featureScreenshot = await send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true, clip: featureClip
      });
      writeFileSync(`${screenshotDirectory}/features-${width}.png`, Buffer.from(featureScreenshot.data, 'base64'));
    }

    await evaluate(`document.querySelector('.proof__customers')?.scrollIntoView({ block: 'start' })`);
    await wait(350);
    const customerClip = JSON.parse(await evaluate(`JSON.stringify((() => {
      const box = document.querySelector('.proof__customers')?.getBoundingClientRect();
      return box ? {
        x: Math.max(0, window.scrollX + box.left),
        y: Math.max(0, window.scrollY + box.top),
        width: Math.min(document.documentElement.scrollWidth, box.width),
        height: box.height,
        scale: 1
      } : null;
    })())`));
    if (customerClip) {
      const customerScreenshot = await send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true, clip: customerClip
      });
      writeFileSync(`${screenshotDirectory}/customers-${width}.png`, Buffer.from(customerScreenshot.data, 'base64'));
    }
  }
}

await send('Emulation.setDeviceMetricsOverride', {
  width: 430, height: 844, deviceScaleFactor: 1, mobile: true,
  screenWidth: 430, screenHeight: 844
});
await send('Emulation.setEmulatedMedia', {
  media: 'screen',
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
});
await send('Page.navigate', { url: `${previewUrl}?ecosystem-reduced-motion` });
await wait(800);
const reducedMotion = JSON.parse(await evaluate(`JSON.stringify((() => {
  const island = document.querySelector('[data-ecosystem-island]');
  const float = island?.querySelector('.appz-ecosystem__island-float');
  const path = document.querySelector('[data-ecosystem-connection] .appz-ecosystem__route');
  return {
    islands: document.querySelectorAll('[data-ecosystem-island]').length,
    islandOpacity: island ? getComputedStyle(island).opacity : null,
    floatAnimation: float ? getComputedStyle(float).animationName : null,
    pathAnimation: path ? getComputedStyle(path).animationName : null
  };
})())`));

if (reducedMotion.islands !== 7) failures.push('reduced motion: seven islands are not present');
if (Number.parseFloat(reducedMotion.islandOpacity ?? '0') < .75) failures.push('reduced motion: islands are not immediately visible');
if (reducedMotion.floatAnimation !== 'none') failures.push('reduced motion: floating animation is still active');
if (reducedMotion.pathAnimation !== null) failures.push('reduced motion: path animation is still active');

const solutionHeroes = [
  {
    route: '/cloud-pos-point-of-sales-system',
    image: 'assets/images/ecosystem/ecosystem-pos-ewaiter-transparent.webp',
    title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
    key: 'pos',
    selector: '[data-solution-hero]'
  },
  {
    route: '/f&b-restaurant-emenu-qr-code-ordering-system',
    image: 'assets/images/ecosystem/ecosystem-table-qr.webp',
    title: 'APPZPOS Table QR Code Ordering System for Restaurants',
    key: 'qr',
    selector: '.solution-island-hero'
  },
  {
    route: '/f&b-restaurant-kitchen-display-system',
    image: 'assets/images/ecosystem/ecosystem-kitchen.webp',
    title: 'APPZPOS Kitchen Order Display System for Restaurants',
    key: 'kds',
    selector: '.solution-island-hero'
  },
  {
    route: '/self-order-kiosk-restaurant',
    image: 'assets/images/ecosystem/ecosystem-kiosk.webp',
    title: 'APPZPOS Self Ordering System for Quick Service Restaurants',
    key: 'kiosk',
    selector: '.solution-island-hero'
  },
  {
    route: '/f&b-restaurant-queue-number-display-system',
    image: 'assets/images/ecosystem/ecosystem-queue.webp',
    title: 'Restaurant Queue Management System with APPZPOS Queue Number Display',
    key: 'queue',
    selector: '.solution-island-hero'
  },
  {
    route: '/f&b-restaurant-online-ordering-website',
    image: 'assets/images/ecosystem/ecosystem-website-ordering.webp',
    title: 'APPZPOS Online Website Ordering System',
    key: 'website',
    selector: '.solution-island-hero'
  },
  {
    route: '/f&b-restaurant-delivery-integration',
    image: 'assets/images/ecosystem/ecosystem-delivery.webp',
    title: 'Centralized Delivery Platform Integration Through APPZPOS Order Hub',
    key: 'hub',
    selector: '.solution-island-hero'
  }
];

for (const width of [1440, 768, 430]) {
  const height = width <= 430 ? 844 : width <= 768 ? 1024 : 900;
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width <= 768,
    screenWidth: width, screenHeight: height
  });
  await send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });

  for (const heroCase of solutionHeroes) {
    const baseUrl = previewUrl.replace(/\/$/, '');
    await send('Page.navigate', {
      url: `${baseUrl}${heroCase.route}?solution-hero-regression-${width}`
    });
    await wait(620);

    const hero = JSON.parse(await evaluate(`JSON.stringify((() => {
      const section = document.querySelector(${JSON.stringify(heroCase.selector)});
      const image = section?.querySelector('img');
      const title = section?.querySelector('h1');
      const imageBox = image?.getBoundingClientRect();
      const titleBox = title?.getBoundingClientRect();
      const sectionBox = section?.getBoundingClientRect();
      const copy = section?.querySelector('.appz-solution-hero__copy');
      const integration = section?.querySelector('.appz-solution-hero__integration-link');
      const integrationBox = integration?.getBoundingClientRect();
      const deviceLinks = [...(section?.querySelectorAll('[data-solution-device]') ?? [])];
      const deviceCenters = Object.fromEntries(deviceLinks.map((link) => {
        const box = link.getBoundingClientRect();
        return [link.dataset.solutionDevice, box.left + (box.width / 2)];
      }));
      const overview = document.querySelector('[data-pos-overview]');
      const overviewHeading = overview?.querySelector('h2');
      const overviewColumns = [...(overview?.querySelectorAll('[data-pos-overview-layout] > *') ?? [])];
      const overviewCopyBox = overviewColumns[0]?.getBoundingClientRect();
      const overviewVisualBox = overviewColumns[1]?.getBoundingClientRect();
      const featureCards = [...document.querySelectorAll('[data-pos-feature]')];
      const firstFeatureTop = featureCards[0]?.getBoundingClientRect().top;
      const systemCards = [...document.querySelectorAll('[data-pos-system-card]')];
      const systemCardBoxes = systemCards.map((card) => card.getBoundingClientRect());
      const hardwareItems = [...document.querySelectorAll('[data-hardware-item]')];
      const visibleHardware = hardwareItems.filter((item) => getComputedStyle(item).display !== 'none');
      const firstHardwareTop = visibleHardware[0]?.getBoundingClientRect().top;
      return {
        count: document.querySelectorAll(${JSON.stringify(heroCase.selector)}).length,
        sharedHero: Boolean(document.querySelector('app-solution-hero [data-solution-hero]')),
        legacyHero: Boolean(document.querySelector('app-cloud-pos-point-of-sales-system > .solution-island-hero')),
        visualHref: image?.closest('a')?.getAttribute('href'),
        integrationHref: section?.querySelector('.appz-solution-hero__integration-link')?.getAttribute('href'),
        deviceHrefs: deviceLinks.map((link) => link.getAttribute('href')),
        deviceIds: deviceLinks.map((link) => link.dataset.solutionDevice),
        screenBetweenDevices: Boolean(
          integrationBox
          && deviceCenters.tablet
          && deviceCenters.cloud
          && integrationBox.left + (integrationBox.width / 2) > deviceCenters.tablet
          && integrationBox.left + (integrationBox.width / 2) < deviceCenters.cloud
        ),
        image: image?.getAttribute('src'),
        imageLoaded: Boolean(image?.complete && image?.naturalWidth > 0),
        title: title?.textContent.replace(/\\s+/g, ' ').trim(),
        imageLeftOfTitle: Boolean(imageBox && titleBox && imageBox.right <= titleBox.left + 1),
        imageAboveTitle: Boolean(imageBox && titleBox && imageBox.bottom <= titleBox.top + 1),
        heroHeight: sectionBox?.height ?? 0,
        titleMaxWidth: title ? getComputedStyle(title).maxWidth : null,
        titleDecoration: copy ? getComputedStyle(copy, '::before').content : null,
        overview: overview ? {
          count: document.querySelectorAll('[data-pos-overview]').length,
          headingAlignment: overviewHeading ? getComputedStyle(overviewHeading).textAlign : null,
          headingLines: (() => {
            if (!overviewHeading) return 0;
            const range = document.createRange();
            range.selectNodeContents(overviewHeading);
            return [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0).length;
          })(),
          columns: overviewColumns.map((column) => column.getAttribute('data-pos-overview-column')),
          copyLeftOfVisual: Boolean(overviewCopyBox && overviewVisualBox && overviewCopyBox.right <= overviewVisualBox.left + 1),
          copyAboveVisual: Boolean(overviewCopyBox && overviewVisualBox && overviewCopyBox.bottom <= overviewVisualBox.top + 1)
        } : null,
        features: featureCards.length ? {
          count: featureCards.length,
          sectionTitle: document.querySelector('[data-pos-feature-heading] h2')?.textContent.replace(/\\s+/g, ' ').trim(),
          sectionDescription: document.querySelector('[data-pos-feature-heading] p')?.textContent.replace(/\\s+/g, ' ').trim(),
          sectionAlignment: document.querySelector('[data-pos-feature-heading]')
            ? getComputedStyle(document.querySelector('[data-pos-feature-heading]')).textAlign
            : null,
          firstRowCount: featureCards.filter((card) => Math.abs(card.getBoundingClientRect().top - firstFeatureTop) < 2).length,
          tones: featureCards.map((card) => card.dataset.featureTone),
          stacked: featureCards.every((card) => {
            const icon = card.querySelector('.fbox-icon')?.getBoundingClientRect();
            const heading = card.querySelector('h3')?.getBoundingClientRect();
            const description = card.querySelector('p')?.getBoundingClientRect();
            return icon && heading && description && icon.bottom <= heading.top + 1 && heading.bottom <= description.top + 1;
          })
        } : null,
        systemShowcase: systemCards.length ? {
          count: systemCards.length,
          ids: systemCards.map((card) => card.id),
          imageTitleDescriptionOrder: systemCards.every((card) => {
            const image = card.querySelector('img');
            const heading = card.querySelector('h2');
            const description = card.querySelector('.pos-system-card__body > p:not(.pos-system-card__eyebrow)');
            return image && heading && description
              && Boolean(image.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
              && Boolean(heading.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING);
          }),
          featuredIsLarger: systemCardBoxes.length === 3
            ? systemCardBoxes[0].width > systemCardBoxes[1].width * 1.7
            : false,
          supportCardsShareRow: systemCardBoxes.length === 3
            ? Math.abs(systemCardBoxes[1].top - systemCardBoxes[2].top) < 2
            : false,
          imagesContained: systemCards.every((card) => {
            const visual = card.querySelector('.pos-system-card__visual')?.getBoundingClientRect();
            const image = card.querySelector('img')?.getBoundingClientRect();
            return visual && image
              && image.top >= visual.top - 1
              && image.bottom <= visual.bottom + 1
              && image.left >= visual.left - 1
              && image.right <= visual.right + 1;
          }),
          cloudLayout: (() => {
            const card = document.querySelector('#pos-cloud');
            const visual = card?.querySelector('.pos-system-card__visual')?.getBoundingClientRect();
            const body = card?.querySelector('.pos-system-card__body')?.getBoundingClientRect();
            return {
              visualRightOfCopy: Boolean(visual && body && body.right <= visual.left + 1),
              visualAboveCopy: Boolean(visual && body && visual.bottom <= body.top + 1)
            };
          })(),
          whatsappActions: [...document.querySelectorAll('#pos-cloud .pos-whatsapp-button, #pos-tablet .pos-whatsapp-button')]
            .map((action) => ({
              text: action.textContent.replace(/\\s+/g, ' ').trim(),
              href: action.getAttribute('href'),
              background: getComputedStyle(action).backgroundColor
            })),
          mobileAnchors: ['pos-cloud-mobile', 'pos-tablet-mobile', 'pos-integrations-mobile']
            .every((id) => Boolean(document.getElementById(id)))
        } : null,
        hardware: hardwareItems.length ? {
          count: hardwareItems.length,
          visibleCount: visibleHardware.length,
          firstRowCount: visibleHardware.filter((item) => Math.abs(item.getBoundingClientRect().top - firstHardwareTop) < 2).length,
          categoryButtons: document.querySelectorAll('[data-hardware-filters] button').length,
          sizeOptions: document.querySelectorAll('[data-hardware-filters] select option').length,
          filterLabel: document.querySelector('[data-hardware-filters] label span')?.textContent.trim(),
          filterOptions: [...document.querySelectorAll('[data-hardware-filters] select option')]
            .map((option) => option.textContent.trim()),
          intro: document.querySelector('.pos-hardware__intro')?.textContent.trim(),
          introAlignment: document.querySelector('.pos-hardware__intro')
            ? getComputedStyle(document.querySelector('.pos-hardware__intro')).textAlign
            : null,
          bordersRemoved: hardwareItems.every((item) => {
            const card = item.querySelector('.pos-hardware-card');
            return card && Number.parseFloat(getComputedStyle(card).borderTopWidth) === 0;
          }),
          transparentCards: hardwareItems.every((item) => {
            const card = item.querySelector('.pos-hardware-card');
            return card && getComputedStyle(card).backgroundColor === 'rgba(0, 0, 0, 0)';
          }),
          centeredCleanImages: hardwareItems.every((item) => {
            const image = item.querySelector('img');
            const heading = item.querySelector('h4');
            const imageStyles = image ? getComputedStyle(image) : null;
            return imageStyles && heading
              && Number.parseFloat(imageStyles.borderTopWidth) === 0
              && imageStyles.backgroundColor === 'rgba(0, 0, 0, 0)'
              && imageStyles.boxShadow === 'none'
              && getComputedStyle(heading).textAlign === 'center';
          }),
          mobileImageRatio: (() => {
            const item = visibleHardware[0]?.getBoundingClientRect();
            const image = visibleHardware[0]?.querySelector('img')?.getBoundingClientRect();
            return item && image ? image.width / item.width : 0;
          })(),
          imageRatios: visibleHardware.map((item) => {
            const itemBox = item.getBoundingClientRect();
            const imageBox = item.querySelector('img')?.getBoundingClientRect();
            return imageBox ? imageBox.width / itemBox.width : 0;
          }),
          imagesClearTitles: visibleHardware.every((item) => {
            const image = item.querySelector('img')?.getBoundingClientRect();
            const heading = item.querySelector('h4')?.getBoundingClientRect();
            return image && heading && image.bottom <= heading.top + 1;
          }),
          descriptionCount: document.querySelectorAll('[data-hardware-item] .pos-hardware-card__description').length
        } : null,
        requestDemo: (() => {
          const requestDemo = document.querySelector('#requestdemo');
          const styles = requestDemo ? getComputedStyle(requestDemo) : null;
          return {
            exists: Boolean(requestDemo),
            opacity: styles?.opacity,
            transform: styles?.transform,
            filter: styles?.filter,
            animation: styles?.animationName
          };
        })(),
        pageOverflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        googleTagManager: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
        facebookPixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'))
      };
    })())`));

    if (hero.count !== 1 || hero.image !== heroCase.image || !hero.imageLoaded || hero.title !== heroCase.title) {
      failures.push(`${width}px ${heroCase.key}: solution hero content is incorrect ${JSON.stringify(hero)}`);
    }
    if (heroCase.key === 'pos' && (!hero.sharedHero || hero.legacyHero
      || hero.visualHref !== '#content' || hero.integrationHref !== '#pos-integrations')) {
      failures.push(`${width}px pos: shared hero structure is incorrect ${JSON.stringify(hero)}`);
    }
    if (heroCase.key === 'pos' && (JSON.stringify(hero.deviceIds) !== JSON.stringify(['tablet', 'cloud'])
      || JSON.stringify(hero.deviceHrefs) !== JSON.stringify(['#pos-tablet', '#pos-cloud'])
      || !hero.screenBetweenDevices)) {
      failures.push(`${width}px pos: interactive devices are missing or misplaced ${JSON.stringify(hero)}`);
    }
    if (heroCase.key === 'pos' && (hero.heroHeight > 540
      || !hero.titleMaxWidth || hero.titleDecoration !== 'none')) {
      failures.push(`${width}px pos: compact hero title treatment is incorrect ${JSON.stringify(hero)}`);
    }
    if (heroCase.key === 'pos' && (!hero.overview || hero.overview.count !== 1
      || hero.overview.headingAlignment !== 'center'
      || (width > 768 && hero.overview.headingLines !== 1)
      || JSON.stringify(hero.overview.columns) !== JSON.stringify(['copy', 'visual'])
      || (width > 768 ? !hero.overview.copyLeftOfVisual : !hero.overview.copyAboveVisual))) {
      failures.push(`${width}px pos: All-In-One overview layout is incorrect ${JSON.stringify(hero.overview)}`);
    }
    const expectedFeatureRowCount = width >= 1200 ? 4 : width >= 600 ? 2 : 1;
    if (heroCase.key === 'pos' && (!hero.features || hero.features.count !== 12
      || hero.features.sectionTitle !== 'Everything You Need to Run Your Restaurant'
      || hero.features.sectionDescription !== 'Manage orders, payments, inventory, customers and reporting from one connected POS platform.'
      || hero.features.sectionAlignment !== 'center'
      || hero.features.firstRowCount !== expectedFeatureRowCount
      || !hero.features.stacked
      || JSON.stringify(hero.features.tones) !== JSON.stringify([
        'blue', 'blue', 'blue', 'blue',
        'orange', 'orange', 'orange', 'orange',
        'green', 'green', 'green', 'green'
      ]))) {
      failures.push(`${width}px pos: twelve-feature grid is incorrect ${JSON.stringify(hero.features)}`);
    }
    if (heroCase.key === 'pos' && (!hero.systemShowcase || hero.systemShowcase.count !== 3
      || JSON.stringify(hero.systemShowcase.ids) !== JSON.stringify(['pos-cloud', 'pos-tablet', 'pos-integrations'])
      || !hero.systemShowcase.imageTitleDescriptionOrder
      || !hero.systemShowcase.imagesContained
      || !hero.systemShowcase.mobileAnchors
      || (width > 768
        ? (!hero.systemShowcase.featuredIsLarger || !hero.systemShowcase.supportCardsShareRow || !hero.systemShowcase.cloudLayout.visualRightOfCopy)
        : (hero.systemShowcase.featuredIsLarger || hero.systemShowcase.supportCardsShareRow || !hero.systemShowcase.cloudLayout.visualAboveCopy))
      || hero.systemShowcase.whatsappActions.length !== 2
      || hero.systemShowcase.whatsappActions.some((action) => action.text !== 'WhatsApp Us'
        || !action.href?.startsWith('https://wa.me/6583109631')
        || action.background !== 'rgb(37, 211, 102)'))) {
      failures.push(`${width}px pos: POS system card showcase is incorrect ${JSON.stringify(hero.systemShowcase)}`);
    }
    const expectedHardwareRowCount = width >= 992 ? 4 : 2;
    if (heroCase.key === 'pos' && (!hero.hardware || hero.hardware.count !== 16
      || hero.hardware.visibleCount !== 16
      || hero.hardware.firstRowCount !== expectedHardwareRowCount
      || hero.hardware.categoryButtons !== 4
      || hero.hardware.sizeOptions !== 7
      || hero.hardware.filterLabel !== 'Filter by'
      || JSON.stringify(hero.hardware.filterOptions) !== JSON.stringify([
        'All', 'Tablet', '10 inch', '15.6 inch', 'Accessories / Other',
        'With printer', 'With customer display'
      ])
      || hero.hardware.intro !== 'Choose the POS machines, printers and accessories that fit your business setup.'
      || hero.hardware.introAlignment !== 'center'
      || !hero.hardware.bordersRemoved
      || !hero.hardware.transparentCards
      || !hero.hardware.centeredCleanImages
      || hero.hardware.imageRatios.some((ratio) => ratio < (width <= 768 ? .65 : .55) || ratio > .95)
      || !hero.hardware.imagesClearTitles
      || hero.hardware.descriptionCount !== 0)) {
      failures.push(`${width}px pos: hardware collection is incorrect ${JSON.stringify(hero.hardware)}`);
    }
    if (heroCase.key === 'pos' && (!hero.requestDemo.exists
      || hero.requestDemo.opacity !== '1'
      || hero.requestDemo.transform !== 'none'
      || hero.requestDemo.filter !== 'none'
      || hero.requestDemo.animation !== 'none')) {
      failures.push(`${width}px pos: request demo remains visually blurred ${JSON.stringify(hero.requestDemo)}`);
    }
    if (width > 767 && !hero.imageLeftOfTitle) failures.push(`${width}px ${heroCase.key}: island is not left of the title ${JSON.stringify(hero)}`);
    if (width <= 767 && !hero.imageAboveTitle) failures.push(`${width}px ${heroCase.key}: island is not above the title ${JSON.stringify(hero)}`);
    if (hero.pageOverflows) failures.push(`${width}px ${heroCase.key}: solution page has horizontal overflow`);
    if (!hero.googleTagManager || !hero.facebookPixel) failures.push(`${width}px ${heroCase.key}: solution page tracking is missing ${JSON.stringify(hero)}`);

    if (heroCase.key === 'pos') {
      await evaluate(`document.querySelector('[data-solution-hero] a')?.click()`);
      await wait(700);
      const targetOffset = await evaluate(`document.querySelector('#content')?.getBoundingClientRect().top`);
      if (Math.abs(targetOffset ?? 9999) > 2) failures.push(`${width}px pos: illustration did not scroll to POS content (${targetOffset})`);

      await evaluate(`document.querySelector('.appz-solution-hero__integration-link')?.click()`);
      await wait(1400);
      const integrationOffset = await evaluate(`document.querySelector('${width <= 768 ? '#pos-integrations-mobile' : '#pos-integrations'}')?.getBoundingClientRect().top`);
      if (Math.abs((integrationOffset ?? 9999) - 92) > 3) failures.push(`${width}px pos: floating screen did not scroll to integrations (${integrationOffset})`);

      for (const device of [
        { id: 'tablet', target: width <= 768 ? '#pos-tablet-mobile' : '#pos-tablet' },
        { id: 'cloud', target: width <= 768 ? '#pos-cloud-mobile' : '#pos-cloud' }
      ]) {
        await evaluate(`document.querySelector('[data-solution-device="${device.id}"]')?.click()`);
        await wait(1400);
        const deviceOffset = await evaluate(`document.querySelector('${device.target}')?.getBoundingClientRect().top`);
        if (Math.abs((deviceOffset ?? 9999) - 92) > 3) failures.push(`${width}px pos: ${device.id} device did not scroll to its section (${deviceOffset})`);
      }

      const hardwareFiltering = JSON.parse(await evaluate(`JSON.stringify((() => {
        const buttons = [...document.querySelectorAll('[data-hardware-filters] button')];
        const visibleCount = () => [...document.querySelectorAll('[data-hardware-item]')]
          .filter((item) => getComputedStyle(item).display !== 'none').length;
        buttons.find((button) => button.textContent.trim() === 'Printers')?.click();
        const printers = visibleCount();
        buttons.find((button) => button.textContent.trim() === 'All')?.click();
        const select = document.querySelector('[data-hardware-filters] select');
        select.value = 'printer';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        const withPrinter = visibleCount();
        select.value = 'customer-display';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        const withCustomerDisplay = visibleCount();
        select.value = '15.6';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        const large = visibleCount();
        select.value = 'all';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return { printers, withPrinter, withCustomerDisplay, large, reset: visibleCount() };
      })())`));
      if (hardwareFiltering.printers !== 2 || hardwareFiltering.withPrinter !== 3
        || hardwareFiltering.withCustomerDisplay !== 6 || hardwareFiltering.large !== 9
        || hardwareFiltering.reset !== 16) {
        failures.push(`${width}px pos: hardware filters do not work ${JSON.stringify(hardwareFiltering)}`);
      }
    }

    if (screenshotDirectory
      && ((width === 1440 && (heroCase.key === 'pos' || heroCase.key === 'qr'))
        || (width === 430 && (heroCase.key === 'pos' || heroCase.key === 'hub')))) {
      await evaluate(`window.scrollTo(0, 0)`);
      await wait(120);
      const heroScreenshot = await send('Page.captureScreenshot', { format: 'png' });
      mkdirSync(screenshotDirectory, { recursive: true });
      writeFileSync(
        `${screenshotDirectory}/solution-${heroCase.key}-${width}.png`,
        Buffer.from(heroScreenshot.data, 'base64')
      );

      if (heroCase.key === 'pos') {
        await evaluate(`document.querySelector('[data-pos-overview]')?.scrollIntoView({ block: 'start' })`);
        await wait(220);
        const overviewScreenshot = await send('Page.captureScreenshot', { format: 'png' });
        writeFileSync(
          `${screenshotDirectory}/pos-overview-${width}.png`,
          Buffer.from(overviewScreenshot.data, 'base64')
        );

        const featureClip = JSON.parse(await evaluate(`JSON.stringify((() => {
          const grid = document.querySelector('[data-pos-feature-grid]');
          const box = grid?.getBoundingClientRect();
          return box ? {
            x: Math.max(0, window.scrollX + box.left),
            y: Math.max(0, window.scrollY + box.top),
            width: Math.min(document.documentElement.scrollWidth, box.width),
            height: box.height,
            scale: 1
          } : null;
        })())`));
        if (featureClip) {
          const featureScreenshot = await send('Page.captureScreenshot', {
            format: 'png', captureBeyondViewport: true, clip: featureClip
          });
          writeFileSync(
            `${screenshotDirectory}/pos-features-${width}.png`,
            Buffer.from(featureScreenshot.data, 'base64')
          );
        }


        const systemClip = JSON.parse(await evaluate(`JSON.stringify((() => {
          const section = document.querySelector('[data-pos-system-showcase]');
          const box = section?.getBoundingClientRect();
          return box ? {
            x: Math.max(0, window.scrollX + box.left),
            y: Math.max(0, window.scrollY + box.top),
            width: Math.min(document.documentElement.scrollWidth, box.width),
            height: box.height,
            scale: 1
          } : null;
        })())`));
        if (systemClip) {
          const systemScreenshot = await send('Page.captureScreenshot', {
            format: 'png', captureBeyondViewport: true, clip: systemClip
          });
          writeFileSync(
            `${screenshotDirectory}/pos-system-showcase-${width}.png`,
            Buffer.from(systemScreenshot.data, 'base64')
          );
        }


        const hardwareClip = JSON.parse(await evaluate(`JSON.stringify((() => {
          const section = document.querySelector('[data-pos-hardware]');
          const box = section?.getBoundingClientRect();
          return box ? {
            x: Math.max(0, window.scrollX + box.left),
            y: Math.max(0, window.scrollY + box.top),
            width: Math.min(document.documentElement.scrollWidth, box.width),
            height: box.height,
            scale: 1
          } : null;
        })())`));
        if (hardwareClip) {
          const hardwareScreenshot = await send('Page.captureScreenshot', {
            format: 'png', captureBeyondViewport: true, clip: hardwareClip
          });
          writeFileSync(
            `${screenshotDirectory}/pos-hardware-${width}.png`,
            Buffer.from(hardwareScreenshot.data, 'base64')
          );
        }


        const formClip = JSON.parse(await evaluate(`JSON.stringify((() => {
          const section = document.querySelector('#requestdemo');
          const box = section?.getBoundingClientRect();
          return box ? {
            x: Math.max(0, window.scrollX + box.left),
            y: Math.max(0, window.scrollY + box.top),
            width: Math.min(document.documentElement.scrollWidth, box.width),
            height: box.height,
            scale: 1
          } : null;
        })())`));
        if (formClip) {
          const formScreenshot = await send('Page.captureScreenshot', {
            format: 'png', captureBeyondViewport: true, clip: formClip
          });
          writeFileSync(
            `${screenshotDirectory}/pos-request-demo-${width}.png`,
            Buffer.from(formScreenshot.data, 'base64')
          );
        }
      }
    }
  }
}

await send('Emulation.setDeviceMetricsOverride', {
  width: 430, height: 844, deviceScaleFactor: 1, mobile: true,
  screenWidth: 430, screenHeight: 844
});
await send('Emulation.setEmulatedMedia', {
  media: 'screen',
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
});
await send('Page.navigate', {
  url: `${previewUrl.replace(/\/$/, '')}/cloud-pos-point-of-sales-system?solution-hero-reduced-motion`
});
await wait(620);
const posHeroAnimationName = await evaluate(`(() => {
  const image = document.querySelector('[data-solution-hero] img');
  return image ? getComputedStyle(image).animationName : null;
})()`);
if (posHeroAnimationName !== 'none') failures.push('POS shared hero animation remains active');
const posIntegrationAnimationName = await evaluate(`(() => {
  const screen = document.querySelector('.appz-solution-hero__integration-link');
  return screen ? getComputedStyle(screen).animationName : null;
})()`);
if (posIntegrationAnimationName !== 'none') failures.push('POS integration screen animation remains active');
const posDeviceAnimationNames = JSON.parse(await evaluate(`JSON.stringify(
  [...document.querySelectorAll('[data-solution-device]')].map((device) => getComputedStyle(device).animationName)
)`));
if (posDeviceAnimationNames.some((name) => name !== 'none')) failures.push('POS device glow animation remains active');

await send('Page.close');
socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures, reducedMotion }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', reducedMotion, checkedViewports: viewports }, null, 2));
