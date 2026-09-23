const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4300/';
const viewports = [1440, 820, 390];

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
    height: width === 390 ? 844 : 1000,
    deviceScaleFactor: 1,
    mobile: width === 390,
    screenWidth: width,
    screenHeight: width === 390 ? 844 : 1000
  });
  await send('Page.navigate', { url: `${previewUrl}?growth-cards-${width}` });
  await wait(1400);

  const evaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const list = document.querySelector('.ecosystem__growth-list');
      const cards = [...document.querySelectorAll('.ecosystem__growth-card')];
      return {
        columns: list ? getComputedStyle(list).gridTemplateColumns.trim().split(/\\s+/).filter(Boolean).length : 0,
        cards: cards.map((card) => ({
          heading: card.querySelector('h3')?.textContent.trim(),
          description: card.querySelector('p')?.textContent.trim(),
          icon: [...(card.querySelector('.ecosystem__growth-icon i')?.classList ?? [])].find((name) => name !== 'bi'),
          iconGlyph: getComputedStyle(card.querySelector('.ecosystem__growth-icon i'), '::before').content,
          width: card.getBoundingClientRect().width,
          height: card.getBoundingClientRect().height
        })),
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

const expectedIcons = ['bi-cloud-check', 'bi-graph-up-arrow', 'bi-diagram-3', 'bi-buildings'];
const failures = [];
for (const width of viewports) {
  const layout = layouts[width];
  const expectedColumns = width === 1440 ? 4 : width === 820 ? 2 : 1;
  if (layout.columns !== expectedColumns) failures.push(`${width}px: found ${layout.columns} columns, expected ${expectedColumns}`);
  if (layout.cards.length !== 4) failures.push(`${width}px: found ${layout.cards.length} cards, expected four`);
  if (layout.cards.some((card, index) => card.icon !== expectedIcons[index])) failures.push(`${width}px: card icons are out of order`);
  if (layout.cards.some((card) => !card.iconGlyph || card.iconGlyph === 'none')) failures.push(`${width}px: a card icon has no visible glyph`);
  if (layout.cards.some((card) => !card.heading || !card.description)) failures.push(`${width}px: a card is missing its heading or description`);
  if (layout.cards.some((card) => card.width < 250 && width > 1023)) failures.push(`${width}px: a desktop card is too narrow`);
  if (layout.pageScrollWidth > layout.pageClientWidth) failures.push(`${width}px: growth cards cause horizontal overflow`);
}

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', layouts }, null, 2));
