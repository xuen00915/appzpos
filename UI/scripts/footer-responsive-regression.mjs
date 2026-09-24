const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9226';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4301/';
const viewports = [1440, 768, 390];
const heights = { 1440: 1000, 768: 1024, 390: 844 };

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
      const conversionPanel = document.querySelector('.appz-conversion-panel');
      const demo = document.querySelector('.appz-demo');
      const copy = document.querySelector('.appz-demo__copy');
      const form = document.querySelector('.appz-demo__form');
      const fields = document.querySelector('.appz-demo__fields');
      const submit = document.querySelector('.appz-demo__submit');
      const footer = document.querySelector('.appzpos-footer');
      const columns = inner ? getComputedStyle(inner).gridTemplateColumns.trim().split(/\\s+/).filter(Boolean) : [];
      const conversionBounds = conversionPanel?.getBoundingClientRect();
      const copyBounds = copy?.getBoundingClientRect();
      const formBounds = form?.getBoundingClientRect();
      const submitBounds = submit?.getBoundingClientRect();
      const footerBounds = footer?.getBoundingClientRect();
      return {
        present: Boolean(inner),
        columns,
        sectionCount: inner?.children.length ?? 0,
        badgeWidth: badge?.getBoundingClientRect().width ?? 0,
        instagramGradient: socialIcons[0] ? getComputedStyle(socialIcons[0]).backgroundImage : '',
        socialColors: socialIcons.slice(1).map((icon) => getComputedStyle(icon).color),
        conversion: {
          present: Boolean(conversionPanel && demo && form && fields && footer),
          panelPaddingTop: conversionPanel ? parseFloat(getComputedStyle(conversionPanel).paddingTop) : 0,
          demoGap: demo ? parseFloat(getComputedStyle(demo).gap) : 0,
          formPaddingTop: form ? parseFloat(getComputedStyle(form).paddingTop) : 0,
          formPaddingBottom: form ? parseFloat(getComputedStyle(form).paddingBottom) : 0,
          formBottomGap: formBounds && submitBounds ? formBounds.bottom - submitBounds.bottom : 0,
          demoHeight: demo?.getBoundingClientRect().height ?? 0,
          copyHeight: copyBounds?.height ?? 0,
          formHeight: formBounds?.height ?? 0,
          copyAlignSelf: copy ? getComputedStyle(copy).alignSelf : '',
          formAlignSelf: form ? getComputedStyle(form).alignSelf : '',
          formMarginTop: form ? parseFloat(getComputedStyle(form).marginTop) : 0,
          formMarginBottom: form ? parseFloat(getComputedStyle(form).marginBottom) : 0,
          columnHeightDifference: copyBounds && formBounds ? Math.abs(copyBounds.height - formBounds.height) : 0,
          fieldGap: fields ? parseFloat(getComputedStyle(fields).rowGap) : 0,
          footerGap: conversionBounds && footerBounds ? footerBounds.top - conversionBounds.bottom : 0
        },
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
  const expectedColumns = width >= 1024 ? 4 : 2;
  if (layout.columns.length !== expectedColumns) failures.push(`${width}px: footer uses ${layout.columns.length} column(s), expected ${expectedColumns}`);
  const expectedBadgeWidth = width === 390 ? 160 : 190;
  if (layout.badgeWidth !== expectedBadgeWidth) failures.push(`${width}px: certification badge is ${layout.badgeWidth}px wide, expected ${expectedBadgeWidth}px`);
  if (!layout.instagramGradient.includes('linear-gradient')) failures.push(`${width}px: Instagram icon is missing its brand gradient`);
  const expectedSocialColors = ['rgb(24, 119, 242)', 'rgb(10, 102, 194)', 'rgb(255, 0, 0)'];
  if (layout.socialColors.some((color, index) => color !== expectedSocialColors[index])) failures.push(`${width}px: social icons do not use their original brand colors`);
  if (!layout.conversion.present) failures.push(`${width}px: demo form or footer is missing`);
  if (layout.conversion.panelPaddingTop > 36) failures.push(`${width}px: demo panel top padding is ${layout.conversion.panelPaddingTop}px, expected at most 36px`);
  if (layout.conversion.demoGap > 36) failures.push(`${width}px: demo copy/form gap is ${layout.conversion.demoGap}px, expected at most 36px`);
  if (layout.conversion.formPaddingTop > 28) failures.push(`${width}px: form padding is ${layout.conversion.formPaddingTop}px, expected at most 28px`);
  if (Math.abs(layout.conversion.formBottomGap - layout.conversion.formPaddingBottom) > 2) failures.push(`${width}px: form has ${layout.conversion.formBottomGap}px below Submit, expected its ${layout.conversion.formPaddingBottom}px bottom padding`);
  if (width >= 901 && layout.conversion.columnHeightDifference > 2) failures.push(`${width}px: demo columns differ by ${layout.conversion.columnHeightDifference}px, expected equal height`);
  if (layout.conversion.fieldGap > 16) failures.push(`${width}px: form field gap is ${layout.conversion.fieldGap}px, expected at most 16px`);
  if (layout.conversion.footerGap < 48 || layout.conversion.footerGap > 80) failures.push(`${width}px: form-to-footer gap is ${layout.conversion.footerGap}px, expected 48–80px`);
  if (layout.pageScrollWidth > layout.pageClientWidth) failures.push(`${width}px: footer creates horizontal overflow`);
}

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', layouts }, null, 2));
