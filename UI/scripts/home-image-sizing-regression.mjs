import { mkdirSync, writeFileSync } from 'node:fs';

const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4318/';
const screenshotDirectory = process.env.APPZPOS_SCREENSHOT_DIR;
const chromeEndpoint = `http://127.0.0.1:${cdpPort}`;
const profiles = [
  { width: 1440, height: 1000, hardwareMax: 520, grantMax: 360, islandMax: 360 },
  { width: 768, height: 1024, hardwareMax: 440, grantMax: 360, islandMax: 340 },
  { width: 390, height: 844, hardwareMax: 320, grantMax: 260, islandMax: 300 }
];
const expectedIndustryImages = [
  'APPZPOS-All-in-One-Pos-System-quick-service.png',
  'restaurant-pos.webp',
  'retail-pos.webp',
  'beauty-salon-pos.webp'
];
const failures = [];
const results = {};

const target = await fetch(
  `${chromeEndpoint}/json/new?${encodeURIComponent(`${previewUrl}?home-image-sizing`)}`,
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
  const response = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
  }
  return response.result.value;
};
const closeEnough = (values, tolerance = 1) => values.every((value) => Math.abs(value - values[0]) <= tolerance);
const isFourThree = ({ width, height }) => height > 0 && Math.abs((width / height) - (4 / 3)) <= .02;

await send('Page.enable');
await send('Runtime.enable');

