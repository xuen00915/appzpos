import { mkdirSync, writeFileSync } from 'node:fs';

const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4300/';
const screenshotDirectory = process.env.APPZPOS_SCREENSHOT_DIR;
const chromeEndpoint = `http://127.0.0.1:${cdpPort}`;

const target = await fetch(
  `${chromeEndpoint}/json/new?${encodeURIComponent(`${previewUrl}?order-flow-regression`)}`,
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
    throw new Error(result.exceptionDetails.text);
  }
  return result.result.value;
};

const viewports = [1440, 1280, 1024, 768, 430, 390];
const checkpoints = [0, .1, .2, .3, .4, .55, .75, 1];
const expectedSteps = [1, 2, 3, 4, 5, 6, 7, 7];
const layouts = {};
const failures = [];

await send('Page.enable');
await send('Runtime.enable');

for (const width of viewports) {
  const height = width <= 430 ? 844 : width <= 768 ? 1024 : 900;
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 768,
    screenWidth: width,
    screenHeight: height
  });
  await send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });
  await send('Page.navigate', { url: `${previewUrl}?order-flow-regression-${width}` });
  await wait(1100);

  const initial = JSON.parse(await evaluate(`JSON.stringify((() => {
    const section = document.querySelector('.appzpos-order-flow');
    const hero = document.querySelector('.appzpos-product-hero');
    const content = document.querySelector('#content');
    const stage = document.querySelector('.appzpos-order-flow__stage');
    const svg = document.querySelector('.appzpos-order-flow__scene svg');
    const rect = (element) => {
      const bounds = element.getBoundingClientRect();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    };
    const overlaps = (a, b) => !(
      a.x + a.width <= b.x || b.x + b.width <= a.x ||
      a.y + a.height <= b.y || b.y + b.height <= a.y
    );
    const labels = [...document.querySelectorAll('[data-node-label]')];
    const markers = [...document.querySelectorAll('[data-node-marker]')];
    return {
      exists: Boolean(section && hero && content && stage && svg),
      placement: hero?.nextElementSibling?.tagName.toLowerCase(),
      contentAfterFlow: section?.closest('app-home-order-flow')?.nextElementSibling?.id,
      stepCount: document.querySelectorAll('.appzpos-order-flow__step').length,
      scene: rect(svg),
      stage: rect(stage),
      page: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      },
      labelMarkerCollisions: labels.map((label, index) => overlaps(rect(label), rect(markers[index]))),
      tracking: {
        googleTagManager: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
        facebookPixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'))
      }
    };
  })())`));

  if (!initial.exists) failures.push(`${width}px: order-flow structure is incomplete`);
  if (initial.placement !== 'app-home-order-flow') failures.push(`${width}px: order flow is not directly after the hero`);
  if (initial.contentAfterFlow !== 'content') failures.push(`${width}px: original homepage content does not follow the order flow`);
  if (initial.stepCount !== 7) failures.push(`${width}px: expected seven step indicators, found ${initial.stepCount}`);
  if (initial.page.scrollWidth > initial.page.clientWidth) failures.push(`${width}px: page has horizontal overflow`);
  if (initial.scene.x < -1 || initial.scene.x + initial.scene.width > width + 1) failures.push(`${width}px: SVG scene exceeds the viewport`);
  initial.labelMarkerCollisions.forEach((collision, index) => {
    if (collision) failures.push(`${width}px: label ${index + 1} overlaps its node marker`);
  });
  if (!initial.tracking.googleTagManager) failures.push(`${width}px: Google Tag Manager is missing`);
  if (!initial.tracking.facebookPixel) failures.push(`${width}px: Meta Pixel is missing`);

  const states = [];
  for (let index = 0; index < checkpoints.length; index += 1) {
    const progress = checkpoints[index];
    const sampledProgress = progress > 0 && progress < 1 ? progress + .002 : progress;
    await evaluate(`(() => {
      const section = document.querySelector('.appzpos-order-flow');
      const stage = document.querySelector('.appzpos-order-flow__stage');
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const distance = section.getBoundingClientRect().height - stage.getBoundingClientRect().height;
      window.scrollTo(0, sectionTop + (${sampledProgress} * distance));
    })()`);
    await wait(90);
    const state = JSON.parse(await evaluate(`JSON.stringify((() => ({
      activeStep: Number(document.querySelector('.appzpos-order-flow__step[aria-current="step"]')?.textContent.trim()),
      entryFiguresVisible: [...document.querySelectorAll('[data-entry-figure]')].filter((item) => item.getAttribute('opacity') !== '0').length,
      mergedFigure: document.querySelector('[data-merged-figure]')?.getAttribute('transform'),
      mergedVisible: document.querySelector('[data-merged-figure]')?.getAttribute('opacity'),
      deliveryFigure: document.querySelector('[data-delivery-figure]')?.getAttribute('transform'),
      deliveryVisible: document.querySelector('[data-delivery-figure]')?.getAttribute('opacity'),
      captionTitle: document.querySelector('.appzpos-order-flow__caption h3')?.textContent.trim()
    }))())`));
    states.push(state);
    if (state.activeStep !== expectedSteps[index]) {
      failures.push(`${width}px at ${progress}: expected active step ${expectedSteps[index]}, found ${state.activeStep}`);
    }
  }

  const start = states[0];
  const merged = states[4];
  const finish = states.at(-1);
  if (start.entryFiguresVisible !== 4) failures.push(`${width}px: four entry figures are not visible at the start`);
  if (merged.entryFiguresVisible !== 0 || merged.mergedVisible !== '1') failures.push(`${width}px: orders do not merge at Queue`);
  const translatedX = (transform) => Number(transform?.match(/translate\(([-\d.]+)/)?.[1]);
  if (finish.deliveryVisible !== '1' || translatedX(finish.deliveryFigure) < 859.5) failures.push(`${width}px: delivery figure does not arrive at Order Hub`);
  if (finish.mergedVisible !== '1' || translatedX(finish.mergedFigure) < 859.5) failures.push(`${width}px: merged order does not arrive at Order Hub`);

  layouts[width] = { initial, states };

  if (screenshotDirectory && (width === 1440 || width === 430)) {
    await evaluate(`(() => {
      const section = document.querySelector('.appzpos-order-flow');
      const stage = document.querySelector('.appzpos-order-flow__stage');
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const distance = section.getBoundingClientRect().height - stage.getBoundingClientRect().height;
      window.scrollTo(0, sectionTop + (.42 * distance));
    })()`);
    await wait(120);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    mkdirSync(screenshotDirectory, { recursive: true });
    writeFileSync(`${screenshotDirectory}/order-flow-${width}.png`, Buffer.from(screenshot.data, 'base64'));
  }
}

await send('Emulation.setDeviceMetricsOverride', {
  width: 430,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 430,
  screenHeight: 844
});
await send('Emulation.setEmulatedMedia', {
  media: 'screen',
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
});
await send('Page.navigate', { url: `${previewUrl}?order-flow-regression-reduced-motion` });
await wait(700);
const reducedMotion = JSON.parse(await evaluate(`JSON.stringify({
  staticSteps: document.querySelectorAll('.appzpos-order-flow__static-step').length,
  animatedScroll: Boolean(document.querySelector('.appzpos-order-flow__scroll')),
  bodyHeight: document.body.scrollHeight
})`));

if (reducedMotion.staticSteps !== 7) failures.push(`reduced motion: expected seven static steps, found ${reducedMotion.staticSteps}`);
if (reducedMotion.animatedScroll) failures.push('reduced motion: sticky animated scene is still rendered');

await send('Page.close');
socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures, reducedMotion, layouts }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', reducedMotion, checkedViewports: viewports }, null, 2));
