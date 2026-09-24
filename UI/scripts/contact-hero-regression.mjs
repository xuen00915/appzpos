const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4300/';
const screenshotDir = process.env.APPZPOS_SCREENSHOT_DIR ?? '';
const contactUrl = new URL('point-of-sales-demo-quotation', previewUrl).href;
const expectedTitle = 'Request a Free Demo Today | POS Quote | Contact APPZPOS';
const expectedHeading = 'Contact APPZPOS for Point of Sale Demo';
const expectedDescription = "For inquiries, quotes, meetings, POS demo, or information about our products, contact us at +65 8310 9631 or fill out the form below. We're here to help!";
const knownPreviewIssuePatterns = [
  /embed\.tawk\.to/i,
  /No API Key defined for Google Maps/i,
  /unicons-14\.woff2/i,
  /OTS parsing error/i,
  /\[webpack-dev-server\] Warnings while compiling/i,
  /home-order-flow\.component\.html:45:108.*NG8107/is,
  /autoprefixer.*start value has mixed support/is,
  /point-of-sales-demo-quotation\?/i
];

const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(previewUrl)}`,
  { method: 'PUT' }
).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 0;
let browserIssues = [];

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') {
    browserIssues.push(`exception: ${message.params?.exceptionDetails?.text ?? 'Unknown runtime exception'}`);
  }
  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params?.type)) {
    const content = message.params.args?.map((argument) => argument.value ?? argument.description ?? '').join(' ');
    browserIssues.push(`${message.params.type}: ${content}`);
  }
  if (message.method === 'Log.entryAdded' && ['error', 'warning'].includes(message.params?.entry?.level)) {
    const entry = message.params.entry;
    browserIssues.push(`${entry.level}: ${entry.text}${entry.url ? ` (${entry.url})` : ''}`);
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
const viewports = [1440, 1280, 1024, 768, 390];
const viewportHeights = { 1440: 900, 1280: 900, 1024: 768, 768: 1024, 390: 844 };
const layouts = {};

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Network.clearBrowserCache');
if (screenshotDir) {
  const { mkdir } = await import('node:fs/promises');
  await mkdir(screenshotDir, { recursive: true });
}
for (const width of viewports) {
  browserIssues = [];
  const height = viewportHeights[width];
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
    screenWidth: width,
    screenHeight: height
  });
  await send('Page.navigate', { url: `${previewUrl}?contact-hero-regression-${width}-${Date.now()}` });
  await wait(1000);
  await send('Runtime.evaluate', {
    expression: `history.pushState({}, '', ${JSON.stringify(contactUrl)}); window.dispatchEvent(new PopStateEvent('popstate'));`
  });
  await wait(1000);

  await send('Runtime.evaluate', {
    expression: `(() => {
      window.__contactSendEmailCalls = 0;
      const initialForm = document.querySelector('.contact-form-panel')?.getBoundingClientRect();
      const initialDetails = document.querySelector('.contact-details-panel')?.getBoundingClientRect();
      window.__contactInitialColumnHeights = {
        form: initialForm?.height ?? 0,
        details: initialDetails?.height ?? 0
      };
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.__contactRequestUrl = String(url);
        return originalOpen.call(this, method, url, ...rest);
      };
      XMLHttpRequest.prototype.send = function(...args) {
        if (this.__contactRequestUrl?.includes('/SendEmail')) {
          window.__contactSendEmailCalls += 1;
          return;
        }
        return originalSend.apply(this, args);
      };
      document.querySelector('.contact-form-panel form')?.requestSubmit();
    })()`
  });
  await wait(100);

  const evaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const bounds = (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      };
      const hero = document.querySelector('.contact-hero');
      const copy = document.querySelector('.contact-hero__copy');
      const media = document.querySelector('.contact-hero__media');
      const image = media?.querySelector('img');
      const availability = [...document.querySelectorAll('.contact-availability')]
        .find((element) => element.getBoundingClientRect().width > 0);
      const availabilityHeading = availability?.querySelector('h2');
      const availabilityDescription = availability?.querySelector('p');
      const footer = document.querySelector('footer');
      const workspace = document.querySelector('.contact-workspace');
      const formPanel = workspace?.querySelector('.contact-form-panel');
      const formWidget = formPanel?.querySelector('.form-widget');
      const form = formPanel?.querySelector('form');
      const formRow = form?.querySelector(':scope > .row');
      const formControls = form ? [...form.querySelectorAll('input:not([type="submit"]), select, textarea')] : [];
      const message = form?.querySelector('#message');
      const submit = form?.querySelector('input[type="submit"]');
      const detailsPanel = workspace?.querySelector('.contact-details-panel');
      const address = detailsPanel?.querySelector('.contact-address');
      const map = detailsPanel?.querySelector('.contact-map-panel');
      const channels = detailsPanel?.querySelector('.contact-channels');
      const channelCards = channels ? [...channels.querySelectorAll('.feature-box')].map((card) => {
        const icon = card.querySelector('.fbox-icon');
        const content = card.querySelector('.fbox-content');
        const heading = card.querySelector('h3');
        const title = card.querySelector('.contact-channel__title');
        const link = card.querySelector('.subtitle a');
        return {
          card: bounds(card),
          icon: bounds(icon),
          content: bounds(content),
          display: getComputedStyle(card).display,
          flexDirection: getComputedStyle(card).flexDirection,
          title: title?.textContent?.trim() ?? '',
          detail: link?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
          iconColor: icon ? getComputedStyle(icon.querySelector('i')).color : '',
          headingColor: heading ? getComputedStyle(heading).color : '',
          titleColor: title ? getComputedStyle(title).color : '',
          linkColor: link ? getComputedStyle(link).color : '',
          borderTopWidth: getComputedStyle(card).borderTopWidth
        };
      }) : [];
      const scriptSources = [...document.scripts].map((script) => script.src).filter(Boolean);
      return {
        location: window.location.href,
        title: document.title,
        frameworkOverlay: Boolean(document.querySelector('vite-error-overlay, #webpack-dev-server-client-overlay, [data-nextjs-dialog-overlay]')),
        heading: hero?.querySelector('h1')?.textContent?.trim() ?? '',
        description: hero?.querySelector('.contact-hero__copy p')?.textContent?.trim() ?? '',
        image: image ? {
          alt: image.getAttribute('alt') ?? '',
          src: image.getAttribute('src') ?? '',
          loaded: image.complete && image.naturalWidth > 0,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          objectFit: getComputedStyle(image).objectFit,
          objectPosition: getComputedStyle(image).objectPosition
        } : null,
        hero: bounds(hero),
        copy: bounds(copy),
        media: bounds(media),
        availability: {
          panel: bounds(availability),
          headingAlign: availabilityHeading ? getComputedStyle(availabilityHeading).textAlign : '',
          description: bounds(availabilityDescription),
          descriptionAlign: availabilityDescription ? getComputedStyle(availabilityDescription).textAlign : ''
        },
        footer: bounds(footer),
        spacing: {
          aboveAvailability: hero && availability
            ? bounds(availability).y - (bounds(hero).y + bounds(hero).height) : null,
          belowAvailability: availabilityDescription && workspace
            ? bounds(workspace).y - (bounds(availabilityDescription).y + bounds(availabilityDescription).height) : null,
          beforeFooter: workspace && footer
            ? bounds(footer).y - (bounds(workspace).y + bounds(workspace).height) : null
        },
        contact: {
          initialColumnHeights: window.__contactInitialColumnHeights,
          workspace: bounds(workspace),
          workspacePresentation: workspace ? {
            backgroundColor: getComputedStyle(workspace).backgroundColor,
            borderTopWidth: getComputedStyle(workspace).borderTopWidth,
            boxShadow: getComputedStyle(workspace).boxShadow,
            paddingTop: getComputedStyle(workspace).paddingTop
          } : null,
          form: bounds(formPanel),
          formPresentation: formPanel ? {
            backgroundColor: getComputedStyle(formPanel).backgroundColor,
            borderTopWidth: getComputedStyle(formPanel).borderTopWidth,
            borderTopColor: getComputedStyle(formPanel).borderTopColor,
            boxShadow: getComputedStyle(formPanel).boxShadow,
            rowBackgroundColor: formRow ? getComputedStyle(formRow).backgroundColor : '',
            rowBorderTopWidth: formRow ? getComputedStyle(formRow).borderTopWidth : '',
            rowBoxShadow: formRow ? getComputedStyle(formRow).boxShadow : '',
            messageRows: Number(message?.getAttribute('rows') ?? 0),
            message: bounds(message),
            submit: bounds(submit),
            title: bounds(formPanel.querySelector('.fancy-title')),
            titleHeading: bounds(formPanel.querySelector('.fancy-title h3')),
            titleAlign: getComputedStyle(formPanel.querySelector('.fancy-title')).textAlign,
            widgetBackgroundColor: formWidget ? getComputedStyle(formWidget).backgroundColor : '',
            widgetBorderTopWidth: formWidget ? getComputedStyle(formWidget).borderTopWidth : '',
            widgetBoxShadow: formWidget ? getComputedStyle(formWidget).boxShadow : '',
            formBackgroundColor: form ? getComputedStyle(form).backgroundColor : '',
            formBorderTopWidth: form ? getComputedStyle(form).borderTopWidth : '',
            formBoxShadow: form ? getComputedStyle(form).boxShadow : '',
            row: bounds(formPanel.querySelector('form > .row')),
            groups: [...formPanel.querySelectorAll('.form-group')].map((group) => ({
              bounds: bounds(group),
              marginBottom: getComputedStyle(group).marginBottom
            })),
            enabledControlCount: formControls.filter((control) => !control.disabled).length,
            invalidControlCount: formControls.filter((control) => control.classList.contains('is-invalid')).length,
            visibleValidationCount: [...formPanel.querySelectorAll('.invalid-feedback')]
              .filter((element) => getComputedStyle(element).display !== 'none').length,
            sendEmailCalls: window.__contactSendEmailCalls ?? -1
          } : null,
          details: bounds(detailsPanel),
          address: bounds(address),
          addressText: address?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
          map: bounds(map),
          mapPresent: Boolean(map?.querySelector('iframe')),
          channels: bounds(channels),
          channelsInsideDetails: channels?.parentElement === detailsPanel,
          channelCards,
          actionLinks: channels ? [
            Boolean(channels.querySelector('a[href^="tel:"]')),
            Boolean(channels.querySelector('a[href^="https://wa.me/"]')),
            Boolean(channels.querySelector('a[href*="facebook.com/APPZPOS"]')),
            Boolean(channels.querySelector('a[href*="instagram.com/appzgatesolutions"]'))
          ] : []
        },
        tagging: {
          googleTagManagerLoaded: scriptSources.some((src) => src.includes('googletagmanager.com/gtm.js?id=GTM-N7VKTGG')),
          googleTagManagerFrame: Boolean(document.querySelector('iframe[src*="googletagmanager.com/ns.html?id=GTM-N7VKTGG"]')),
          dataLayerInitialized: Array.isArray(window.dataLayer) && window.dataLayer.some((entry) => entry?.event === 'gtm.js'),
          metaPixelLoaded: scriptSources.some((src) => src.includes('connect.facebook.net/en_US/fbevents.js')),
          metaPixelInitialized: typeof window.fbq === 'function',
          metaPixelFallback: Boolean(document.querySelector('img[src*="facebook.com/tr?id=892134809204935"]'))
        },
        page: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth
        }
      };
    })())`,
    returnByValue: true
  });
  layouts[width] = JSON.parse(evaluation.result.value);
  layouts[width].browserIssues = [...new Set(browserIssues)];
  layouts[width].relevantBrowserIssues = layouts[width].browserIssues.filter(
    (issue) => !knownPreviewIssuePatterns.some((pattern) => pattern.test(issue))
  );

  if (screenshotDir) {
    const { writeFile } = await import('node:fs/promises');
    const metrics = await send('Page.getLayoutMetrics');
    const contentSize = metrics.cssContentSize;
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: contentSize.width, height: contentSize.height, scale: 1 }
    });
    await writeFile(`${screenshotDir}/appzpos-contact-${width}.png`, Buffer.from(screenshot.data, 'base64'));
  }
}

