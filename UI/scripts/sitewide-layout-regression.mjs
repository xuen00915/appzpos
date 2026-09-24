const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4313/';
const target = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(previewUrl)}`, { method: 'PUT' })
  .then(response => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 0;
socket.addEventListener('message', event => {
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
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const routes = ['', 'custom-solutions', 'point-of-sales-demo-quotation',
  'f&b-restaurant-cloud-pos-system', 'retail-store-cloud-pos-system', 'salon-cloud-pos-system',
  'psg-pos-system-grant-singapore', 'cloud-pos-point-of-sales-system',
  'f&b-restaurant-emenu-qr-code-ordering-system', 'f&b-restaurant-online-ordering-website',
  'self-order-kiosk-restaurant', 'f&b-restaurant-kitchen-display-system',
  'f&b-restaurant-queue-number-display-system', 'f&b-restaurant-delivery-integration',
  'pos-hardware-machine-receipt-printer', 'pos-solutions-partner-integrations',
  'cn-f&b-restaurant-cloud-pos-system', 'blog', 'blog-bcrs'];
const viewports = [
  { width: 1440, height: 900 }, { width: 1366, height: 768 },
  { width: 1024, height: 768 }, { width: 768, height: 1024 },
  { width: 390, height: 844 }, { width: 375, height: 667 }
];
const shellSelector = [
  '.appzpos-header__inner', '.appzpos-container', '.appz-section',
  '.solution-island-hero__inner', '[data-solution-hero] .appz-solution-hero__inner',
  '.appz-conversion-panel', '.industries__experience',
  '.features-hero__inner', '.hardware-hero__inner', '.partners-hero__inner', '.blog-hero__inner'
].join(',');
const failures = [];
await send('Page.enable');
for (const viewport of viewports) {
  await send('Emulation.setDeviceMetricsOverride', {
    ...viewport, deviceScaleFactor: 1, mobile: viewport.width <= 768,
    screenWidth: viewport.width, screenHeight: viewport.height
  });
  for (const route of routes) {
    await send('Page.navigate', { url: new URL(route, previewUrl).href });
    await wait(350);
    await send('Runtime.evaluate', { expression: "window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll'))" });
    await wait(350);
    const evaluation = await send('Runtime.evaluate', {
      expression: `JSON.stringify((() => {
        const visible = node => { const r = node.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const shells = [...document.querySelectorAll(${JSON.stringify(shellSelector)})].filter(visible).map(node => {
          const r = node.getBoundingClientRect(); const s = getComputedStyle(node);
          return { selector: node.className, x: r.x, right: r.right, width: r.width,
            paddingLeft: parseFloat(s.paddingLeft), paddingRight: parseFloat(s.paddingRight) };
        });
        const titles = [...document.querySelectorAll('.appz-section-title')].filter(visible).map(node => {
          const s = getComputedStyle(node); return { text: node.textContent.trim(), family: s.fontFamily,
            size: parseFloat(s.fontSize), weight: s.fontWeight, line: parseFloat(s.lineHeight),
            spacing: parseFloat(s.letterSpacing), lang: node.closest('[lang]')?.getAttribute('lang') || 'en' };
        });
        const rail = document.querySelector('.appz-site-floating-contacts');
        const railBounds = rail?.getBoundingClientRect();
        const whatsapp = rail?.querySelector('.btn-whatsapp');
        const messenger = rail?.querySelector('.btn-fb');
        const whatsappIcon = whatsapp?.querySelector('.fa-whatsapp');
        const scrollTop = document.querySelector('#gotoTop');
        const scrollTopStyles = scrollTop ? getComputedStyle(scrollTop) : null;
        const legacyControls = [...document.querySelectorAll('a.btn-whatsapp, a.btn-fb')]
          .filter(node => !node.closest('.appz-site-floating-contacts'));
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          shells,
          titles,
          floating: {
            rails: document.querySelectorAll('.appz-site-floating-contacts').length,
            visible: Boolean(rail && visible(rail)),
            position: rail ? getComputedStyle(rail).position : null,
            top: railBounds ? Math.round(railBounds.top) : null,
            whatsappHref: whatsapp?.getAttribute('href'),
            whatsappTarget: whatsapp?.getAttribute('target'),
            whatsappRel: whatsapp?.getAttribute('rel'),
            whatsappBackground: whatsapp ? getComputedStyle(whatsapp).backgroundColor : null,
            whatsappRadius: whatsapp ? getComputedStyle(whatsapp).borderRadius : null,
            whatsappIconColor: whatsappIcon ? getComputedStyle(whatsappIcon).color : null,
            messengerHref: messenger?.getAttribute('href'),
            messengerTarget: messenger?.getAttribute('target'),
            messengerRel: messenger?.getAttribute('rel'),
            legacyVisible: legacyControls.filter(visible).length,
            scrollTopRadius: scrollTopStyles?.borderRadius,
            scrollTopInitiallyHidden: scrollTopStyles?.opacity === '0'
              && scrollTopStyles?.visibility === 'hidden'
              && scrollTopStyles?.pointerEvents === 'none'
          }
        };
      })())`, returnByValue: true
    });
    const result = JSON.parse(evaluation.result.value);
    const profile = `${route || '/'} @ ${viewport.width}x${viewport.height}`;
    if (result.scrollWidth > result.clientWidth + 1) failures.push(`${profile}: horizontal overflow`);
    if (result.floating.rails !== 1 || !result.floating.visible || result.floating.position !== 'fixed'
      || Math.abs(result.floating.top - (viewport.width <= 768
        ? Math.min(190, Math.max(140, viewport.height * .18))
        : Math.min(260, Math.max(170, viewport.height * .22)))) > 1
      || !result.floating.whatsappHref?.startsWith('https://wa.me/6583109631')
      || result.floating.whatsappTarget !== '_blank'
      || !result.floating.whatsappRel?.includes('noopener')
      || result.floating.whatsappBackground !== 'rgb(23, 107, 53)'
      || result.floating.whatsappRadius !== '50%'
      || result.floating.whatsappIconColor !== 'rgb(255, 255, 255)'
      || !result.floating.messengerHref?.includes('m.me/APPZPOS')
      || result.floating.messengerTarget !== '_blank'
      || !result.floating.messengerRel?.includes('noopener')
      || result.floating.legacyVisible !== 0
      || result.floating.scrollTopRadius !== '50%'
      || !result.floating.scrollTopInitiallyHidden) {
      failures.push(`${profile}: sitewide floating controls differ (${JSON.stringify(result.floating)})`);
    }
    for (const shell of result.shells) {
      if (viewport.width >= 1366 && shell.width > 1241) failures.push(`${profile}: shell wider than 1240px (${shell.width})`);
      if (viewport.width < 1279 && shell.x < 15 && shell.paddingLeft < 15) failures.push(`${profile}: shell lacks left gutter`);
      if (viewport.width < 1279 && shell.right > viewport.width - 15 && shell.paddingRight < 15) failures.push(`${profile}: shell lacks right gutter`);
    }
    for (const title of result.titles) {
      if (!title.family.includes('Manrope')) failures.push(`${profile}: section title does not use Manrope (${title.text})`);
      if (Number(title.weight) !== 750) failures.push(`${profile}: section title weight is ${title.weight} (${title.text})`);
      if (Math.abs(title.line - title.size * 1.08) > .75) failures.push(`${profile}: section title line-height differs (${title.text})`);
      const expectedSpacing = title.lang === 'zh' ? (viewport.width <= 767 ? .05 : .055) * title.size : -.04 * title.size;
      if (Math.abs(title.spacing - expectedSpacing) > .75) failures.push(`${profile}: section title tracking differs (${title.text})`);
    }
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, Math.min(700, document.documentElement.scrollHeight - innerHeight))' });
    await wait(350);
    const scrolledEvaluation = await send('Runtime.evaluate', {
      expression: `JSON.stringify((() => {
        const railBounds = document.querySelector('.appz-site-floating-contacts')?.getBoundingClientRect();
        const scrollTop = document.querySelector('#gotoTop');
        const scrollBounds = scrollTop?.getBoundingClientRect();
        const styles = scrollTop ? getComputedStyle(scrollTop) : null;
        return {
          scrollY,
          visible: styles?.opacity === '1' && styles?.visibility === 'visible' && styles?.pointerEvents !== 'none',
          belowContacts: Boolean(railBounds && scrollBounds && railBounds.bottom < scrollBounds.top),
          gap: railBounds && scrollBounds ? Math.round(scrollBounds.top - railBounds.bottom) : null
        };
      })())`,
      returnByValue: true
    });
    const scrolled = JSON.parse(scrolledEvaluation.result.value);
    if (scrolled.scrollY > 0 && (!scrolled.visible || !scrolled.belowContacts
      || Math.abs(scrolled.gap - (viewport.width <= 768 ? 16 : 18)) > 1)) {
      failures.push(`${profile}: scroll-to-top is not revealed below contacts (${JSON.stringify(scrolled)})`);
    }
  }
}
await send('Page.close');
socket.close();
if (failures.length) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}
console.log(`APPZPOS sitewide layout contract passed for ${routes.length} routes at ${viewports.length} viewports.`);
