const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4313/';
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

const routes = {
  hardware: 'pos-hardware-machine-receipt-printer',
  features: 'pos-features-crm-payment-gateway',
  blog: 'blog',
  psg: 'psg-pos-system-grant-singapore'
};
const expectedFields = {
  hardware: ['name', 'email', 'mobilenum', 'restaurant_name'],
  features: ['firstname', 'lastname', 'email', 'phone', 'company', 'position'],
  blog: ['name', 'email', 'mobilenum', 'restaurant_name'],
  psg: ['name', 'email', 'mobilenum', 'restaurant_name']
};
const viewports = [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 }
];
const failures = [];

await send('Page.enable');
for (const viewport of viewports) {
  await send('Emulation.setDeviceMetricsOverride', {
    ...viewport,
    deviceScaleFactor: 1,
    mobile: viewport.width < 600,
    screenWidth: viewport.width,
    screenHeight: viewport.height
  });

  for (const [name, route] of Object.entries(routes)) {
    await send('Page.navigate', { url: new URL(route, previewUrl).href });
    await wait(900);

    let heroWhatsApp = null;
    if (name !== 'psg') {
      const selector = `.${name}-hero__actions a[href*="wa.me"]`;
      const readHeroWhatsApp = () => evaluate(`JSON.stringify((() => {
        const link = document.querySelector(${JSON.stringify(selector)});
        if (!link) return null;
        const bounds = link.getBoundingClientRect();
        const styles = getComputedStyle(link);
        return {
          href: link.getAttribute('href'),
          target: link.target,
          bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
          borderTopWidth: styles.borderTopWidth,
          borderTopStyle: styles.borderTopStyle,
          borderTopColor: styles.borderTopColor
        };
      })())`);
      const defaultState = JSON.parse(await readHeroWhatsApp());
      if (defaultState?.bounds) {
        await send('Input.dispatchMouseEvent', {
          type: 'mouseMoved',
          x: defaultState.bounds.x + (defaultState.bounds.width / 2),
          y: defaultState.bounds.y + (defaultState.bounds.height / 2)
        });
        await wait(150);
      }
      const hoverState = JSON.parse(await readHeroWhatsApp());
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      heroWhatsApp = { defaultState, hoverState };
    }

    if (name === 'blog') {
      await evaluate(`document.querySelector('.blog-hero__primary')?.click()`);
      await wait(500);
      await evaluate(`document.activeElement instanceof HTMLElement && document.activeElement.blur()`);
    }

    const result = JSON.parse(await evaluate(`JSON.stringify((() => {
      const visible = (node) => {
        const bounds = node.getBoundingClientRect();
        return bounds.width > 0 && bounds.height > 0;
      };
      const panel = ${name === 'blog'
        ? "document.querySelector('.cdk-overlay-pane.appz-demo-dialog')"
        : "document.querySelector('#requestdemo.appz-conversion-panel')"};
      const form = ${name === 'blog'
        ? "panel?.querySelector('form')"
        : "[...document.querySelectorAll('#requestdemo form')].find(visible)"};
      const template = [...document.querySelectorAll('#requestdemo .appz-demo, #requestdemo .features-api-panel')]
        .find(visible);
      const panelBounds = panel?.getBoundingClientRect();
      const templateBounds = template?.getBoundingClientRect();
      const templateStyles = template ? getComputedStyle(template) : null;
      const templateParentStyles = template?.parentElement ? getComputedStyle(template.parentElement) : null;
      const copy = [...document.querySelectorAll('#requestdemo .appz-demo__copy, #requestdemo .features-api-copy')]
        .find(visible);
      const copyBounds = copy?.getBoundingClientRect();
      const formBounds = form?.getBoundingClientRect();
      const formFields = form?.querySelectorAll('input[formcontrolname]');
      const firstField = formFields?.[1] ?? formFields?.[0];
      const firstLabel = firstField?.closest('.appz-demo__field, .form-group')?.querySelector('label');
      const submitControl = form?.querySelector('[type="submit"]');
      const styleValue = (node, properties) => {
        if (!node) return null;
        const styles = getComputedStyle(node);
        return Object.fromEntries(properties.map((property) => [property, styles[property]]));
      };
      const fields = [...(form?.querySelectorAll('input[formcontrolname]') ?? [])]
        .map((input) => input.getAttribute('formcontrolname'));
      return {
        panel: Boolean(panel),
        form: Boolean(form),
        fields,
        submit: Boolean(form?.querySelector('[type="submit"]')),
        panelPaddingTop: panel ? parseFloat(getComputedStyle(panel).paddingTop) : null,
        templateTopInset: panelBounds && templateBounds ? templateBounds.top - panelBounds.top : null,
        templateMarginTop: templateStyles ? parseFloat(templateStyles.marginTop) : null,
        templatePaddingTop: templateStyles ? parseFloat(templateStyles.paddingTop) : null,
        templateParentPaddingTop: templateParentStyles ? parseFloat(templateParentStyles.paddingTop) : null,
        columnHeightDifference: copyBounds && formBounds
          ? Math.abs(copyBounds.height - formBounds.height)
          : null,
        fieldStyle: styleValue(firstField, [
          'backgroundColor', 'borderColor', 'borderRadius', 'color',
          'fontSize', 'height', 'paddingLeft', 'paddingRight'
        ]),
        labelStyle: styleValue(firstLabel, [
          'color', 'fontSize', 'fontWeight', 'marginBottom'
        ]),
        submitStyle: styleValue(submitControl, [
          'backgroundColor', 'borderRadius', 'color', 'fontSize',
          'fontWeight', 'minHeight'
        ]),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    })())`));

    const profile = `${name} @ ${viewport.width}px`;
    if (!result.panel) failures.push(`${profile}: conversion template is missing`);
    if (!result.form || !result.submit) failures.push(`${profile}: existing form or submit control is missing`);
    if (JSON.stringify(result.fields) !== JSON.stringify(expectedFields[name])) {
      failures.push(`${profile}: form fields changed (${JSON.stringify(result.fields)})`);
    }
    if (viewport.width >= 901 && name !== 'blog'
      && (result.columnHeightDifference === null || result.columnHeightDifference > 2)) {
      failures.push(`${profile}: form columns are not equal height (${result.columnHeightDifference})`);
    }
    if (name !== 'blog' && (result.templateTopInset === null
      || Math.abs(result.templateTopInset - result.panelPaddingTop) > 2)) {
      failures.push(`${profile}: conversion template has excess top spacing (${JSON.stringify({
        inset: result.templateTopInset,
        panelPadding: result.panelPaddingTop,
        templateMargin: result.templateMarginTop,
        templatePadding: result.templatePaddingTop,
        parentPadding: result.templateParentPaddingTop
      })})`);
    }
    const expectedFieldStyle = {
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: 'rgb(203, 217, 230)',
      borderRadius: '12px',
      color: 'rgb(16, 29, 57)',
      fontSize: '16px',
      height: '50px',
      paddingLeft: '14px',
      paddingRight: '14px'
    };
    const expectedLabelStyle = {
      color: 'rgb(11, 35, 71)',
      fontSize: '12.48px',
      fontWeight: '760',
      marginBottom: '6px'
    };
    const expectedSubmitStyle = {
      backgroundColor: 'rgb(10, 134, 232)',
      borderRadius: '999px',
      color: 'rgb(255, 255, 255)',
      fontSize: '15.04px',
      fontWeight: '760',
      minHeight: '48px'
    };
    if (JSON.stringify(result.fieldStyle) !== JSON.stringify(expectedFieldStyle)) {
      failures.push(`${profile}: field styling differs from the common form (${JSON.stringify(result.fieldStyle)})`);
    }
    if (JSON.stringify(result.labelStyle) !== JSON.stringify(expectedLabelStyle)) {
      failures.push(`${profile}: label styling differs from the common form (${JSON.stringify(result.labelStyle)})`);
    }
    if (JSON.stringify(result.submitStyle) !== JSON.stringify(expectedSubmitStyle)) {
      failures.push(`${profile}: submit styling differs from the common form (${JSON.stringify(result.submitStyle)})`);
    }
    if (result.overflow) failures.push(`${profile}: horizontal overflow`);
    if (name !== 'psg') {
      const expectedBorder = {
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'rgb(37, 211, 102)'
      };
      for (const [stateName, state] of Object.entries(heroWhatsApp ?? {})) {
        if (!state || state.href !== "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
          || state.target !== '_blank'
          || state.borderTopWidth !== expectedBorder.borderTopWidth
          || state.borderTopStyle !== expectedBorder.borderTopStyle
          || state.borderTopColor !== expectedBorder.borderTopColor) {
          failures.push(`${profile}: hero WhatsApp ${stateName} state does not retain its green border (${JSON.stringify(state)})`);
        }
      }
    }
  }
}

await send('Page.navigate', { url: new URL('blog-bcrs', previewUrl).href });
await wait(700);
const articleChanged = await evaluate(`Boolean(
  document.querySelector('#requestdemo.appz-conversion-panel, .cdk-overlay-pane.appz-demo-dialog')
)`);
if (articleChanged) failures.push('blog-bcrs: article detail page received the conversion template');

await send('Page.close');
socket.close();

if (failures.length) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

console.log('Conversion template regression passed for Hardware, Features, Blog, and PSG; blog-bcrs remained unchanged.');
