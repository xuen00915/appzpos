const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4300/';
const chromeEndpoint = `http://127.0.0.1:${cdpPort}`;

const target = await fetch(`${chromeEndpoint}/json/new?${encodeURIComponent(previewUrl)}`, { method: 'PUT' })
  .then((response) => response.json());
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

const routes = ['', 'custom-solutions', 'point-of-sales-demo-quotation',
  'f&b-restaurant-cloud-pos-system', 'retail-store-cloud-pos-system', 'salon-cloud-pos-system',
  'psg-pos-system-grant-singapore', 'cloud-pos-point-of-sales-system',
  'f&b-restaurant-emenu-qr-code-ordering-system', 'f&b-restaurant-online-ordering-website',
  'self-order-kiosk-restaurant', 'f&b-restaurant-kitchen-display-system',
  'f&b-restaurant-queue-number-display-system', 'f&b-restaurant-delivery-integration',
  'pos-hardware-machine-receipt-printer', 'pos-solutions-partner-integrations',
  'cn-f&b-restaurant-cloud-pos-system', 'blog', 'blog-bcrs'];
const failures = [];
const landingRoutes = new Set(['', 'cn-f&b-restaurant-cloud-pos-system']);
const expectedCallHref = 'tel:+6583109631';
const expectedWhatsAppHref = "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";
const expectedMessengerHref = "https://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";

await send('Page.enable');
await send('Page.navigate', { url: previewUrl });
await wait(700);
for (const route of routes) {
  const routeUrl = new URL(route, previewUrl).href;
  await send('Runtime.evaluate', {
    expression: `window.history.pushState({}, '', ${JSON.stringify(routeUrl)}); window.dispatchEvent(new PopStateEvent('popstate'));`
  });
  await wait(700);
  const evaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content ?? '',
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      gtm: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
      pixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')),
      whatsapp: document.querySelectorAll('a[href^="https://wa.me/6583109631"]').length,
      messenger: document.querySelectorAll('a[href^="https://m.me/APPZPOS"], a[href^="http://m.me/APPZPOS"]').length,
      requestDemoIds: document.querySelectorAll('#requestdemo').length,
      trackedCtas: [...document.querySelectorAll('[data-track-cta]')]
        .map((node) => node.getAttribute('data-track-cta')),
      formNames: [...document.querySelectorAll('#requestdemo input[name], #requestdemo textarea[name], #requestdemo select[name]')]
        .map((node) => node.getAttribute('name')),
      headerPosition: document.querySelector('#header')
        ? getComputedStyle(document.querySelector('#header')).position
        : null,
      callHref: document.querySelector('[aria-label="Call APPZPOS"]')?.getAttribute('href'),
      whatsappHref: document.querySelector('[aria-label="WhatsApp APPZPOS"]')?.getAttribute('href'),
      messengerHref: document.querySelector('[aria-label="Message APPZPOS on Messenger"]')?.getAttribute('href')
    }))())`,
    returnByValue: true
  });
  const result = JSON.parse(evaluation.result.value);
  if (!result.title) failures.push(`${route || '/'}: title missing`);
  if (!result.description) failures.push(`${route || '/'}: description missing`);
  if (result.overflow) failures.push(`${route || '/'}: horizontal overflow`);
  if (!result.gtm) failures.push(`${route || '/'}: GTM missing`);
  if (!result.pixel) failures.push(`${route || '/'}: Meta Pixel missing`);
  if (!result.whatsapp) failures.push(`${route || '/'}: WhatsApp action missing`);
  if (!result.messenger) failures.push(`${route || '/'}: Messenger action missing`);
  if (!['fixed', 'sticky'].includes(result.headerPosition)) {
    failures.push(`${route || '/'}: header is not sticky or fixed (${result.headerPosition})`);
  }
  if (result.callHref !== expectedCallHref) failures.push(`${route || '/'}: call action changed`);
  if (result.whatsappHref !== expectedWhatsAppHref) failures.push(`${route || '/'}: header WhatsApp action changed`);
  if (result.messengerHref !== expectedMessengerHref) failures.push(`${route || '/'}: header Messenger action changed`);
  if (result.requestDemoIds > 1) failures.push(`${route || '/'}: duplicate #requestdemo anchors`);
  if (result.requestDemoIds === 1 && (!result.formNames.length || result.formNames.some((name) => !name))) {
    failures.push(`${route || '/'}: request-demo form field names missing`);
  }
  if (landingRoutes.has(route)
    && (!result.trackedCtas.includes('request-demo') || !result.trackedCtas.includes('link'))) {
    failures.push(`${route || '/'}: landing hero CTA tracking changed (${result.trackedCtas.join(', ')})`);
  }
}

await send('Page.close');
socket.close();
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`APPZPOS runtime contract passed for ${routes.length} routes.`);
