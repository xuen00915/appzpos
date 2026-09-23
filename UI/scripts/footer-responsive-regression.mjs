const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9226';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4301/';
const viewports = [768, 390];
const heights = { 768: 1024, 390: 844 };

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
const layouts = {};

await send('Page.enable');
for (const width of viewports) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: heights[width],
    deviceScaleFactor: 1,
    mobile: width < 600,
    screenWidth: width,
    screenHeight: heights[width]
  });
  await send('Page.navigate', { url: `${previewUrl}?footer-responsive-${width}-${Date.now()}` });
  await wait(1600);

  const evaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const inner = document.querySelector('.appzpos-footer__inner');
      const badge = document.querySelector('.appzpos-footer__iso');
      const socialIcons = [...document.querySelectorAll('.appzpos-footer__socials i')];
      const columns = inner ? getComputedStyle(inner).gridTemplateColumns.trim().split(/\\s+/).filter(Boolean) : [];
      return {
        present: Boolean(inner),
        columns,
        sectionCount: inner?.children.length ?? 0,
        badgeWidth: badge?.getBoundingClientRect().width ?? 0,
        instagramGradient: socialIcons[0] ? getComputedStyle(socialIcons[0]).backgroundImage : '',
        socialColors: socialIcons.slice(1).map((icon) => getComputedStyle(icon).color),
        pageClientWidth: document.documentElement.clientWidth,
        pageScrollWidth: document.documentElement.scrollWidth
      };
    })())`,
    returnByValue: true
  });
  layouts[width] = JSON.parse(evaluation.result.value);
}

await send('Page.close');
socket.close();

const failures = [];
for (const width of viewports) {
  const layout = layouts[width];
  if (!layout.present) failures.push(`${width}px: footer grid is missing`);
  if (layout.sectionCount !== 4) failures.push(`${width}px: expected four footer sections`);
  if (layout.columns.length !== 2) failures.push(`${width}px: footer uses ${layout.columns.length} column(s), expected two`);
  const expectedBadgeWidth = width === 390 ? 160 : 190;
  if (layout.badgeWidth !== expectedBadgeWidth) failures.push(`${width}px: certification badge is ${layout.badgeWidth}px wide, expected ${expectedBadgeWidth}px`);
  if (!layout.instagramGradient.includes('linear-gradient')) failures.push(`${width}px: Instagram icon is missing its brand gradient`);
  const expectedSocialColors = ['rgb(24, 119, 242)', 'rgb(10, 102, 194)', 'rgb(255, 0, 0)'];
  if (layout.socialColors.some((color, index) => color !== expectedSocialColors[index])) failures.push(`${width}px: social icons do not use their original brand colors`);
  if (layout.pageScrollWidth > layout.pageClientWidth) failures.push(`${width}px: footer creates horizontal overflow`);
}

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', layouts }, null, 2));
