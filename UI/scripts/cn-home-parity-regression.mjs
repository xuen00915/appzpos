const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL
  ?? 'http://127.0.0.1:4313/cn-f&b-restaurant-cloud-pos-system';
const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${previewUrl}?cn-parity-regression`)}`,
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

const industries = {
  'quick-service': ['POS收银系统', '网站点餐系统', '自助点餐机', 'KDS厨房系统', '排队叫号系统'],
  restaurant: ['POS收银系统', '网站点餐系统', '扫码点餐系统', 'KDS厨房系统'],
  retail: ['POS收银系统', '网站点餐系统', '自助点餐机'],
  salon: ['POS收银系统', '网站点餐系统', '会员管理 (CRM)', '库存管理', '支付集成']
};
const diagrams = {
  pos: 'assets/images/ecosystem/ecosystem-dining.webp',
  website: 'assets/images/ecosystem/ecosystem-website-ordering.webp',
  qr: 'assets/images/ecosystem/ecosystem-table-qr.webp',
  kiosk: 'assets/images/ecosystem/ecosystem-kiosk.webp',
  queue: 'assets/images/ecosystem/ecosystem-queue.webp',
  kds: 'assets/images/ecosystem/ecosystem-kitchen.webp',
  hub: 'assets/images/ecosystem/ecosystem-delivery.webp'
};
const failures = [];

await send('Page.enable');
await send('Runtime.enable');

