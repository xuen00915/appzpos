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
    const stage = document.querySelector('.appz-ecosystem__stage');
    const svg = document.querySelector('.appz-ecosystem__connections');
    const islands = [...document.querySelectorAll('[data-ecosystem-island]')];
    const heading = section?.querySelector('h2');
    const box = stage?.getBoundingClientRect();
    return {
      exists: Boolean(section && host && hero && stage && svg),
      placement: hero?.nextElementSibling?.tagName?.toLowerCase(),
      nextSectionId: host?.nextElementSibling?.id,
      productSuitePresent: Boolean(document.querySelector('app-home-product-suite')),
      heading: heading?.textContent.trim(),
      headingSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : 0,
      islandCount: islands.length,
      hubCount: document.querySelectorAll('[data-ecosystem-hub]').length,
      connectionCount: document.querySelectorAll('[data-ecosystem-connection]').length,
      svgText: svg?.textContent.trim(),
      loadedImages: islands.filter((island) => {
        const image = island.querySelector('img');
        return image?.complete && image?.naturalWidth > 0;
      }).length,
      hrefs: islands.map((island) => island.getAttribute('href')),
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
  if (layout.productSuitePresent) failures.push(`${width}px: removed product-suite section still renders`);
  if (layout.heading !== 'Everything Works Together') failures.push(`${width}px: ecosystem heading changed`);
  if (layout.headingSize > 74) failures.push(`${width}px: ecosystem heading is still oversized (${layout.headingSize}px)`);
  if (layout.islandCount !== 6) failures.push(`${width}px: expected six islands, found ${layout.islandCount}`);
  if (layout.hubCount !== 1) failures.push(`${width}px: expected one central cloud hub, found ${layout.hubCount}`);
  if (layout.connectionCount !== 6) failures.push(`${width}px: expected six connections, found ${layout.connectionCount}`);
  if (layout.svgText) failures.push(`${width}px: SVG contains baked text`);
  if (layout.loadedImages !== 6) failures.push(`${width}px: not all island images loaded`);
  if (!layout.visible) failures.push(`${width}px: viewport entry did not reveal the ecosystem`);
  if (layout.page.scrollWidth > layout.page.clientWidth) failures.push(`${width}px: page has horizontal overflow`);
  if (layout.stage && (layout.stage.left < -1 || layout.stage.right > width + 1)) failures.push(`${width}px: ecosystem stage exceeds viewport`);
  if (!layout.tracking.googleTagManager) failures.push(`${width}px: Google Tag Manager is missing`);
  if (!layout.tracking.facebookPixel) failures.push(`${width}px: Meta Pixel is missing`);

  const expectedHrefs = [
    '/cloud-pos-point-of-sales-system',
    '/f&b-restaurant-emenu-qr-code-ordering-system',
    '/f&b-restaurant-kitchen-display-system',
    '/custom-solutions',
    '/f&b-restaurant-online-ordering-website',
    '/f&b-restaurant-delivery-integration'
  ];
  if (JSON.stringify(layout.hrefs) !== JSON.stringify(expectedHrefs)) failures.push(`${width}px: island routes changed`);

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

  if (screenshotDirectory && (width === 1440 || width === 430)) {
    await evaluate(`document.activeElement?.blur()`);
    await wait(350);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    mkdirSync(screenshotDirectory, { recursive: true });
    writeFileSync(`${screenshotDirectory}/ecosystem-${width}.png`, Buffer.from(screenshot.data, 'base64'));
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

if (reducedMotion.islands !== 6) failures.push('reduced motion: six islands are not present');
if (reducedMotion.islandOpacity !== '1') failures.push('reduced motion: islands are not immediately visible');
if (reducedMotion.floatAnimation !== 'none') failures.push('reduced motion: floating animation is still active');
if (reducedMotion.pathAnimation !== 'none') failures.push('reduced motion: path animation is still active');

await send('Page.close');
socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures, reducedMotion }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', reducedMotion, checkedViewports: viewports }, null, 2));