await send('Page.close');
socket.close();

const failures = [];
for (const [width, layout] of Object.entries(layouts)) {
  if (layout.location !== contactUrl) failures.push(`${width}px: browser did not remain on the contact-page route`);
  if (layout.title !== expectedTitle) failures.push(`${width}px: contact-page title is missing or incorrect`);
  if (layout.frameworkOverlay) failures.push(`${width}px: a framework error overlay is visible`);
  if (layout.relevantBrowserIssues.length) failures.push(`${width}px: browser console contains relevant errors or warnings: ${layout.relevantBrowserIssues.join(' | ')}`);
  if (layout.heading !== expectedHeading) failures.push(`${width}px: hero heading differs from the approved wording`);
  if (layout.description !== expectedDescription) failures.push(`${width}px: hero description differs from the approved wording`);
  if (!layout.copy || !layout.media || !layout.image) failures.push(`${width}px: hero copy or support image is missing`);
  if (layout.image && !layout.image.loaded) failures.push(`${width}px: support image did not load`);
  if (layout.image && !layout.image.src.endsWith('appzpos-contact-support-original.png')) failures.push(`${width}px: hero does not use the clean original image asset`);
  if (layout.image && (layout.image.naturalWidth !== 3000 || layout.image.naturalHeight !== 997)) failures.push(`${width}px: hero image is not the original 3000 by 997 source`);
  if (layout.image && !/customer support specialist wearing a headset/i.test(layout.image.alt)) failures.push(`${width}px: support image alt text is not descriptive`);
  if (layout.image && layout.image.objectFit !== 'cover') failures.push(`${width}px: support image is not cropped responsively`);
  if (layout.image && layout.image.objectPosition !== '76% 50%') failures.push(`${width}px: support image crop is not focused on the headset operator`);
  if (!layout.availability.panel || layout.availability.headingAlign !== 'center' || layout.availability.descriptionAlign !== 'center') {
    failures.push(`${width}px: availability heading and description are not centered together`);
  }
  if (!layout.contact.workspace || !layout.contact.form || !layout.contact.details) failures.push(`${width}px: contact workspace content is missing`);
  if (!layout.contact.workspacePresentation
    || layout.contact.workspacePresentation.backgroundColor !== 'rgba(0, 0, 0, 0)'
    || layout.contact.workspacePresentation.borderTopWidth !== '0px'
    || layout.contact.workspacePresentation.boxShadow !== 'none'
    || layout.contact.workspacePresentation.paddingTop !== '0px') {
    failures.push(`${width}px: the overall two-column workspace is not transparent and borderless`);
  }
  if (!layout.contact.formPresentation) failures.push(`${width}px: contact form presentation could not be measured`);
  if (layout.contact.formPresentation && layout.contact.formPresentation.backgroundColor !== 'rgba(0, 0, 0, 0)') failures.push(`${width}px: contact form has a colored background`);
  if (layout.contact.formPresentation && (layout.contact.formPresentation.borderTopWidth !== '2px'
    || layout.contact.formPresentation.borderTopColor !== 'rgb(245, 130, 32)')) {
    failures.push(`${width}px: contact form is missing its APPZPOS-orange outer line`);
  }
  if (layout.contact.formPresentation && (layout.contact.formPresentation.titleAlign !== 'center'
    || !layout.contact.formPresentation.title || !layout.contact.formPresentation.titleHeading
    || Math.abs(
      layout.contact.formPresentation.titleHeading.x + (layout.contact.formPresentation.titleHeading.width / 2)
      - layout.contact.formPresentation.title.x - (layout.contact.formPresentation.title.width / 2)
    ) > 2)) failures.push(`${width}px: form heading is not centered`);
  if (layout.contact.formPresentation && (layout.contact.formPresentation.widgetBackgroundColor !== 'rgba(0, 0, 0, 0)'
    || layout.contact.formPresentation.widgetBorderTopWidth !== '0px'
    || layout.contact.formPresentation.widgetBoxShadow !== 'none'
    || layout.contact.formPresentation.formBackgroundColor !== 'rgba(0, 0, 0, 0)'
    || layout.contact.formPresentation.formBorderTopWidth !== '0px'
    || layout.contact.formPresentation.formBoxShadow !== 'none')) {
    failures.push(`${width}px: the legacy form container layer is still visible`);
  }
  if (layout.contact.formPresentation && (layout.contact.formPresentation.boxShadow !== 'none'
    || layout.contact.formPresentation.rowBackgroundColor !== 'rgba(0, 0, 0, 0)'
    || layout.contact.formPresentation.rowBorderTopWidth !== '0px'
    || layout.contact.formPresentation.rowBoxShadow !== 'none')) {
    failures.push(`${width}px: the form still renders an inner card layer`);
  }
  if (layout.contact.formPresentation && layout.contact.formPresentation.messageRows > 4) failures.push(`${width}px: message field is not compact`);
  if (layout.contact.formPresentation?.message && layout.contact.formPresentation?.submit && Math.abs(layout.contact.formPresentation.message.width - layout.contact.formPresentation.submit.width) > 1) failures.push(`${width}px: submit button does not span the same width as the form`);
  if (layout.contact.formPresentation && layout.contact.formPresentation.enabledControlCount !== 5) failures.push(`${width}px: one or more contact form controls are missing or disabled`);
  if (layout.contact.formPresentation && layout.contact.formPresentation.invalidControlCount !== 5) failures.push(`${width}px: invalid submission does not mark all required controls`);
  if (layout.contact.formPresentation && layout.contact.formPresentation.visibleValidationCount < 5) failures.push(`${width}px: invalid submission does not show all required validation messages`);
  if (layout.contact.formPresentation && layout.contact.formPresentation.sendEmailCalls !== 0) failures.push(`${width}px: invalid submission reached the email API`);
  if (!/5 Little Road, Cemtex Industrial Building, Singapore 536983/i.test(layout.contact.addressText)) failures.push(`${width}px: contact address is missing`);
  if (!layout.contact.mapPresent) failures.push(`${width}px: contact map is missing from the details column`);
  if (layout.contact.actionLinks.length !== 4 || layout.contact.actionLinks.some((present) => !present)) failures.push(`${width}px: contact details do not include phone, WhatsApp, Facebook and Instagram`);
  if (layout.contact.channelCards.length !== 4) failures.push(`${width}px: expected four contact cards`);
  if (!layout.contact.channelsInsideDetails) failures.push(`${width}px: contact cards are not directly below the map`);
  const expectedChannelCopy = [
    ['Speak to Us', '(65) 8310 9631'],
    ['WhatsApp Us', '(65) 8310 9631'],
    ['Follow Us on Facebook', '@APPZPOS'],
    ['Follow Us on Instagram', '@apppzgatesolutions']
  ];
  for (const [index, card] of layout.contact.channelCards.entries()) {
    if (card.display !== 'flex' || card.flexDirection !== 'row' || !card.icon || !card.content
      || card.content.x <= card.icon.x + card.icon.width) {
      failures.push(`${width}px: contact card ${index + 1} does not place its icon to the left of the wording`);
    }
    if (card.borderTopWidth !== '0px') failures.push(`${width}px: contact card ${index + 1} still has an outer border`);
    if (card.title !== expectedChannelCopy[index][0] || card.detail !== expectedChannelCopy[index][1]) {
      failures.push(`${width}px: contact card ${index + 1} wording differs (${card.title} / ${card.detail})`);
    }
  }
  if (layout.contact.channelCards.length === 4) {
    const firstCard = layout.contact.channelCards[0].card;
    if (layout.contact.channelCards.some(({ card }) => !card
      || Math.abs(card.width - firstCard.width) > 1
      || Math.abs(card.height - firstCard.height) > 1)) {
      failures.push(`${width}px: contact cards do not share the same size`);
    }
    const [first, second, third, fourth] = layout.contact.channelCards.map(({ card }) => card);
    if (Math.abs(first.y - second.y) > 1 || Math.abs(third.y - fourth.y) > 1
      || Math.abs(first.x - third.x) > 1 || Math.abs(second.x - fourth.x) > 1
      || third.y <= first.y || first.height > (Number(width) <= 575 ? 92 : 84)) {
      failures.push(`${width}px: contact cards are not a compact 2x2 grid`);
    }
  }
  const expectedBrandColors = ['rgb(0, 157, 240)', 'rgb(37, 211, 102)', 'rgb(24, 119, 242)', 'rgb(228, 64, 95)'];
  for (const [index, expectedColor] of expectedBrandColors.entries()) {
    const card = layout.contact.channelCards[index];
    if (card && (card.iconColor !== expectedColor || card.linkColor !== expectedColor
      || card.headingColor !== 'rgb(32, 39, 51)' || card.titleColor !== 'rgb(32, 39, 51)')) {
      failures.push(`${width}px: contact card ${index + 1} colors differ from the approved presentation`);
    }
  }
  if (!Object.values(layout.tagging).every(Boolean)) failures.push(`${width}px: Google Tag Manager or Meta Pixel tagging is missing`);
  if (layout.page.scrollWidth > layout.page.clientWidth) failures.push(`${width}px: page has horizontal overflow`);
  if (layout.hero && layout.availability.panel
    && layout.availability.panel.y - (layout.hero.y + layout.hero.height) > (Number(width) <= 575 ? 90 : 80)) {
    failures.push(`${width}px: spacing above Our Availability is still too large`);
  }
  if (layout.availability.description && layout.contact.workspace
    && layout.contact.workspace.y - (layout.availability.description.y + layout.availability.description.height) > 40) {
    failures.push(`${width}px: spacing below Our Availability is still too large`);
  }
  if (layout.contact.workspace && layout.footer
    && layout.footer.y - (layout.contact.workspace.y + layout.contact.workspace.height) > (Number(width) <= 575 ? 80 : 100)) {
    failures.push(`${width}px: spacing before the footer is still too large`);
  }
}