for (const profile of profiles) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: 1,
    mobile: profile.width <= 768,
    screenWidth: profile.width,
    screenHeight: profile.height
  });
  await send('Page.navigate', { url: `${previewUrl}?home-image-sizing-${profile.width}` });
  await wait(1400);

  await evaluate(`document.querySelector('[data-home-section="industries"]')?.scrollIntoView({ block: 'center' })`);
  await wait(500);
  const industryFrames = [];
  for (let index = 0; index < expectedIndustryImages.length; index += 1) {
    await evaluate(`document.querySelectorAll('.industries__switcher button')[${index}]?.click()`);
    await wait(180);
    const industry = JSON.parse(await evaluate(`JSON.stringify((() => {
      const panel = document.querySelector('.industries__active[aria-hidden="false"]');
      const frame = panel?.querySelector('.industries__active-media');
      const image = frame?.querySelector('img');
      const box = frame?.getBoundingClientRect();
      return {
        src: image?.getAttribute('src'),
        loaded: Boolean(image?.complete && image?.naturalWidth > 0),
        objectFit: image ? getComputedStyle(image).objectFit : null,
        width: box?.width ?? 0,
        height: box?.height ?? 0
      };
    })())`));
    industryFrames.push(industry);
    if (!industry.src?.endsWith(expectedIndustryImages[index])) {
      failures.push(`${profile.width}px: industry ${index + 1} uses ${industry.src}, expected ${expectedIndustryImages[index]}`);
    }
    if (!industry.loaded) failures.push(`${profile.width}px: industry ${index + 1} image did not load`);
    if (industry.objectFit !== 'cover') failures.push(`${profile.width}px: industry ${index + 1} must use object-fit cover`);
    if (!isFourThree(industry)) failures.push(`${profile.width}px: industry ${index + 1} frame is not 4:3 (${industry.width}x${industry.height})`);
    if (industry.width > 560.5) failures.push(`${profile.width}px: industry ${index + 1} exceeds the 560px cap (${industry.width}px)`);
  }
  if (!closeEnough(industryFrames.map(({ width }) => width)) || !closeEnough(industryFrames.map(({ height }) => height))) {
    failures.push(`${profile.width}px: industry frames are not consistently sized`);
  }

  const staticMedia = JSON.parse(await evaluate(`JSON.stringify((() => {
    const measure = (selector) => {
      const frame = document.querySelector(selector);
      const image = frame?.querySelector('img');
      const box = frame?.getBoundingClientRect();
      return {
        width: box?.width ?? 0,
        height: box?.height ?? 0,
        loaded: Boolean(image?.complete && image?.naturalWidth > 0),
        objectFit: image ? getComputedStyle(image).objectFit : null
      };
    };
    return {
      hardware: measure('.ecosystem__hardware-media'),
      grant: measure('.ecosystem__grant-visual'),
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      tracking: {
        gtm: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
        pixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')),
        requestDemo: Boolean(document.querySelector('[data-track-cta="request-demo"]'))
      }
    };
  })())`));
  if (!staticMedia.hardware.loaded || staticMedia.hardware.objectFit !== 'contain') failures.push(`${profile.width}px: integrated POS visual is not loaded with contain sizing`);
  if (staticMedia.hardware.width > profile.hardwareMax + .5) failures.push(`${profile.width}px: integrated POS visual exceeds ${profile.hardwareMax}px (${staticMedia.hardware.width}px)`);
  if (!isFourThree(staticMedia.hardware)) failures.push(`${profile.width}px: integrated POS frame is not 4:3 (${staticMedia.hardware.width}x${staticMedia.hardware.height})`);
  if (!staticMedia.grant.loaded) failures.push(`${profile.width}px: grant visual did not load`);
  if (staticMedia.grant.width > profile.grantMax + .5) failures.push(`${profile.width}px: grant visual exceeds ${profile.grantMax}px (${staticMedia.grant.width}px)`);
  if (staticMedia.pageOverflow) failures.push(`${profile.width}px: page has horizontal overflow`);
  if (!staticMedia.tracking.gtm || !staticMedia.tracking.pixel || !staticMedia.tracking.requestDemo) failures.push(`${profile.width}px: tracking hooks changed`);

  await evaluate(`document.querySelector('[data-home-section="island"]')?.scrollIntoView({ block: 'center' })`);
  await wait(300);
  const islandFrames = [];
  const islandCount = await evaluate(`document.querySelectorAll('[data-ecosystem-island]').length`);
  for (let index = 0; index < islandCount; index += 1) {
    await evaluate(`document.querySelectorAll('[data-ecosystem-island]')[${index}]?.click()`);
    await wait(100);
    const island = JSON.parse(await evaluate(`JSON.stringify((() => {
      const frame = document.querySelector('.appz-ecosystem__selected-visual');
      const image = frame?.querySelector('img');
      const box = frame?.getBoundingClientRect();
      return {
        width: box?.width ?? 0,
        height: box?.height ?? 0,
        loaded: Boolean(image?.complete && image?.naturalWidth > 0),
        objectFit: image ? getComputedStyle(image).objectFit : null
      };
    })())`));
    islandFrames.push(island);
    if (!island.loaded || island.objectFit !== 'contain') failures.push(`${profile.width}px: island ${index + 1} is not loaded with contain sizing`);
    if (!isFourThree(island)) failures.push(`${profile.width}px: island ${index + 1} frame is not 4:3 (${island.width}x${island.height})`);
    if (island.width > profile.islandMax + .5) failures.push(`${profile.width}px: island ${index + 1} exceeds ${profile.islandMax}px (${island.width}px)`);
  }
  if (islandCount !== 7) failures.push(`${profile.width}px: expected seven island visuals, found ${islandCount}`);
  if (!closeEnough(islandFrames.map(({ width }) => width)) || !closeEnough(islandFrames.map(({ height }) => height))) {
    failures.push(`${profile.width}px: island frames change size between selections`);
  }

  if (screenshotDirectory && (profile.width === 1440 || profile.width === 390)) {
    mkdirSync(screenshotDirectory, { recursive: true });
    for (const [name, selector] of [
      ['industries', '[data-home-section="industries"]'],
      ['islands', '[data-home-section="island"]'],
      ['integrated-pos', '[data-home-section="integrated-pos"]'],
      ['grant', '[data-home-section="grant"]']
    ]) {
      await evaluate(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({ block: 'center' })`);
      await wait(260);
      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`${screenshotDirectory}/${name}-${profile.width}.png`, Buffer.from(screenshot.data, 'base64'));
    }
  }

  results[profile.width] = { industryFrames, staticMedia, islandFrames };
}

socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures, results }, null, 2));
  process.exit(1);
}

console.log('Homepage image sizing regression passed at desktop, tablet, and mobile widths.');
