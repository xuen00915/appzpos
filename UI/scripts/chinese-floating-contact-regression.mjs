import { writeFile } from 'node:fs/promises';

const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9227';
const previewUrl = process.env.APPZPOS_PREVIEW_URL
  ?? 'http://127.0.0.1:4314/cn-f&b-restaurant-cloud-pos-system';
const screenshotDirectory = process.env.APPZPOS_SCREENSHOT_DIR;
const viewports = [1440, 390];
const heights = { 1440: 900, 390: 844 };

const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(previewUrl)}`,
  { method: 'PUT' }
).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const runtimeProblems = [];
let nextId = 0;

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') {
    runtimeProblems.push(message.params.exceptionDetails.text);
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    runtimeProblems.push(`${message.params.entry.text} ${message.params.entry.url ?? ''}`.trim());
  }
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
const layouts = {};

const pageSnapshotExpression = `JSON.stringify((() => {
  const describe = (selector) => {
    const link = document.querySelector(selector);
    const image = link?.querySelector('img');
    const brandIcon = link?.querySelector('.fa-whatsapp');
    const bounds = link?.getBoundingClientRect();
    const styles = link ? getComputedStyle(link) : null;
    const brandIconStyles = brandIcon ? getComputedStyle(brandIcon) : null;
    return {
      present: Boolean(link),
      visible: Boolean(bounds && bounds.width > 0 && bounds.height > 0 && styles?.visibility !== 'hidden' && styles?.opacity !== '0'),
      bounds: bounds ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height } : null,
      className: link?.className ?? '',
      href: link?.getAttribute('href') ?? '',
      target: link?.target ?? '',
      rel: link?.rel ?? '',
      styles: styles ? {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow
      } : null,
      brandIcon: {
        present: Boolean(brandIcon),
        backgroundColor: brandIconStyles?.backgroundColor ?? '',
        color: brandIconStyles?.color ?? ''
      },
      image: {
        src: image?.currentSrc ?? '',
        alt: image?.alt ?? '',
        loading: image?.loading ?? '',
        complete: image?.complete ?? false,
        naturalWidth: image?.naturalWidth ?? 0,
        naturalHeight: image?.naturalHeight ?? 0
      }
    };
  };
  const rail = document.querySelector('#webview.appzpos-floating-contacts');
  const railBounds = rail?.getBoundingClientRect();
  const railStyles = rail ? getComputedStyle(rail) : null;
  const scrollTop = document.querySelector('#gotoTop');
  const scrollTopBounds = scrollTop?.getBoundingClientRect();
  const scrollTopStyles = scrollTop ? getComputedStyle(scrollTop) : null;
  const skip = document.querySelector('.appzpos-order-flow__skip');
  const skipBounds = skip?.getBoundingClientRect();
  return {
    whatsapp: describe('#webview a.btn-whatsapp'),
    messenger: describe('#webview a.btn-fb'),
    floatingRail: railStyles ? {
      position: railStyles.position,
      flexDirection: railStyles.flexDirection,
      gap: railStyles.gap,
      bounds: railBounds ? {
        x: railBounds.x,
        y: railBounds.y,
        width: railBounds.width,
        height: railBounds.height
      } : null
    } : null,
    scrollTop: {
      present: Boolean(scrollTop),
      visible: Boolean(scrollTopBounds && scrollTopBounds.width > 0 && scrollTopBounds.height > 0
        && scrollTopStyles?.visibility !== 'hidden' && scrollTopStyles?.opacity !== '0'
        && scrollTopStyles?.pointerEvents !== 'none'),
      bounds: scrollTopBounds ? {
        x: scrollTopBounds.x,
        y: scrollTopBounds.y,
        width: scrollTopBounds.width,
        height: scrollTopBounds.height
      } : null,
      borderRadius: scrollTopStyles?.borderRadius ?? '',
      bodyActive: document.body.classList.contains('gototop-active')
    },
    skipBounds: skipBounds ? {
      x: skipBounds.x,
      y: skipBounds.y,
      width: skipBounds.width,
      height: skipBounds.height
    } : null,
    heroCopyBounds: [...document.querySelectorAll('.appzpos-product-hero h1, .appzpos-product-hero__intro, .appzpos-product-hero__actions')]
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
      }),
    tracking: {
      googleTagManager: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
      facebookPixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'))
    },
    page: {
      url: window.location.href,
      title: document.title,
      textLength: document.body.innerText.trim().length,
      frameworkOverlay: Boolean(document.querySelector('webpack-dev-server-client-overlay, vite-error-overlay, #webpack-dev-server-client-overlay')),
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      scrollY: window.scrollY
    }
  };
})())`;

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
for (const width of viewports) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: heights[width],
    deviceScaleFactor: 1,
    mobile: width < 600,
    screenWidth: width,
    screenHeight: heights[width]
  });
  await send('Page.navigate', { url: `${previewUrl}?floating-contact-${width}-${Date.now()}` });
  await wait(1800);

  const initialEvaluation = await send('Runtime.evaluate', {
    expression: pageSnapshotExpression,
    returnByValue: true
  });
  const initial = JSON.parse(initialEvaluation.result.value);
  if (screenshotDirectory) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`${screenshotDirectory}/appzpos-floating-top-${width}.png`, screenshot.data, 'base64');
  }

  const clickEvaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const clicks = [];
      for (const selector of ['#webview a.btn-whatsapp', '#webview a.btn-fb']) {
        const link = document.querySelector(selector);
        link?.addEventListener('click', (event) => {
          event.preventDefault();
          clicks.push({ href: link.getAttribute('href'), target: link.target });
        }, { once: true });
        link?.click();
      }
      return clicks;
    })())`,
    returnByValue: true
  });
  const contactClicks = JSON.parse(clickEvaluation.result.value);

  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 900)' });
  await wait(700);
  const scrolledEvaluation = await send('Runtime.evaluate', {
    expression: pageSnapshotExpression,
    returnByValue: true
  });
  const scrolled = JSON.parse(scrolledEvaluation.result.value);
  if (screenshotDirectory) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`${screenshotDirectory}/appzpos-floating-scrolled-${width}.png`, screenshot.data, 'base64');
  }

  await send('Runtime.evaluate', { expression: "document.querySelector('#gotoTop')?.click()" });
  await wait(1000);
  const returnedEvaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      scrollY: window.scrollY,
      scrollTopVisible: (() => {
        const button = document.querySelector('#gotoTop');
        const styles = button ? getComputedStyle(button) : null;
        return Boolean(styles && styles.visibility !== 'hidden' && styles.opacity !== '0' && styles.pointerEvents !== 'none');
      })()
    })`,
    returnByValue: true
  });

  layouts[width] = {
    ...initial,
    contactClicks,
    scrollBehavior: {
      initial: initial.scrollTop,
      scrolled: scrolled.scrollTop,
      scrolledSkipBounds: scrolled.skipBounds,
      returned: JSON.parse(returnedEvaluation.result.value)
    }
  };
}

await send('Page.close');
socket.close();

const failures = [];
const expectations = {
  whatsapp: {
    className: 'btn-whatsapp',
    href: "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
    imageName: 'APPZPOS%20Point%20of%20Sales%20WhatsApp%20Us.png',
    alt: 'APPZPOS Point of Sales WhatsApp Us',
    ringColor: 'rgba(23, 107, 53'
  },
  messenger: {
    className: 'btn-fb',
    href: "http://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!",
    imageName: 'APPZPOS%20Point%20of%20Sales%20Messenger%20Us.png',
    alt: 'APPZPOS Point of Sales Messenger Us',
    ringColor: 'rgba(22, 136, 216'
  }
};

for (const width of viewports) {
  const layout = layouts[width];
  const maximumSize = width === 390 ? 48 : 52;
  for (const [channel, expected] of Object.entries(expectations)) {
    const contact = layout[channel];
    if (!contact.present) failures.push(`${width}px: ${channel} link is missing`);
    if (!contact.visible) failures.push(`${width}px: ${channel} link is not visible`);
    if (!contact.className.split(/\s+/).includes(expected.className)) failures.push(`${width}px: ${channel} legacy class is missing`);
    if (contact.href !== expected.href) failures.push(`${width}px: ${channel} destination changed`);
    if (contact.target !== '_blank') failures.push(`${width}px: ${channel} no longer opens in a new tab`);
    if (!contact.rel.split(/\s+/).includes('noopener')) failures.push(`${width}px: ${channel} is missing noopener`);
    if (!contact.image.src.includes(expected.imageName)) failures.push(`${width}px: ${channel} does not use its original image`);
    if (contact.image.alt !== expected.alt) failures.push(`${width}px: ${channel} alt text changed`);
    if (contact.image.loading !== 'lazy') failures.push(`${width}px: ${channel} image is not lazy loaded`);
    if (!contact.image.complete || contact.image.naturalWidth !== 80 || contact.image.naturalHeight !== 80) {
      failures.push(`${width}px: ${channel} original 80×80 image did not load`);
    }
    if (contact.bounds?.width > maximumSize || contact.bounds?.height > maximumSize) {
      failures.push(`${width}px: ${channel} exceeds the ${maximumSize}px floating-control size`);
    }
    if (parseFloat(contact.styles?.borderRadius ?? '0') < maximumSize / 2 - 1) {
      failures.push(`${width}px: ${channel} control is not circular`);
    }
    if (contact.styles?.backgroundColor === 'rgba(0, 0, 0, 0)' || contact.styles?.boxShadow === 'none') {
      failures.push(`${width}px: ${channel} is missing the premium surface treatment`);
    }
    if ((contact.styles?.boxShadow.match(new RegExp(expected.ringColor.replace('(', '\\('), 'g')) ?? []).length < 2) {
      failures.push(`${width}px: ${channel} is missing the reference-style layered color rings`);
    }
  }
  if (!layout.whatsapp.brandIcon.present
    || layout.whatsapp.styles.backgroundColor !== 'rgb(23, 107, 53)'
    || layout.whatsapp.brandIcon.backgroundColor !== 'rgba(0, 0, 0, 0)'
    || layout.whatsapp.brandIcon.color !== 'rgb(255, 255, 255)') {
    failures.push(`${width}px: WhatsApp button is not solid green with a white mark`);
  }
  if (layout.floatingRail?.position !== 'fixed' || layout.floatingRail?.flexDirection !== 'column') {
    failures.push(`${width}px: floating contacts are not arranged as a fixed vertical rail`);
  }
  const expectedRailBottom = width === 390 ? 120 : 134;
  const railBottom = heights[width] - (layout.floatingRail.bounds.y + layout.floatingRail.bounds.height);
  if (Math.abs(railBottom - expectedRailBottom) > 1) {
    failures.push(`${width}px: floating contact rail was not moved upward by the approved amount`);
  }
  if (layout.contactClicks.length !== 2
    || layout.contactClicks.some((click) => click.target !== '_blank' || !click.href)) {
    failures.push(`${width}px: a floating contact control did not respond as an external link`);
  }
  const { initial, scrolled, scrolledSkipBounds, returned } = layout.scrollBehavior;
  if (!initial.present) failures.push(`${width}px: scroll-to-top control is missing`);
  if (initial.visible) failures.push(`${width}px: scroll-to-top is visible before the user scrolls`);
  if (!scrolled.bodyActive || !scrolled.visible) failures.push(`${width}px: scroll-to-top does not appear after scrolling down`);
  if (scrolled.bounds && parseFloat(scrolled.borderRadius) < scrolled.bounds.width / 2 - 1) {
    failures.push(`${width}px: scroll-to-top control is not circular`);
  }
  if (scrolled.bounds && layout.messenger.bounds) {
    const messengerBottom = layout.messenger.bounds.y + layout.messenger.bounds.height;
    const gap = scrolled.bounds.y - messengerBottom;
    if (Math.abs(scrolled.bounds.x - layout.messenger.bounds.x) > 1 || gap < 6 || gap > 16) {
      failures.push(`${width}px: scroll-to-top is not aligned directly beneath Messenger`);
    }
    const expectedScrollBottom = width === 390 ? 64 : 72;
    const scrollBottom = heights[width] - (scrolled.bounds.y + scrolled.bounds.height);
    if (Math.abs(scrollBottom - expectedScrollBottom) > 1) {
      failures.push(`${width}px: scroll-to-top was not moved upward with the contact rail`);
    }
  }
  const overlaps = (first, second) => first && second
    && first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y;
  if (overlaps(scrolled.bounds, scrolledSkipBounds)) {
    failures.push(`${width}px: scroll-to-top overlaps the ordering-flow skip control`);
  }
  if (returned.scrollY > 2) failures.push(`${width}px: scroll-to-top click did not return the page to the top`);
  if (returned.scrollTopVisible) failures.push(`${width}px: scroll-to-top remains visible after returning to the top`);
  if (!layout.tracking.googleTagManager) failures.push(`${width}px: Google Tag Manager GTM-N7VKTGG is missing`);
  if (!layout.tracking.facebookPixel) failures.push(`${width}px: Meta Pixel loader is missing`);
  if (!layout.page.url.includes('/cn-f&b-restaurant-cloud-pos-system')) failures.push(`${width}px: wrong page rendered`);
  if (!layout.page.title || layout.page.textLength < 1000) failures.push(`${width}px: page is blank or missing meaningful content`);
  if (layout.page.frameworkOverlay) failures.push(`${width}px: framework error overlay is visible`);
  if (layout.page.scrollWidth > layout.page.clientWidth) failures.push(`${width}px: floating contacts cause horizontal overflow`);
  if (width === 390) {
    for (const [channel, contact] of Object.entries({ whatsapp: layout.whatsapp, messenger: layout.messenger })) {
      if (layout.heroCopyBounds.some((bounds) => overlaps(contact.bounds, bounds))) {
        failures.push(`${width}px: ${channel} obscures hero copy or actions`);
      }
    }
  }
}

const relevantRuntimeProblems = runtimeProblems.filter((problem) => !/tawk|ERR_BLOCKED_BY_CLIENT|favicon/i.test(problem));
if (relevantRuntimeProblems.length) {
  failures.push(`runtime errors: ${[...new Set(relevantRuntimeProblems)].join(' | ')}`);
}

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', layouts }, null, 2));
