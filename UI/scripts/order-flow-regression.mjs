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
      defaultDetailsTitle: details?.querySelector('h3')?.textContent.trim(),
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
          visualAboveCopy: Boolean(visualBox && copyBox && visualBox.bottom <= copyBox.top + 1),
          visualWidthRatio: grantBox && visualBox ? visualBox.width / grantBox.width : 0,
          height: grantBox?.height ?? 0,
          redundantKicker: Boolean(grant?.querySelector('.appz-kicker')),
          redundantRate: Boolean(grant?.querySelector('.ecosystem__grant-rate'))
        };
      })(),
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
  if (layout.connectionCount !== 7) failures.push(`${width}px: expected seven connections, found ${layout.connectionCount}`);
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
  if (!layout.grant.visualAboveCopy) failures.push(`${width}px: grant artwork is not stacked above its copy ${JSON.stringify(layout.grant)}`);
  if (width >= 1024 && (layout.grant.visualWidthRatio < .48 || layout.grant.visualWidthRatio > .68 || layout.grant.height > 820)) failures.push(`${width}px: stacked grant remains oversized ${JSON.stringify(layout.grant)}`);
  if (layout.grant.redundantKicker || layout.grant.redundantRate) failures.push(`${width}px: grant repeats its funding message ${JSON.stringify(layout.grant)}`);
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
  if (!interaction.active || !interaction.activeConnection || interaction.labelOpacity !== '1') {
    failures.push(`${width}px: focus interaction does not activate the island, path and label ${JSON.stringify(interaction)}`);
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
      title: details?.querySelector('h3')?.textContent.trim(),
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
if (reducedMotion.pathAnimation !== 'none') failures.push('reduced motion: path animation is still active');

await send('Page.close');
socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures, reducedMotion }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', reducedMotion, checkedViewports: viewports }, null, 2));
