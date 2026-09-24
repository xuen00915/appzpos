const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4313/';
const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${previewUrl}?english-home-rhythm`)}`,
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
const profiles = [
  { width: 1440, height: 1000, maximumBoundarySpace: 104 },
  { width: 768, height: 1024, maximumBoundarySpace: 88 },
  { width: 390, height: 844, maximumBoundarySpace: 72 }
];
const expectedSections = [
  'hero', 'island', 'integrated-pos', 'grow-your-business', 'grant',
  'industries', 'key-features', 'customers', 'reviews', 'form'
];
const layouts = {};
const failures = [];

await send('Page.enable');
for (const profile of profiles) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: 1,
    mobile: profile.width <= 768,
    screenWidth: profile.width,
    screenHeight: profile.height
  });
  await send('Page.navigate', { url: `${previewUrl}?english-home-rhythm-${profile.width}` });
  await wait(1400);

  const evaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const root = document.querySelector('[data-home-page-template][lang="en"]');
      const sectionNames = ${JSON.stringify(expectedSections.slice(1))};
      const sectionElements = sectionNames
        .map((name) => root?.querySelector('[data-home-section="' + name + '"]'))
        .filter(Boolean);
      const metrics = sectionElements.map((element) => {
        const style = getComputedStyle(element);
        return {
          name: element.getAttribute('data-home-section'),
          paddingTop: parseFloat(style.paddingTop),
          paddingBottom: parseFloat(style.paddingBottom),
          marginTop: parseFloat(style.marginTop),
          marginBottom: parseFloat(style.marginBottom)
        };
      });
      const boundarySpaces = metrics.slice(1).map((current, index) => ({
        from: metrics[index].name,
        to: current.name,
        space: metrics[index].paddingBottom + metrics[index].marginBottom
          + current.marginTop + current.paddingTop
      }));
      const eyebrowSelectors = [
        '.appz-ecosystem__eyebrow',
        '.appz-kicker',
        '.appz-demo__eyebrow'
      ].join(',');
      const visibleEyebrows = [...(root?.querySelectorAll(eyebrowSelectors) ?? [])]
        .filter((element) => {
          const style = getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length;
        })
        .map((element) => element.textContent.replace(/\\s+/g, ' ').trim());
      return {
        rootLanguage: root?.getAttribute('lang'),
        sections: [...(root?.querySelectorAll('[data-home-section]') ?? [])]
          .map((section) => section.getAttribute('data-home-section')),
        visibleEyebrows,
        metrics,
        boundarySpaces,
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        tracking: {
          gtm: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
          pixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')),
          requestDemo: Boolean(document.querySelector('[data-track-cta="request-demo"]'))
        }
      };
    })())`,
    returnByValue: true
  });
  const layout = JSON.parse(evaluation.result.value);
  layouts[profile.width] = layout;

  if (layout.rootLanguage !== 'en') failures.push(`${profile.width}px: English homepage root is missing`);
  if (JSON.stringify(layout.sections) !== JSON.stringify(expectedSections)) {
    failures.push(`${profile.width}px: homepage section tags changed (${layout.sections.join(', ')})`);
  }
  if (layout.visibleEyebrows.length) {
    failures.push(`${profile.width}px: section eyebrow labels remain visible (${layout.visibleEyebrows.join(', ')})`);
  }
  if (layout.pageOverflow) failures.push(`${profile.width}px: page has horizontal overflow`);
  if (!layout.tracking.gtm || !layout.tracking.pixel || !layout.tracking.requestDemo) {
    failures.push(`${profile.width}px: tracking hooks changed (${JSON.stringify(layout.tracking)})`);
  }
  for (const boundary of layout.boundarySpaces) {
    if (boundary.space > profile.maximumBoundarySpace) {
      failures.push(`${profile.width}px: ${boundary.from} to ${boundary.to} uses ${boundary.space}px of combined spacing; expected at most ${profile.maximumBoundarySpace}px`);
    }
  }
}

socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts }, null, 2));
  process.exit(1);
}

console.log('English homepage rhythm regression passed at desktop, tablet, and mobile widths.');