for (const width of [1440, 390]) {
  const height = width === 390 ? 844 : 1000;
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width === 390,
    screenWidth: width, screenHeight: height
  });
  await send('Page.navigate', { url: `${previewUrl}?cn-parity-regression-${width}` });
  await wait(1400);

  const hero = JSON.parse(await evaluate(`JSON.stringify((() => ({
    heading: document.querySelector('#cn-home-title')?.textContent.replace(/\\s+/g, ' ').trim(),
    description: document.querySelector('.appzpos-product-hero__intro')?.textContent.replace(/\\s+/g, ' ').trim(),
    machine: Boolean(document.querySelector('.appzpos-product-hero__machine')),
    responsiveImage: Boolean(document.querySelector('.appzpos-product-hero__visual--responsive')),
    tabLabels: [...document.querySelectorAll('[data-industry-tab]')].map((tab) => tab.textContent.replace(/\\s+/g, ' ').replace(/^•\\s*/, '').trim()),
    pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }))())`));

  if (hero.heading !== 'APPZPOS POS系统 云端智能POS餐饮系统 高达50%政府津贴折扣') {
    failures.push(`${width}px: Chinese hero heading changed (${hero.heading})`);
  }
  if (hero.description !== '专为餐饮业者设计的全方位餐饮系统，包括收银系统、销售报告分析、会员管理、库存管理、促销优惠，运营流程等') {
    failures.push(`${width}px: Chinese hero description changed`);
  }
  if (!hero.machine || hero.responsiveImage) failures.push(`${width}px: English product showcase is not used`);
  if (JSON.stringify(hero.tabLabels) !== JSON.stringify(['快餐服务', '餐厅', '零售', '美容美发'])) {
    failures.push(`${width}px: Chinese industry tabs changed ${JSON.stringify(hero.tabLabels)}`);
  }
  if (hero.pageOverflow) failures.push(`${width}px: page has horizontal overflow`);

  await evaluate(`document.querySelector('#cn-custom-pos')?.scrollIntoView({ block: 'center' })`);
  await wait(350);
  const storySections = JSON.parse(await evaluate(`JSON.stringify((() => {
    const custom = document.querySelector('#cn-custom-pos');
    const customCopy = custom?.querySelector('.home-story-section__copy')?.getBoundingClientRect();
    const customMedia = custom?.querySelector('.home-story-section__media')?.getBoundingClientRect();
    const whatsapp = custom?.querySelector('[data-story-whatsapp]');
    const cardsSection = document.querySelector('#cn-unified-management');
    const cardList = cardsSection?.querySelector('.home-story-section__bullets');
    const cards = [...(cardsSection?.querySelectorAll('.home-story-section__bullets li') ?? [])];
    const grant = document.querySelector('[data-home-section="grant"]');
    const grantImages = [...(grant?.querySelectorAll('img') ?? [])];
    return {
      custom: {
        copyLeftOfImage: Boolean(customCopy && customMedia && customCopy.right <= customMedia.left + 1),
        imageAboveCopy: Boolean(customCopy && customMedia && customMedia.bottom <= customCopy.top + 1),
        whatsappText: whatsapp?.textContent.replace(/\\s+/g, ' ').trim(),
        whatsappHref: whatsapp?.getAttribute('href'),
        whatsappIcon: Boolean(whatsapp?.querySelector('.bi-whatsapp'))
      },
      cards: {
        mediaCount: cardsSection?.querySelectorAll('.home-story-section__media').length,
        headingAlign: cardsSection?.querySelector('h2') ? getComputedStyle(cardsSection.querySelector('h2')).textAlign : null,
        count: cards.length,
        columns: cardList ? getComputedStyle(cardList).gridTemplateColumns.split(' ').length : 0,
        icons: cards.map((card) => card.querySelector('i')?.className)
      },
      grant: {
        imageCount: grantImages.length,
        src: grantImages[0]?.getAttribute('src'),
        loaded: Boolean(grantImages[0]?.complete && grantImages[0]?.naturalWidth > 0),
        secondary: Boolean(grant?.querySelector('.ecosystem__grant-lockup'))
      }
    };
  })())`));
  if (width > 900 && !storySections.custom.copyLeftOfImage) {
    failures.push(`${width}px: custom POS copy is not left of its image ${JSON.stringify(storySections.custom)}`);
  }
  if (width <= 900 && !storySections.custom.imageAboveCopy) {
    failures.push(`${width}px: custom POS mobile stack is incorrect ${JSON.stringify(storySections.custom)}`);
  }
  if (storySections.custom.whatsappText !== '联系我们'
    || !storySections.custom.whatsappHref?.startsWith('https://wa.me/6583109631')
    || !storySections.custom.whatsappIcon) {
    failures.push(`${width}px: custom POS WhatsApp CTA is incorrect ${JSON.stringify(storySections.custom)}`);
  }
  if (storySections.cards.mediaCount !== 0 || storySections.cards.headingAlign !== 'center'
    || storySections.cards.count !== 4 || storySections.cards.columns !== (width <= 767 ? 1 : 2)
    || JSON.stringify(storySections.cards.icons) !== JSON.stringify([
      'bi bi-cloud-check', 'bi bi-graph-up-arrow', 'bi bi-diagram-3', 'bi bi-buildings'
    ])) {
    failures.push(`${width}px: Chinese management cards are incorrect ${JSON.stringify(storySections.cards)}`);
  }
  if (storySections.grant.imageCount !== 1
    || storySections.grant.src !== 'assets/images/smes-go-digital-lockup-vertical.png'
    || !storySections.grant.loaded || storySections.grant.secondary) {
    failures.push(`${width}px: Chinese grant artwork is incorrect ${JSON.stringify(storySections.grant)}`);
  }

  for (const [industry, expectedTags] of Object.entries(industries)) {
    await evaluate(`document.querySelector('[data-industry-tab="${industry}"]')?.click()`);
    await wait(650);
    const state = JSON.parse(await evaluate(`JSON.stringify((() => ({
      selected: document.querySelector('[data-industry-tab="${industry}"]')?.getAttribute('aria-selected'),
      screenIndustry: document.querySelector('.appzpos-software-screen')?.dataset.industry,
      tagsIndustry: document.querySelector('.appzpos-module-orbit')?.dataset.industry,
      tags: [...document.querySelectorAll('.appzpos-module-orbit__label')].map((tag) => tag.textContent.trim()),
      screenLoaded: [...document.querySelectorAll('.appzpos-screen-slice img')]
        .every((image) => image.complete && image.naturalWidth > 0)
    }))())`));
    if (state.selected !== 'true' || state.screenIndustry !== industry || state.tagsIndustry !== industry
      || JSON.stringify(state.tags) !== JSON.stringify(expectedTags) || !state.screenLoaded) {
      failures.push(`${width}px: ${industry} hero state is out of sync ${JSON.stringify(state)}`);
    }
  }

  await evaluate(`document.querySelector('.appz-ecosystem')?.scrollIntoView({ block: 'center' })`);
  await wait(350);
  for (const [solution, imagePath] of Object.entries(diagrams)) {
    await evaluate(`document.querySelector('[data-island-id="${solution}"]')?.click()`);
    await wait(250);
    const state = JSON.parse(await evaluate(`JSON.stringify((() => {
      const option = document.querySelector('[data-island-id="${solution}"]');
      const image = document.querySelector('.appz-ecosystem__selected-visual img');
      return {
        active: option?.getAttribute('aria-pressed'),
        src: image?.getAttribute('src'),
        loaded: Boolean(image?.complete && image?.naturalWidth > 0)
      };
    })())`));
    if (state.active !== 'true' || state.src !== imagePath || !state.loaded) {
      failures.push(`${width}px: ${solution} diagram mapping failed ${JSON.stringify(state)}`);
    }
  }
}

socket.close();
if (failures.length) {
  console.error(`Chinese homepage parity regression failed:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log('Chinese homepage parity regression passed at 1440px and 390px for the hero, story layouts, benefit cards, grant artwork, and solution diagrams.');