const desktop = layouts[1280];
for (const width of [1440, 1280, 1024]) {
  if (layouts[width].hero?.height !== 350) failures.push(`${width}px: desktop hero height is not reduced to 350px`);
}
if (layouts[768].hero?.height > 460 || layouts[390].hero?.height > 470) {
  failures.push('tablet or mobile hero remains too tall');
}
if (desktop.copy && desktop.media && desktop.media.x <= desktop.copy.x + desktop.copy.width) {
  failures.push('1280px: support image is not positioned to the right of the hero wording');
}
if (desktop.hero && desktop.media) {
  const mediaRight = desktop.media.x + desktop.media.width;
  const heroBottom = desktop.hero.y + desktop.hero.height;
  const mediaBottom = desktop.media.y + desktop.media.height;
  if (Math.abs(mediaRight - desktop.page.clientWidth) > 1) failures.push('1280px: support image does not reach the right viewport edge');
  if (Math.abs(desktop.media.y - desktop.hero.y) > 1 || Math.abs(mediaBottom - heroBottom) > 1) {
    failures.push('1280px: support image does not fill the hero from top to bottom');
  }
}
if (desktop.availability.description && desktop.availability.description.width < 1000) failures.push('1280px: availability content is not using the wider measure');
if (desktop.contact.form && desktop.contact.details && desktop.contact.details.x <= desktop.contact.form.x + desktop.contact.form.width) {
  failures.push('1280px: contact form is not positioned to the left of the details column');
}
if (desktop.contact.form && desktop.contact.details && Math.abs(desktop.contact.form.height - desktop.contact.details.height) > 2) {
  failures.push('1280px: contact form and details columns do not share the same total height');
}
if (desktop.contact.address && desktop.contact.map) {
  const addressBottom = desktop.contact.address.y + desktop.contact.address.height;
  if (desktop.contact.map.y < addressBottom) failures.push('1280px: address and map are not ordered vertically');
}
if (desktop.contact.map && desktop.contact.channels) {
  const mapBottom = desktop.contact.map.y + desktop.contact.map.height;
  if (desktop.contact.channels.y <= mapBottom) failures.push('1280px: contact cards are not below the map');
}
if (desktop.contact.form && desktop.contact.form.height > 760) failures.push('1280px: contact form remains too tall');
const mobile = layouts[390];
if (mobile.copy && mobile.media && mobile.media.y <= mobile.copy.y + mobile.copy.height) {
  failures.push('390px: support image is not stacked below the hero wording');
}
if (mobile.contact.form && mobile.contact.details && mobile.contact.details.y <= mobile.contact.form.y + mobile.contact.form.height) {
  failures.push('390px: contact details are not stacked below the form');
}
if (mobile.contact.form && mobile.contact.form.height > 850) failures.push('390px: contact form remains too tall');
if (mobile.contact.map && mobile.contact.map.height > 240) failures.push('390px: contact map remains too tall');
if (mobile.contact.channelCards.some((card) => card.card?.width < 160)) failures.push('390px: contact cards are too narrow for readable mobile labels and details');

for (const width of [1440, 1280, 1024]) {
  const layout = layouts[width];
  if (layout.copy && layout.media && layout.media.x <= layout.copy.x + layout.copy.width) {
    failures.push(`${width}px: desktop or laptop hero image is not positioned to the right of the wording`);
  }
  if (layout.contact.form && layout.contact.details && layout.contact.details.x <= layout.contact.form.x + layout.contact.form.width) {
    failures.push(`${width}px: desktop or laptop contact details are not positioned to the right of the form`);
  }
  if (!layout.contact.initialColumnHeights
    || Math.abs(layout.contact.initialColumnHeights.form - layout.contact.initialColumnHeights.details) > 2) {
    failures.push(`${width}px: the normal form section does not match the right-side total content height`);
  }
}

for (const width of [768, 390]) {
  const layout = layouts[width];
  if (layout.copy && layout.media && layout.media.y <= layout.copy.y + layout.copy.height) {
    failures.push(`${width}px: tablet or mobile hero image is not stacked below the wording`);
  }
  if (layout.contact.form && layout.contact.details && layout.contact.details.y <= layout.contact.form.y + layout.contact.form.height) {
    failures.push(`${width}px: tablet or mobile contact details are not stacked below the form`);
  }
}

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', layouts }, null, 2));
