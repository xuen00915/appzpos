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
const viewportProfiles = [
  { width: 1440, height: 1000, maxSectionSpace: 80, minTitleTracking: 1.4 },
  { width: 1024, height: 900, maxSectionSpace: 64, minTitleTracking: 1.3 },
  { width: 768, height: 1024, maxSectionSpace: 56, minTitleTracking: 1.2 },
  { width: 390, height: 844, maxSectionSpace: 44, minTitleTracking: 1 }
];
const expectedHomeSectionTags = ['hero', 'island', 'grant', 'key-features', 'form'];
const expectedTitleIds = [
  'appz-ecosystem-title',
  'cn-custom-pos-title',
  'cn-unified-management-title',
  'grant-title',
  'features-title',
  'customers-title',
  'appz-demo-title'
];

await send('Page.enable');
await send('Runtime.enable');

for (const { width, height, maxSectionSpace, minTitleTracking } of viewportProfiles) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width === 390,
    screenWidth: width, screenHeight: height
  });
  await send('Page.navigate', { url: `${previewUrl}?cn-parity-regression-${width}` });
  await wait(1400);
  await evaluate('window.scrollTo(0, 0)');
  await wait(100);

  const hero = JSON.parse(await evaluate(`JSON.stringify((() => ({
    heading: document.querySelector('#cn-home-title')?.textContent.replace(/\\s+/g, ' ').trim(),
    description: document.querySelector('.appzpos-product-hero__intro')?.textContent.replace(/\\s+/g, ' ').trim(),
    machine: Boolean(document.querySelector('.appzpos-product-hero__machine')),
    responsiveImage: Boolean(document.querySelector('.appzpos-product-hero__visual--responsive')),
    tabLabels: [...document.querySelectorAll('[data-industry-tab]')].map((tab) => tab.textContent.replace(/\\s+/g, ' ').replace(/^•\\s*/, '').trim()),
    moduleSizing: [...document.querySelectorAll('.appzpos-module-orbit__card')].map((card) => {
      const label = card.querySelector('.appzpos-module-orbit__label');
      const cardBounds = card.getBoundingClientRect();
      const labelBounds = label?.getBoundingClientRect();
      const styles = getComputedStyle(card);
      return {
        label: label?.textContent.trim(),
        excessWidth: labelBounds ? cardBounds.width - labelBounds.width
          - Number.parseFloat(styles.paddingLeft) - Number.parseFloat(styles.paddingRight)
          - Number.parseFloat(styles.borderLeftWidth) - Number.parseFloat(styles.borderRightWidth) : null
      };
    }),
    grantTitleColors: [...document.querySelectorAll('#grant-title, #grant-title span')]
      .map((element) => getComputedStyle(element).color),
    pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    headerHeroDelta: (() => {
      const header = document.querySelector('#header')?.getBoundingClientRect();
      const hero = document.querySelector('.appzpos-product-hero')?.getBoundingClientRect();
      return header && hero ? Math.abs(header.height + hero.height - innerHeight) : null;
    })()
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
  if (!hero.moduleSizing.length || hero.moduleSizing.some((module) =>
    module.excessWidth === null || Math.abs(module.excessWidth) > 1)) {
    failures.push(`${width}px: module tags do not follow their content width ${JSON.stringify(hero.moduleSizing)}`);
  }
  if (!hero.grantTitleColors.length
    || hero.grantTitleColors.some((color) => color !== 'rgb(255, 255, 255)')) {
    failures.push(`${width}px: grant title is not uniformly white ${JSON.stringify(hero.grantTitleColors)}`);
  }
  if (hero.pageOverflow) failures.push(`${width}px: page has horizontal overflow`);
  if (hero.headerHeroDelta === null || hero.headerHeroDelta > 1) {
    failures.push(`${width}px: header and hero do not fit one viewport (${hero.headerHeroDelta})`);
  }

  const pageContract = JSON.parse(await evaluate(`JSON.stringify((() => {
    const root = document.querySelector('[data-home-page-template]');
    const titleIds = ${JSON.stringify(expectedTitleIds)};
    const titles = titleIds.map((id) => {
      const element = document.getElementById(id);
      return {
        id,
        exists: Boolean(element),
        letterSpacing: element ? Number.parseFloat(getComputedStyle(element).letterSpacing) : null
      };
    });
    const appzSections = [...document.querySelectorAll('.appz-section')]
      .filter((section) => section.getBoundingClientRect().height > 0);
    const orderFlow = document.querySelector('.appz-ecosystem');
    const storyGrid = document.querySelector('.home-story-sections');
    const marginSections = [
      document.querySelector('.ecosystem__grant'),
      document.querySelector('.ecosystem__features')
    ].filter(Boolean);
    const labelledSections = [...document.querySelectorAll('[aria-labelledby]')]
      .filter((section) => section.matches('section, article'));
    return {
      rootLang: root?.getAttribute('lang'),
      homeSectionTags: [...document.querySelectorAll('[data-home-section]')]
        .map((section) => section.getAttribute('data-home-section')),
      labelledSectionsResolve: labelledSections.every((section) => {
        const id = section.getAttribute('aria-labelledby');
        return Boolean(id && document.getElementById(id));
      }),
      gtm: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
      pixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')),
      whatsappLinks: [...document.querySelectorAll('a[href^="https://wa.me/6583109631"]')]
        .map((link) => ({ href: link.getAttribute('href'), rel: link.getAttribute('rel') })),
      floating: (() => {
        const rail = document.querySelector('.appz-site-floating-contacts');
        const whatsapp = rail?.querySelector('.btn-whatsapp');
        const messenger = rail?.querySelector('.btn-fb');
        const whatsappIcon = whatsapp?.querySelector('.fa-whatsapp');
        const whatsappImage = whatsapp?.querySelector('img');
        const messengerImage = messenger?.querySelector('img');
        const railBounds = rail?.getBoundingClientRect();
        const whatsappStyles = whatsapp ? getComputedStyle(whatsapp) : null;
        const iconStyles = whatsappIcon ? getComputedStyle(whatsappIcon) : null;
        const scrollTop = document.querySelector('#gotoTop');
        const scrollTopStyles = scrollTop ? getComputedStyle(scrollTop) : null;
        const styleSnapshot = (element) => {
          if (!element) return null;
          const styles = getComputedStyle(element);
          return {
            width: styles.width,
            height: styles.height,
            borderRadius: styles.borderRadius,
            backgroundColor: styles.backgroundColor
          };
        };
        const withLegacyClasses = {
          whatsapp: styleSnapshot(whatsapp),
          messenger: styleSnapshot(messenger)
        };
        return {
          count: rail?.querySelectorAll('a').length ?? 0,
          whatsappLegacyClass: whatsapp?.classList.contains('btn-whatsapp') ?? false,
          messengerLegacyClass: messenger?.classList.contains('btn-fb') ?? false,
          withLegacyClasses,
          railPosition: rail ? getComputedStyle(rail).position : null,
          railTop: railBounds ? Math.round(railBounds.top) : null,
          whatsappHref: whatsapp?.getAttribute('href'),
          whatsappTarget: whatsapp?.getAttribute('target'),
          whatsappRel: whatsapp?.getAttribute('rel'),
          whatsappBackground: whatsappStyles?.backgroundColor,
          whatsappRadius: whatsappStyles?.borderRadius,
          whatsappIconColor: iconStyles?.color,
          whatsappImageLoaded: Boolean(whatsappImage?.complete && whatsappImage?.naturalWidth > 0),
          messengerHref: messenger?.getAttribute('href'),
          messengerTarget: messenger?.getAttribute('target'),
          messengerRel: messenger?.getAttribute('rel'),
          messengerImageLoaded: Boolean(messengerImage?.complete && messengerImage?.naturalWidth > 0),
          scrollTopRadius: scrollTopStyles?.borderRadius,
          scrollTopHidden: scrollTopStyles?.opacity === '0'
            && scrollTopStyles?.visibility === 'hidden'
            && scrollTopStyles?.pointerEvents === 'none'
        };
      })(),
      titles,
      maxSectionPadding: Math.max(0, ...appzSections.flatMap((section) => {
        const styles = getComputedStyle(section);
        return [Number.parseFloat(styles.paddingTop), Number.parseFloat(styles.paddingBottom)];
      })),
      orderFlowPadding: orderFlow ? Math.max(
        Number.parseFloat(getComputedStyle(orderFlow).paddingTop),
        Number.parseFloat(getComputedStyle(orderFlow).paddingBottom)
      ) : null,
      storyGap: storyGrid ? Number.parseFloat(getComputedStyle(storyGrid).gap) : null,
      maxSectionMargin: Math.max(0, ...marginSections.map((section) =>
        Number.parseFloat(getComputedStyle(section).marginBottom)))
    };
  })())`));

  if (pageContract.rootLang !== 'zh'
    || JSON.stringify(pageContract.homeSectionTags) !== JSON.stringify(expectedHomeSectionTags)
    || !pageContract.labelledSectionsResolve) {
    failures.push(`${width}px: homepage semantic tags changed ${JSON.stringify(pageContract)}`);
  }
  if (!pageContract.gtm || !pageContract.pixel || pageContract.whatsappLinks.length !== 5
    || pageContract.whatsappLinks.some((link) => !link.href)) {
    failures.push(`${width}px: analytics or CTA tracking hooks changed ${JSON.stringify(pageContract)}`);
  }
  if (pageContract.floating.count !== 2
    || !pageContract.floating.whatsappLegacyClass
    || !pageContract.floating.messengerLegacyClass
    || pageContract.floating.withLegacyClasses.whatsapp.width !== (width <= 768 ? '56px' : '60px')
    || pageContract.floating.withLegacyClasses.whatsapp.height !== (width <= 768 ? '56px' : '60px')
    || pageContract.floating.withLegacyClasses.whatsapp.borderRadius !== '50%'
    || pageContract.floating.withLegacyClasses.whatsapp.backgroundColor !== 'rgb(23, 107, 53)'
    || pageContract.floating.withLegacyClasses.messenger.width !== (width <= 768 ? '56px' : '60px')
    || pageContract.floating.withLegacyClasses.messenger.height !== (width <= 768 ? '56px' : '60px')
    || pageContract.floating.withLegacyClasses.messenger.borderRadius !== '50%'
    || pageContract.floating.withLegacyClasses.messenger.backgroundColor !== 'rgba(255, 255, 255, 0.96)'
    || pageContract.floating.railPosition !== 'fixed'
    || Math.abs(pageContract.floating.railTop - (width <= 768
      ? Math.min(190, Math.max(140, height * .18))
      : Math.min(260, Math.max(170, height * .22)))) > 1
    || !pageContract.floating.whatsappHref?.startsWith('https://wa.me/6583109631')
    || pageContract.floating.whatsappTarget !== '_blank'
    || !pageContract.floating.whatsappRel?.includes('noopener')
    || pageContract.floating.whatsappBackground !== 'rgb(23, 107, 53)'
    || pageContract.floating.whatsappRadius !== '50%'
    || pageContract.floating.whatsappIconColor !== 'rgb(255, 255, 255)'
    || !pageContract.floating.whatsappImageLoaded
    || !pageContract.floating.messengerHref?.startsWith('http://m.me/APPZPOS')
    || pageContract.floating.messengerTarget !== '_blank'
    || !pageContract.floating.messengerRel?.includes('noopener')
    || !pageContract.floating.messengerImageLoaded
    || pageContract.floating.scrollTopRadius !== '50%'
    || !pageContract.floating.scrollTopHidden) {
    failures.push(`${width}px: floating contact controls changed ${JSON.stringify(pageContract.floating)}`);
  }
  const tightTitle = pageContract.titles.find((title) =>
    !title.exists || title.letterSpacing === null || title.letterSpacing < minTitleTracking);
  if (tightTitle) {
    failures.push(`${width}px: Chinese section title tracking is too tight ${JSON.stringify(tightTitle)}`);
  }
  if (pageContract.maxSectionPadding > maxSectionSpace
    || pageContract.orderFlowPadding > maxSectionSpace
    || pageContract.maxSectionMargin > maxSectionSpace
    || pageContract.storyGap !== 0) {
    failures.push(`${width}px: section rhythm is too loose ${JSON.stringify({
      maxSectionPadding: pageContract.maxSectionPadding,
      orderFlowPadding: pageContract.orderFlowPadding,
      maxSectionMargin: pageContract.maxSectionMargin,
      storyGap: pageContract.storyGap,
      allowed: maxSectionSpace
    })}`);
  }

  await evaluate(`document.querySelector('#cn-custom-pos')?.scrollIntoView({ block: 'center' })`);
  await wait(350);
  const floatingAfterScroll = JSON.parse(await evaluate(`JSON.stringify((() => {
    const railBounds = document.querySelector('.appz-site-floating-contacts')?.getBoundingClientRect();
    const scrollTop = document.querySelector('#gotoTop');
    const scrollBounds = scrollTop?.getBoundingClientRect();
    const styles = scrollTop ? getComputedStyle(scrollTop) : null;
    return {
      visible: styles?.opacity === '1' && styles?.visibility === 'visible' && styles?.pointerEvents !== 'none',
      belowContacts: Boolean(railBounds && scrollBounds && railBounds.bottom < scrollBounds.top)
    };
  })())`));
  if (!floatingAfterScroll.visible || !floatingAfterScroll.belowContacts) {
    failures.push(`${width}px: scroll-to-top control is not revealed below contacts ${JSON.stringify(floatingAfterScroll)}`);
  }
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
        icons: cards.map((card) => card.querySelector('i')?.className),
        heights: cards.map((card) => card.getBoundingClientRect().height),
        labels: cards.map((card) => card.querySelector('strong')?.textContent.trim())
      },
      contentWidths: {
        heroDescription: document.querySelector('.appzpos-product-hero__intro')?.getBoundingClientRect().width,
        introTitle: document.querySelector('#appz-ecosystem-title')?.getBoundingClientRect().width,
        introDescription: document.querySelector('.appz-ecosystem__intro')?.getBoundingClientRect().width,
        customTitle: document.querySelector('#cn-custom-pos-title')?.getBoundingClientRect().width,
        customColumn: customCopy?.width,
        unifiedTitle: document.querySelector('#cn-unified-management-title')?.getBoundingClientRect().width,
        sectionWidth: cardsSection?.getBoundingClientRect().width
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
  if (storySections.cards.labels.some((label) => /-\s*$/.test(label ?? ''))) {
    failures.push(`${width}px: Chinese management card titles retain trailing dashes ${JSON.stringify(storySections.cards.labels)}`);
  }
  const maximumCardHeight = width <= 767 ? 260 : 210;
  if (storySections.cards.heights.some((height) => height > maximumCardHeight)) {
    failures.push(`${width}px: Chinese management cards are taller than ${maximumCardHeight}px ${JSON.stringify(storySections.cards.heights)}`);
  }
  if (width >= 1024) {
    if (storySections.contentWidths.heroDescription / storySections.contentWidths.sectionWidth < .68
      || storySections.contentWidths.introDescription / storySections.contentWidths.sectionWidth < .68
      || storySections.contentWidths.customTitle / storySections.contentWidths.customColumn < .7
      || storySections.contentWidths.unifiedTitle / storySections.contentWidths.sectionWidth < .55) {
      failures.push(`${width}px: requested Chinese content blocks remain too narrow ${JSON.stringify(storySections.contentWidths)}`);
    }
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

console.log('Chinese homepage parity regression passed at desktop, laptop, tablet, and mobile widths with preserved tracking hooks, compact section rhythm, and readable title tracking.');
