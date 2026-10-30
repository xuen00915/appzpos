const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4313/';
const routes = [
  '',
  'custom-solutions',
  'point-of-sales-demo-quotation',
  'f&b-restaurant-cloud-pos-system',
  'retail-store-cloud-pos-system',
  'salon-cloud-pos-system',
  'psg-pos-system-grant-singapore',
  'cloud-pos-point-of-sales-system',
  'f&b-restaurant-emenu-qr-code-ordering-system',
  'f&b-restaurant-online-ordering-website',
  'self-order-kiosk-restaurant',
  'f&b-restaurant-kitchen-display-system',
  'f&b-restaurant-queue-number-display-system',
  'f&b-restaurant-delivery-integration',
  'pos-hardware-machine-receipt-printer',
  'pos-solutions-partner-integrations',
  'cn-f&b-restaurant-cloud-pos-system',
  'blog',
  'blog-bcrs'
];

const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(previewUrl)}`,
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
const failures = [];

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
  screenWidth: 1440,
  screenHeight: 900
});

for (const route of routes) {
  await send('Page.navigate', { url: new URL(route, previewUrl).href });
  await wait(500);
  const evaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const obsolete = /(?:Productivity Solutions Grant|\\bPSG\\b)/i;
      // Historical PSG references belong only in the explicit transition explanation.
      const transitionSelector = '.psg-transition, #psg-faq-title, #psg-faq-edge, #psg-faq-psg, #psg-faq-existing';
      const text = [...document.body.querySelectorAll('*')]
        .filter((element) => !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(element.tagName))
        .filter((element) => !element.children.length && !element.closest(transitionSelector))
        .map((element) => element.textContent.replace(/\\s+/g, ' ').trim())
        .filter(Boolean);
      const metadata = [
        document.title,
        document.querySelector('meta[name="description"]')?.content ?? ''
      ];
      const accessible = [...document.querySelectorAll('[aria-label], [alt], [title]')]
        .filter((element) => !element.closest(transitionSelector))
        .flatMap((element) => ['aria-label', 'alt', 'title']
          .map((attribute) => element.getAttribute(attribute) ?? ''))
        .filter(Boolean);
      const contactMessages = [...document.querySelectorAll('a[href*="wa.me"]')]
        .map((anchor) => decodeURIComponent(anchor.getAttribute('href') ?? ''));
      return {
        transitionClear: (() => {
          if (!document.querySelector('app-psg-pos-system-grant-singapore')) return true;
          const edge = document.querySelector('#psg-faq-edge')?.textContent ?? '';
          const psg = document.querySelector('#psg-faq-psg')?.textContent ?? '';
          const existing = document.querySelector('#psg-faq-existing')?.textContent ?? '';
          return edge.includes('30 September 2026') && psg.includes('29 September 2026') &&
            psg.includes('new applications') && existing.includes('continue to be assessed under PSG') &&
            existing.includes('claim disbursement');
        })(),
        obsoleteCopy: [...new Set([...text, ...metadata, ...accessible, ...contactMessages]
          .filter((value) => obsolete.test(value)))],
        edgeCopy: [...text, ...metadata, ...accessible, ...contactMessages]
          .some((value) => /EDGE Grant/i.test(value)),
        tracking: {
          gtm: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
          pixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'))
        }
      };
    })())`,
    returnByValue: true
  });
  const result = JSON.parse(evaluation.result.value);
  if (!result.transitionClear) failures.push(`${route}: EDGE / PSG transition explanation is missing or incomplete`);
  if (result.obsoleteCopy.length) {
    failures.push(`${route || '/'}: obsolete grant copy (${result.obsoleteCopy.join(' | ')})`);
  }
  if (!result.edgeCopy) failures.push(`${route || '/'}: EDGE Grant copy is missing`);
  if (!result.tracking.gtm || !result.tracking.pixel) {
    failures.push(`${route || '/'}: tracking hooks changed (${JSON.stringify(result.tracking)})`);
  }
}

await send('Page.close');
socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

console.log(`EDGE Grant copy regression passed for ${routes.length} public routes.`);
