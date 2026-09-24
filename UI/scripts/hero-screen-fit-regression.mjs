const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4300/';
const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${previewUrl}?screen-fit-regression`)}`,
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
const closeEnough = (first, second, tolerance = 0.75) => Math.abs(first - second) <= tolerance;
const viewports = [1440, 1280, 1024, 768, 430, 390];
const layouts = {};
const fitRoutes = ['/', '/cn-f&b-restaurant-cloud-pos-system'];
const fitViewports = [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 375, height: 667 }
];
const fitLayouts = {};

await send('Page.enable');
for (const width of viewports) {
  const height = width <= 430 ? 932 : width <= 768 ? 1024 : 1000;
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 768,
    screenWidth: width,
    screenHeight: height
  });
  await send('Page.navigate', { url: `${previewUrl}?screen-fit-regression-${width}` });
  await wait(1600);

  const evaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const rect = (element) => {
        const bounds = element.getBoundingClientRect();
        return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
      };
      const screenWindow = document.querySelector('.appzpos-product-hero__screen-window');
      const screenPlane = document.querySelector('.appzpos-product-hero__screen-plane');
      const screenBrand = document.querySelector('.appzpos-software-screen__brand');
      const screenBrandImage = screenBrand?.querySelector('img');
      const screenImages = [...document.querySelectorAll('.appzpos-screen-slice img')];
      const moduleCards = [...document.querySelectorAll('.appzpos-module-orbit__card')];
      const moduleList = document.querySelector('.appzpos-module-orbit__list');
      const moduleOrbit = document.querySelector('.appzpos-module-orbit');
      const machine = document.querySelector('.appzpos-product-hero__machine');
      const visual = document.querySelector('.appzpos-product-hero__visual');
      const heroTitle = document.querySelector('.appzpos-product-hero h1');
      const heroIntro = document.querySelector('.appzpos-product-hero__intro');
      const heroTitleRange = document.createRange();
      heroTitleRange.selectNodeContents(heroTitle);
      const machineImage = document.querySelector('.appzpos-product-hero__machine > img');
      const machineCanvas = document.createElement('canvas');
      machineCanvas.width = machineImage.naturalWidth;
      machineCanvas.height = machineImage.naturalHeight;
      const machineContext = machineCanvas.getContext('2d');
      machineContext.drawImage(machineImage, 0, 0);
      const alphaAt = (x, y) => machineContext.getImageData(x, y, 1, 1).data[3];
      const windowRect = rect(screenWindow);
      const brandRect = rect(screenBrand);
      const screenIsHitAt = (xRatio, yRatio) => document
        .elementsFromPoint(
          windowRect.x + (windowRect.width * xRatio),
          windowRect.y + (windowRect.height * yRatio)
        )
        .some((element) => element === screenWindow || screenWindow.contains(element));
      return {
        window: windowRect,
        plane: rect(screenPlane),
        screenPresentation: {
          transform: getComputedStyle(screenPlane).transform,
          brand: brandRect,
          brandImageLoaded: Boolean(screenBrandImage?.complete && screenBrandImage.naturalWidth),
          brandLeftRatio: (brandRect.x - windowRect.x) / windowRect.width,
          brandTopRatio: (brandRect.y - windowRect.y) / windowRect.height,
          brandRightRatio: (brandRect.x + brandRect.width - windowRect.x) / windowRect.width,
          brandBottomRatio: (brandRect.y + brandRect.height - windowRect.y) / windowRect.height
        },
        images: screenImages.map(rect),
        moduleCards: moduleCards.map(rect),
        moduleCardAnimations: moduleCards.map((card) => ({
          card: getComputedStyle(card).animationName,
          border: getComputedStyle(card, '::before').animationName,
          borderImage: getComputedStyle(card, '::before').backgroundImage,
          shadow: getComputedStyle(card).boxShadow
        })),
        moduleList: {
          ...rect(moduleList),
          overflowX: getComputedStyle(moduleList).overflowX
        },
        modulePlacement: {
          machine: rect(machine),
          orbit: rect(moduleOrbit),
          machineBeforeOrbit: [...visual.children].indexOf(machine) < [...visual.children].indexOf(moduleOrbit)
        },
        heroCopy: {
          title: rect(heroTitle),
          titleLineHeight: parseFloat(getComputedStyle(heroTitle).lineHeight),
          titleTextLines: [...heroTitleRange.getClientRects()]
            .map((line) => ({ x: line.x, y: line.y, width: line.width, height: line.height }))
            .filter((line) => line.width > 1),
          intro: rect(heroIntro)
        },
        page: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth
        },
        hardwareLayer: {
          screenCentreAlpha: alphaAt(836, 500),
          lowerLeftBezelAlpha: alphaAt(110, 650)
        },
        cornerGuardLeaks: {
          bottomLeft: screenIsHitAt(.005, .992),
          bottomRight: screenIsHitAt(.995, .992),
          topLeft: screenIsHitAt(.1235, .008),
          topRight: screenIsHitAt(.8765, .008)
        },
        tracking: {
          googleTagManager: Boolean(document.querySelector('script[src*="googletagmanager.com/gtm.js?id=GTM-N7VKTGG"]')),
          facebookPixel: Boolean(document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]'))
        }
      };
    })())`,
    returnByValue: true
  });
  layouts[width] = JSON.parse(evaluation.result.value);
}

for (const route of fitRoutes) {
  for (const viewport of fitViewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      ...viewport,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 768,
      screenWidth: viewport.width,
      screenHeight: viewport.height
    });
    const routeUrl = new URL(route, previewUrl);
    routeUrl.searchParams.set('screen-fit-regression', `${viewport.width}x${viewport.height}`);
    await send('Page.navigate', { url: routeUrl.href });
    await wait(1200);
    const evaluation = await send('Runtime.evaluate', {
      expression: `JSON.stringify((() => {
        const header = document.querySelector('#header.appzpos-header');
        const hero = document.querySelector('.appzpos-product-hero');
        const semanticNodes = [
          document.querySelector('.appzpos-product-hero__copy'),
          document.querySelector('.appzpos-product-hero__machine'),
          document.querySelector('.appzpos-module-orbit__list')
        ].filter(Boolean);
        const switcher = document.querySelector('.appzpos-industry-switcher');
        const machine = document.querySelector('.appzpos-product-hero__machine');
        const title = document.querySelector('.appzpos-product-hero h1');
        const intro = document.querySelector('.appzpos-product-hero__intro');
        const frame = document.querySelector('.appzpos-product-hero__frame');
        const orbit = document.querySelector('.appzpos-module-orbit');
        const switcherBounds = switcher.getBoundingClientRect();
        const machineBounds = machine.getBoundingClientRect();
        const orbitBounds = orbit.getBoundingClientRect();
        const visibleDeviceTop = machineBounds.top + (machineBounds.height * (235 / 941));
        const visibleDeviceBottom = machineBounds.top + (machineBounds.height * (844 / 941));
        return {
          headerHeight: header.getBoundingClientRect().height,
          heroHeight: hero.getBoundingClientRect().height,
          viewportHeight: window.innerHeight,
          heroBounds: hero.getBoundingClientRect().toJSON(),
          semanticBounds: semanticNodes.map(node => node.getBoundingClientRect().toJSON()),
          geometry: {
            language: document.querySelector('[data-home-page-template]')?.getAttribute('lang'),
            frameWidth: frame.getBoundingClientRect().width,
            machineWidth: machineBounds.width,
            machineAspect: machineBounds.width / machineBounds.height,
            switcherToMachineGap: machineBounds.top - switcherBounds.bottom,
            switcherToVisibleDeviceGap: visibleDeviceTop - switcherBounds.bottom,
            visibleDeviceToTagsGap: orbitBounds.top - visibleDeviceBottom,
            titleFontSize: parseFloat(getComputedStyle(title).fontSize),
            titleLetterSpacing: parseFloat(getComputedStyle(title).letterSpacing),
            introWidth: intro.getBoundingClientRect().width
          },
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      })())`,
      returnByValue: true
    });
    fitLayouts[`${route}:${viewport.width}x${viewport.height}`] = JSON.parse(evaluation.result.value);
  }
}

await send('Emulation.setDeviceMetricsOverride', {
  width: 1280,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
  screenWidth: 1280,
  screenHeight: 1000
});
await send('Page.navigate', { url: `${previewUrl}?screen-fit-regression-industry-sync` });
await wait(1600);
await send('Runtime.evaluate', {
  expression: `[...document.querySelectorAll('[role="tab"]')].find((tab) => tab.textContent.toUpperCase().includes('RETAIL'))?.click()`
});
await wait(520);
const industrySyncEvaluation = await send('Runtime.evaluate', {
  expression: `JSON.stringify((() => {
    const screen = document.querySelector('.appzpos-software-screen');
    const tags = document.querySelector('.appzpos-module-orbit');
    return {
      selectedTab: document.querySelector('[role="tab"][aria-selected="true"]')?.textContent.replace(/\\s+/g, ' ').trim(),
      screenIndustry: screen?.dataset.industry,
      tagsIndustry: tags?.dataset.industry,
      screenSources: [...document.querySelectorAll('.appzpos-screen-slice img')].map((image) => image.getAttribute('src')),
      tagLabels: [...document.querySelectorAll('.appzpos-module-orbit__label')].map((label) => label.textContent.trim()),
      screenAnimations: [...document.querySelectorAll('.appzpos-screen-slice')].map((slice) => getComputedStyle(slice).animationName),
      tagAnimations: [...document.querySelectorAll('.appzpos-module-orbit__card')].map((tag) => getComputedStyle(tag).animationName)
    };
  })())`,
  returnByValue: true
});
const industrySync = JSON.parse(industrySyncEvaluation.result.value);

await send('Emulation.setEmulatedMedia', {
  media: 'screen',
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
});
await send('Page.navigate', { url: `${previewUrl}?screen-fit-regression-reduced-motion` });
await wait(800);
const reducedMotionEvaluation = await send('Runtime.evaluate', {
  expression: `getComputedStyle(document.querySelector('.appzpos-module-orbit__card'), '::before').animationName`,
  returnByValue: true
});
const reducedMotionBorderAnimation = reducedMotionEvaluation.result.value;

socket.close();
const failures = [];

for (const [profile, layout] of Object.entries(fitLayouts)) {
  const heightDelta = Math.abs(layout.headerHeight + layout.heroHeight - layout.viewportHeight);
  if (heightDelta > 1) failures.push(`${profile}: header plus hero differs from viewport by ${heightDelta}px`);
  if (layout.scrollWidth > layout.clientWidth + 1) failures.push(`${profile}: page has horizontal overflow`);
  const viewportWidth = Number(profile.split(':')[1].split('x')[0]);
  const viewportHeight = Number(profile.split('x')[1]);
  const minimumMachineRatio = viewportWidth >= 1200
    ? (viewportHeight <= 800 ? .57 : .62)
    : viewportWidth >= 700 ? .735 : .9;
  if (layout.geometry.machineWidth / layout.geometry.frameWidth < minimumMachineRatio) {
    failures.push(`${profile}: POS device uses only ${(layout.geometry.machineWidth / layout.geometry.frameWidth).toFixed(2)} of the hero width; expected at least ${minimumMachineRatio}`);
  }
  if (Math.abs(layout.geometry.machineAspect - (1672 / 941)) > .04) {
    failures.push(`${profile}: POS device aspect ratio is ${layout.geometry.machineAspect.toFixed(2)} instead of its natural 1.78 ratio`);
  }
  if (layout.geometry.switcherToMachineGap > 8) {
    failures.push(`${profile}: industry tabs leave ${layout.geometry.switcherToMachineGap.toFixed(1)}px before the POS device`);
  }
  const maximumVisibleDeviceGap = viewportWidth >= 901 ? 40 : 28;
  if (layout.geometry.switcherToVisibleDeviceGap > maximumVisibleDeviceGap) {
    failures.push(`${profile}: industry tabs leave ${layout.geometry.switcherToVisibleDeviceGap.toFixed(1)}px before the visible POS hardware; expected at most ${maximumVisibleDeviceGap}px`);
  }
  if (layout.geometry.visibleDeviceToTagsGap > 22) {
    failures.push(`${profile}: function tags leave ${layout.geometry.visibleDeviceToTagsGap.toFixed(1)}px after the visible POS hardware; expected at most 22px`);
  }
  if (layout.geometry.visibleDeviceToTagsGap < -12) {
    failures.push(`${profile}: function tags overlap the visible POS hardware by ${Math.abs(layout.geometry.visibleDeviceToTagsGap).toFixed(1)}px`);
  }
  if (layout.geometry.language === 'zh') {
    const maximumChineseTitleSize = viewportWidth >= 1200 ? 60 : viewportWidth >= 700 ? 42 : 29;
    if (layout.geometry.titleFontSize > maximumChineseTitleSize) {
      failures.push(`${profile}: Chinese hero title is ${layout.geometry.titleFontSize}px; expected at most ${maximumChineseTitleSize}px`);
    }
    if (layout.geometry.titleLetterSpacing < 1) {
      failures.push(`${profile}: Chinese hero title tracking is ${layout.geometry.titleLetterSpacing}px; expected at least 1px`);
    }
    if (viewportWidth >= 1024 && layout.geometry.introWidth / layout.geometry.frameWidth < .7) {
      failures.push(`${profile}: Chinese hero description uses only ${(layout.geometry.introWidth / layout.geometry.frameWidth).toFixed(2)} of the content width`);
    }
  }
  for (const [index, bounds] of layout.semanticBounds.entries()) {
    if (bounds.top < layout.heroBounds.top - 1 || bounds.bottom > layout.heroBounds.bottom + 1) {
      failures.push(`${profile}: semantic hero node ${index + 1} is clipped by the hero`);
    }
  }
}

for (const [width, layout] of Object.entries(layouts)) {
  if (layout.images.length !== 4) {
    failures.push(`${width}px: expected four image-backed interface slices, found ${layout.images.length}`);
  }

  if (layout.moduleCards.length !== 5) {
    failures.push(`${width}px: expected five quick-service module cards, found ${layout.moduleCards.length}`);
  }
  if (layout.page.scrollWidth > layout.page.clientWidth) {
    failures.push(`${width}px: the module cards introduce horizontal page overflow`);
  }
  const titleLines = Math.round(layout.heroCopy.title.height / layout.heroCopy.titleLineHeight);
  const maximumTitleLines = Number(width) <= 430 ? 3 : 2;
  if (titleLines > maximumTitleLines) {
    failures.push(`${width}px: hero title uses ${titleLines} lines; expected at most ${maximumTitleLines}`);
  }
  if (layout.heroCopy.titleTextLines.some((line) => line.x < 8 || line.x + line.width > Number(width) - 8)) {
    failures.push(`${width}px: hero title text does not retain an 8px viewport inset`);
  }
  if (layout.heroCopy.intro.x < -0.75 || layout.heroCopy.intro.x + layout.heroCopy.intro.width > Number(width) + 0.75) {
    failures.push(`${width}px: hero description extends outside the viewport`);
  }
  if (Number(width) > 1024) {
    for (const [index, card] of layout.moduleCards.entries()) {
      if (card.x < -0.75 || card.x + card.width > Number(width) + 0.75) {
        failures.push(`${width}px: desktop module card ${index + 1} extends outside the viewport`);
      }
    }
  } else {
    if (layout.moduleList.x < -0.75 || layout.moduleList.x + layout.moduleList.width > Number(width) + 0.75) {
      failures.push(`${width}px: the module-card scroller extends outside the viewport`);
    }
    if (layout.moduleList.overflowX !== 'auto') {
      failures.push(`${width}px: the module cards are not horizontally scrollable`);
    }
  }
  if (!layout.modulePlacement.machineBeforeOrbit) {
    failures.push(`${width}px: function tags do not follow the POS device`);
  }
  for (const [index, animation] of layout.moduleCardAnimations.entries()) {
    if (animation.card !== 'none' || animation.border !== 'none') {
      failures.push(`${width}px: settled function tag ${index + 1} still animates`);
    }
    if (animation.borderImage !== 'none') {
      failures.push(`${width}px: function tag ${index + 1} still has a gradient border effect`);
    }
    if (animation.shadow !== 'none') {
      failures.push(`${width}px: function tag ${index + 1} still has a glow or shadow`);
    }
  }

  if (layout.hardwareLayer.screenCentreAlpha !== 0) {
    failures.push(`${width}px: the physical hardware layer still contains a baked software screen`);
  }
  if (layout.hardwareLayer.lowerLeftBezelAlpha === 0) {
    failures.push(`${width}px: the physical lower-left bezel is missing from the hardware layer`);
  }

  const [referenceImage, ...remainingImages] = layout.images;
  for (const [index, image] of remainingImages.entries()) {
    for (const property of ['x', 'y', 'width', 'height']) {
      if (!closeEnough(image[property], referenceImage[property])) {
        failures.push(`${width}px: screen slice ${index + 2} has a different ${property} and cannot reconstruct the full interface`);
      }
    }
  }

  if (layout.screenPresentation.transform === 'none') {
    failures.push(`${width}px: the POS interface is flattened instead of following the device-screen perspective`);
  }
  if (!layout.screenPresentation.brandImageLoaded) {
    failures.push(`${width}px: the APPZPOS screen mark did not load`);
  }
  if (layout.screenPresentation.brandLeftRatio < .14
    || layout.screenPresentation.brandTopRatio < .05
    || layout.screenPresentation.brandRightRatio > .32
    || layout.screenPresentation.brandBottomRatio > .28) {
    failures.push(`${width}px: the APPZPOS screen mark enters the bezel clipping zone`);
  }

  for (const [corner, leaks] of Object.entries(layout.cornerGuardLeaks)) {
    if (leaks) failures.push(`${width}px: the UI layer reaches the ${corner} bezel guard point`);
  }

  if (!layout.tracking.googleTagManager) failures.push(`${width}px: Google Tag Manager GTM-N7VKTGG is missing`);
  if (!layout.tracking.facebookPixel) failures.push(`${width}px: Meta Pixel loader is missing`);
}

if (reducedMotionBorderAnimation !== 'none') {
  failures.push('reduced motion: the animated module border remains active');
}

if (industrySync.selectedTab !== 'Retail') failures.push(`industry sync: selected tab is ${industrySync.selectedTab}`);
if (industrySync.screenIndustry !== 'retail' || industrySync.tagsIndustry !== 'retail') {
  failures.push(`industry sync: screen (${industrySync.screenIndustry}) and tags (${industrySync.tagsIndustry}) do not share the retail state`);
}
if (industrySync.screenSources.length !== 4
  || industrySync.screenSources.some((source) => source !== 'assets/images/appzpos-screen-retail.png')) {
  failures.push('industry sync: the Retail state does not use four Retail screen slices');
}
if (JSON.stringify(industrySync.tagLabels) !== JSON.stringify(['POS System', 'Website Ordering', 'Self Order Kiosk'])) {
  failures.push(`industry sync: Retail function tags are ${industrySync.tagLabels.join(', ')}`);
}
if (industrySync.screenAnimations.some((animation) => animation !== 'appzpos-screen-slice-rebuild')) {
  failures.push('industry sync: POS screen slices are not visibly rebuilding');
}
if (industrySync.tagAnimations.some((animation) => animation !== 'appzpos-screen-slice-crossfade')) {
  failures.push('industry sync: function tags are not animating with the POS screen');
}

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts, fitLayouts, industrySync }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', layouts, fitLayouts, industrySync }, null, 2));
