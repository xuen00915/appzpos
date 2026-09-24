const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4318/';
const screenshotDirectory = process.env.APPZPOS_SCREENSHOT_DIR;
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

const viewports = [
  { width: 1440, height: 1000, label: 'laptop' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 390, height: 844, label: 'mobile' }
];
const expectedTitle = 'What is BCRS in Singapore? A Complete Guide for F&B Businesses (2026 Update)';
const failures = [];

await send('Page.enable');
for (const viewport of viewports) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width < 600,
    screenWidth: viewport.width,
    screenHeight: viewport.height
  });
  await send('Page.navigate', { url: previewUrl });
  await wait(700);
  await evaluate(`history.pushState({}, '', '/blog-bcrs'); window.dispatchEvent(new PopStateEvent('popstate'));`);
  await wait(800);

  const result = JSON.parse(await evaluate(`JSON.stringify((() => {
    const bounds = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height };
    };
    const shell = document.querySelector('.blog-detail__shell');
    const hero = document.querySelector('.blog-detail__hero');
    const title = document.querySelector('.blog-detail .entry-title h2');
    const meta = document.querySelector('.blog-detail .entry-meta');
    const imageFrame = document.querySelector('.blog-detail__image');
    const image = imageFrame?.querySelector('img');
    const content = document.querySelector('.blog-detail__content');
    const externalLink = content?.querySelector('a[href="https://bcrs.sg/"]');
    const builtInLink = [...(content?.querySelectorAll('a') ?? [])]
      .find((link) => link.textContent.trim() === 'built-in BCRS deposit handling');
    return {
      pathname: location.pathname,
      shell: bounds(shell),
      hero: bounds(hero),
      title: bounds(title),
      meta: bounds(meta),
      imageFrame: bounds(imageFrame),
      content: bounds(content),
      titleText: title?.textContent.trim(),
      dateText: meta?.textContent.replace(/\\s+/g, ' ').trim(),
      imageSrc: image?.getAttribute('src'),
      imageObjectFit: image ? getComputedStyle(image).objectFit : null,
      imageAspectRatio: imageFrame ? getComputedStyle(imageFrame).aspectRatio : null,
      titleMaxWidth: title ? getComputedStyle(title).maxWidth : null,
      titleTextWrap: title ? getComputedStyle(title).textWrap : null,
      titleFontSize: title ? parseFloat(getComputedStyle(title).fontSize) : null,
      paragraphCount: content?.querySelectorAll(':scope > p').length ?? 0,
      blockquoteCount: content?.querySelectorAll(':scope > blockquote').length ?? 0,
      externalLinkTarget: externalLink?.target,
      builtInLinkHref: builtInLink?.getAttribute('href'),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      frameworkOverlay: Boolean(document.querySelector('vite-error-overlay, #webpack-dev-server-client-overlay'))
    };
  })())`));

  const profile = viewport.label;
  if (result.pathname !== '/blog-bcrs') failures.push(`${profile}: blog detail route did not render`);
  if (!result.shell || !result.hero || !result.title || !result.meta || !result.imageFrame || !result.content) {
    failures.push(`${profile}: required blog detail regions are missing`);
    continue;
  }
  const expectedGutter = Math.max(16, Math.min(viewport.width * 0.03, 32));
  if (result.shell.left < expectedGutter - 1 || result.shell.right > viewport.width - expectedGutter + 1) {
    failures.push(`${profile}: site-width shell does not keep the expected gutters (${JSON.stringify(result.shell)})`);
  }
  if (result.shell.width > 1240.5) failures.push(`${profile}: site-width shell exceeds 1240px`);
  if (Math.abs(result.shell.left - (viewport.width - result.shell.width) / 2) > 1) {
    failures.push(`${profile}: site-width shell is not centered`);
  }
  if (result.title.bottom > result.meta.top + 1
    || result.meta.bottom > result.imageFrame.top + 1
    || result.imageFrame.bottom > result.content.top + 1) {
    failures.push(`${profile}: title, info, image, and article are not in the requested order`);
  }
  const ratio = result.imageFrame.width / result.imageFrame.height;
  if (Math.abs(ratio - (16 / 9)) > 0.02 || result.imageAspectRatio !== '16 / 9') {
    failures.push(`${profile}: featured image frame is not a responsive 16:9 ratio (${ratio}, ${result.imageAspectRatio})`);
  }
  if (result.imageObjectFit !== 'cover') failures.push(`${profile}: featured image does not use object-fit cover`);
  const sharedWidths = [result.hero.width, result.imageFrame.width, result.content.width];
  if (Math.max(...sharedWidths) > 900.5 || Math.max(...sharedWidths) - Math.min(...sharedWidths) > 1) {
    failures.push(`${profile}: hero, featured image, and article do not share the same 900px content width (${JSON.stringify(sharedWidths)})`);
  }
  for (const [region, bounds] of [['hero', result.hero], ['featured image', result.imageFrame], ['article', result.content]]) {
    if (Math.abs(bounds.left - (viewport.width - bounds.width) / 2) > 1) {
      failures.push(`${profile}: ${region} is not centered`);
    }
  }
  const maximumTitleSize = viewport.width >= 1200 ? 40 : viewport.width >= 600 ? 27 : 24;
  if (result.titleMaxWidth !== 'none' || result.titleTextWrap !== 'wrap' || result.titleFontSize > maximumTitleSize) {
    failures.push(`${profile}: title does not use the wider natural wrap and smaller scale (${JSON.stringify({
      maxWidth: result.titleMaxWidth,
      textWrap: result.titleTextWrap,
      fontSize: result.titleFontSize
    })})`);
  }
  if (result.titleText !== expectedTitle || result.dateText !== '18th March 2026') {
    failures.push(`${profile}: title or publication info changed`);
  }
  if (!result.imageSrc?.includes('blog/blog-bcrs.jpg')) failures.push(`${profile}: featured image source changed`);
  if (result.paragraphCount !== 5 || result.blockquoteCount !== 1) {
    failures.push(`${profile}: article content tags changed (${result.paragraphCount} paragraphs, ${result.blockquoteCount} blockquotes)`);
  }
  if (result.externalLinkTarget !== '_blank' || result.builtInLinkHref !== '#') {
    failures.push(`${profile}: article link tags changed`);
  }
  if (result.overflow) failures.push(`${profile}: horizontal overflow`);
  if (result.frameworkOverlay) failures.push(`${profile}: framework error overlay is visible`);

  if (screenshotDirectory) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const fileName = `${screenshotDirectory}/blog-detail-${viewport.width}.png`;
    await import('node:fs/promises').then(({ writeFile }) => writeFile(fileName, screenshot.data, 'base64'));
  }
}

await send('Page.close');
socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

console.log('Blog detail regression passed at laptop, tablet, and mobile widths.');
