const cdpPort = process.env.APPZPOS_CDP_PORT ?? '9225';
const previewUrl = process.env.APPZPOS_PREVIEW_URL ?? 'http://127.0.0.1:4300/';
const screenshotDir = process.env.APPZPOS_SCREENSHOT_DIR ?? '';
const psgUrl = new URL('psg-pos-system-grant-singapore', previewUrl).href;
const expectedTitle = 'Get Up to 50% PSG Grant for Local SMEs | F&B POS Packages';
const expectedHeading = 'Up to 50% Monetary Support To Kickstart Your F&B Business';
const expectedDescription = 'SMEs are eligible for up to 50% Productivity Solutions Grant (PSG) support for the adoption of APPZPOS F&B Point of Sales, a Pre-Approved Solution under the IMDA SMEs Go Digital programme.';
const expectedFaqQuestions = [
  'Q: What will be the reimbursement amount ?',
  'Q: What are the packages you provide ?',
  'Q: Who can apply ?',
  'Q: Where can I apply for Productivity Solutions Grant ?',
  'Q: Why Appzgate Solutions ?',
  'Q: How to Apply ?'
];
const expectedFaqAnswerItemCounts = [1, 6, 4, 1, 4, 4];
const expectedApplySteps = [
  {
    number: '1',
    title: 'Get A Quote from Us',
    description: 'Book a slot for demo and we will be in touch shortly to discuss available solution packages that best suit your business. A quote will be given based on your requirements.'
  },
  {
    number: '2',
    title: 'Apply PSG Grant under BGP',
    description: 'Check whether you are eligible for a PSG grant and we will assist you to submit an application on Business Grant Portal (BGP). Registration for a CorpPass account is also needed for transactions.'
  },
  {
    number: '3',
    title: 'Claim for Reimbursement',
    description: 'After receiving approval, we will arrange installation for your preferable date. Afterward, submit a claim to Enterprise Singapore for reimbursement of your approved costs.'
  }
];
const expectedPackages = [
  { label: 'PACKAGE 1', bundle: '1 Digital Ordering + 1 QR Order', featureCount: 3, includedCount: 3 },
  { label: 'PACKAGE 2', bundle: '1 Digital Ordering + 1 QR Order + 1 Order Hub', featureCount: 4, includedCount: 4 },
  { label: 'PACKAGE 3', bundle: '1 Digital Ordering + 1 QR Order + 1 Kiosk', featureCount: 4, includedCount: 4 },
  { label: 'PACKAGE 4', bundle: '1 Digital Ordering + 1 QR Order + 2 Kiosk', featureCount: 4, includedCount: 4 },
  { label: 'PACKAGE 5', bundle: '1 Digital Ordering + 1 QR Order + 1 Order Hub + 1 Kiosk', featureCount: 5, includedCount: 5 }
];
const expectedPackageFilters = ['All Packages', 'Digital Ordering System', 'QR Order', 'Kiosk', 'Order Hub'];
const knownPreviewIssuePatterns = [
  /embed\.tawk\.to/i,
  /unicons-14\.woff2/i,
  /OTS parsing error/i
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
const viewports = [390, 768, 1024, 1440];
const viewportHeights = { 390: 844, 768: 1024, 1024: 768, 1440: 900 };
const layouts = {};

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });

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
  await send('Page.navigate', { url: `${previewUrl}?psg-hero-regression-${width}-${Date.now()}` });
  await wait(900);
  await send('Runtime.evaluate', {
    expression: `history.pushState({}, '', ${JSON.stringify(psgUrl)}); window.dispatchEvent(new PopStateEvent('popstate'));`
  });
  await wait(900);

  await send('Runtime.evaluate', {
    expression: `(() => {
      window.__psgSendEmailCalls = 0;
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.__psgRequestUrl = String(url);
        return originalOpen.call(this, method, url, ...rest);
      };
      XMLHttpRequest.prototype.send = function(...args) {
        if (this.__psgRequestUrl?.includes('/SendEmail')) {
          window.__psgSendEmailCalls += 1;
          return;
        }
        return originalSend.apply(this, args);
      };
      const forms = [...document.querySelectorAll('#requestdemo form')];
      const visibleForm = forms.find((form) => form.getBoundingClientRect().width > 0 && form.getBoundingClientRect().height > 0);
      visibleForm?.requestSubmit();
      document.querySelector('.psg-faq details summary')?.click();
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
      const hero = document.querySelector('.psg-hero');
      const inner = hero?.querySelector('.psg-hero__inner');
      const copy = hero?.querySelector('.psg-hero__copy');
      const image = hero?.querySelector('.psg-hero__art img');
      const requestDemo = document.querySelector('#requestdemo');
      const requestDemoHost = requestDemo?.querySelector('app-custom-request-demo');
      const requestDemoViews = requestDemoHost ? [...requestDemoHost.querySelectorAll(':scope > #webview, :scope > #mobile_view, :scope > .appz-demo')] : [];
      const visibleRequestDemoView = requestDemoViews.find((element) => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
      const requestDemoRow = visibleRequestDemoView?.querySelector('.row');
      const requestDemoCopy = requestDemoRow?.querySelector('.col-lg-6:first-child') ?? visibleRequestDemoView?.querySelector('.appz-demo__copy');
      const requestDemoFormPanel = requestDemoRow?.querySelector('.col-lg-6:last-child') ?? visibleRequestDemoView?.querySelector('.appz-demo__form');
      const requestDemoForm = requestDemoFormPanel?.matches('form') ? requestDemoFormPanel : requestDemoFormPanel?.querySelector('form');
      const requestDemoControls = requestDemoForm ? [...requestDemoForm.querySelectorAll('input:not([type="submit"])')] : [];
      const requestDemoSubmit = requestDemoForm?.querySelector('input[type="submit"], button[type="submit"]');
      const vendor = document.querySelector('.psg-vendor');
      const vendorTitle = vendor?.querySelector('.psg-vendor__title');
      const vendorCopy = vendor?.querySelector('.psg-vendor__copy');
      const vendorArt = vendor?.querySelector('.psg-vendor__art');
      const vendorImage = vendorArt?.querySelector('img');
      const vendorItems = vendorCopy ? [...vendorCopy.querySelectorAll('li')] : [];
      const eligibility = document.querySelector('.psg-eligibility');
      const overview = document.querySelector('.psg-overview');
      const overviewGrid = overview?.querySelector('.psg-overview__grid');
      const eligibilityTitle = eligibility?.querySelector('.psg-eligibility__title');
      const eligibilityBoard = eligibility;
      const eligibilityItems = eligibility ? [...eligibility.querySelectorAll('.psg-eligibility__list > li')] : [];
      const faq = document.querySelector('.psg-faq');
      const faqTitle = faq?.querySelector('.psg-faq__title');
      const faqItems = faq ? [...faq.querySelectorAll('details')] : [];
      const faqContactLink = faq?.querySelector('a[href*="wa.me/6583109631"]');
      const apply = document.querySelector('.psg-apply');
      const applyTitle = apply?.querySelector('.psg-apply__title');
      const applyCards = apply ? [...apply.querySelectorAll('.psg-apply__card')] : [];
      const applyCardsContainer = apply?.querySelector('.psg-apply__cards');
      const packageViews = [...document.querySelectorAll('#content > .content-wrap > #webview, #content > .content-wrap > #mobile_view')];
      const visiblePackageView = packageViews.find((element) => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
      const packageCards = visiblePackageView ? [...visiblePackageView.querySelectorAll('.card')] : [];
      const packageFilters = visiblePackageView ? [...visiblePackageView.querySelectorAll('[data-package-filter]')] : [];
      const scriptSources = [...document.scripts].map((script) => script.src).filter(Boolean);
      return {
        location: window.location.href,
        title: document.title,
        frameworkOverlay: Boolean(document.querySelector('vite-error-overlay, #webpack-dev-server-client-overlay, [data-nextjs-dialog-overlay]')),
        heading: hero?.querySelector('h1')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
        headingForcedBreakCount: hero?.querySelectorAll('h1 br').length ?? 0,
        description: hero?.querySelector('p')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
        hero: bounds(hero),
        inner: bounds(inner),
        copy: bounds(copy),
        art: bounds(hero?.querySelector('.psg-hero__art')),
        image: image ? {
          bounds: bounds(image),
          src: image.getAttribute('src') ?? '',
          loaded: image.complete && image.naturalWidth > 0,
          alt: image.getAttribute('alt') ?? ''
        } : null,
        backgroundImage: hero ? getComputedStyle(hero).backgroundImage : '',
        overview: {
          section: bounds(overview),
          grid: bounds(overviewGrid),
          backgroundColor: overview ? getComputedStyle(overview).backgroundColor : '',
          borderTopWidth: overview ? parseFloat(getComputedStyle(overview).borderTopWidth) : -1,
          borderBottomWidth: overview ? parseFloat(getComputedStyle(overview).borderBottomWidth) : -1,
          sharesGrid: Boolean(vendor && eligibility && vendor.parentElement === overviewGrid && eligibility.parentElement === overviewGrid)
        },
        vendor: {
          section: bounds(vendor),
          title: bounds(vendorTitle),
          titleAlign: vendorTitle ? getComputedStyle(vendorTitle).textAlign : '',
          titleColor: vendorTitle ? getComputedStyle(vendorTitle).color : '',
          titleWhiteSpace: vendorTitle ? getComputedStyle(vendorTitle).whiteSpace : '',
          titleClientWidth: vendorTitle?.clientWidth ?? 0,
          titleScrollWidth: vendorTitle?.scrollWidth ?? 0,
          titleFontSize: vendorTitle ? getComputedStyle(vendorTitle).fontSize : '',
          titleFitsOneLine: vendorTitle ? vendorTitle.scrollWidth <= vendorTitle.clientWidth && vendorTitle.getBoundingClientRect().height <= parseFloat(getComputedStyle(vendorTitle).lineHeight) * 1.15 : false,
          backgroundColor: vendor ? getComputedStyle(vendor).backgroundColor : '',
          borderTopWidth: vendor ? parseFloat(getComputedStyle(vendor).borderTopWidth) : -1,
          copyColor: vendorItems[0] ? getComputedStyle(vendorItems[0]).color : '',
          iconColor: vendorItems[0]?.querySelector('i') ? getComputedStyle(vendorItems[0].querySelector('i')).color : '',
          copy: bounds(vendorCopy),
          copyForcedBreakCount: vendorCopy?.querySelectorAll('br').length ?? 0,
          items: vendorItems.map((item) => bounds(item)),
          lastItem: bounds(vendorItems[vendorItems.length - 1]),
          art: bounds(vendorArt),
          itemCount: vendorItems.length,
          image: vendorImage ? {
            src: vendorImage.getAttribute('src') ?? '',
            loaded: vendorImage.complete && vendorImage.naturalWidth > 0,
            alt: vendorImage.getAttribute('alt') ?? ''
          } : null
        },
        eligibility: {
          section: bounds(eligibility),
          title: bounds(eligibilityTitle),
          titleAlign: eligibilityTitle ? getComputedStyle(eligibilityTitle).textAlign : '',
          titleFontSize: eligibilityTitle ? getComputedStyle(eligibilityTitle).fontSize : '',
          board: eligibilityBoard ? {
            bounds: bounds(eligibilityBoard),
            backgroundColor: getComputedStyle(eligibilityBoard).backgroundColor,
            borderTopStyle: getComputedStyle(eligibilityBoard).borderTopStyle,
            borderRadius: parseFloat(getComputedStyle(eligibilityBoard).borderTopLeftRadius),
            clip: {
              content: getComputedStyle(eligibilityBoard, '::before').content,
              position: getComputedStyle(eligibilityBoard, '::before').position,
              top: parseFloat(getComputedStyle(eligibilityBoard, '::before').top),
              borderTopStyle: getComputedStyle(eligibilityBoard, '::before').borderTopStyle
            },
            loop: {
              content: getComputedStyle(eligibilityBoard, '::after').content,
              position: getComputedStyle(eligibilityBoard, '::after').position,
              top: parseFloat(getComputedStyle(eligibilityBoard, '::after').top),
              borderTopStyle: getComputedStyle(eligibilityBoard, '::after').borderTopStyle,
              borderRadius: parseFloat(getComputedStyle(eligibilityBoard, '::after').borderTopLeftRadius)
            }
          } : null,
          items: eligibilityItems.map((item) => {
            const tick = item.querySelector('.bi-check-circle-fill');
            const text = item.querySelector('span');
            return {
              bounds: bounds(item),
              hasTick: Boolean(tick),
              tick: bounds(tick),
              textBounds: bounds(text),
              text: item.textContent?.replace(/\\s+/g, ' ').trim() ?? ''
            };
          }),
          eligibilityLink: eligibility?.querySelector('a[href*="gobusiness.gov.sg/productivity-solutions-grant"]')?.getAttribute('href') ?? '',
          guideLink: eligibility?.querySelector('a[href*="enterprisesg.gov.sg"]')?.getAttribute('href') ?? ''
        },
        requestDemo: {
          container: bounds(requestDemo),
          opacity: requestDemo ? parseFloat(getComputedStyle(requestDemo).opacity) : -1,
          transform: requestDemo ? getComputedStyle(requestDemo).transform : '',
          filter: requestDemo ? getComputedStyle(requestDemo).filter : '',
          animationName: requestDemo ? getComputedStyle(requestDemo).animationName : '',
          host: bounds(requestDemoHost),
          hasSharedDesignClass: requestDemoHost?.classList.contains('shared-contact-design') ?? false,
          visibleView: bounds(visibleRequestDemoView),
          backgroundImage: visibleRequestDemoView ? getComputedStyle(visibleRequestDemoView.querySelector('.overflow-hidden.h-100') ?? visibleRequestDemoView).backgroundImage : '',
          copy: bounds(requestDemoCopy),
          formPanel: bounds(requestDemoFormPanel),
          form: bounds(requestDemoForm),
          controlIds: requestDemoControls.map((control) => control.id),
          invalidControlCount: requestDemoControls.filter((control) => control.classList.contains('is-invalid')).length,
          visibleValidationCount: requestDemoForm ? [...requestDemoForm.querySelectorAll('.invalid-feedback')]
            .filter((element) => getComputedStyle(element).display !== 'none').length : 0,
          submit: bounds(requestDemoSubmit),
          sendEmailCalls: window.__psgSendEmailCalls ?? -1
        },
        faq: {
          section: bounds(faq),
          title: bounds(faqTitle),
          titleAlign: faqTitle ? getComputedStyle(faqTitle).textAlign : '',
          questions: faqItems.map((item) => item.querySelector('summary')?.textContent?.replace(/\\s+/g, ' ').trim() ?? ''),
          answerItemCounts: faqItems.map((item) => item.querySelectorAll('.psg-faq__answer li').length),
          firstItemOpen: faqItems[0]?.open ?? false,
          firstAnswer: bounds(faqItems[0]?.querySelector('.psg-faq__answer')),
          buttonBackgroundColor: faqItems[0] ? getComputedStyle(faqItems[0].querySelector('summary'), '::after').backgroundColor : '',
          buttonColor: faqItems[0] ? getComputedStyle(faqItems[0].querySelector('summary'), '::after').color : '',
          grantPortalLink: faq?.querySelector('a[href="https://www.businessgrants.gov.sg/"]')?.getAttribute('href') ?? '',
          contactLink: faqContactLink?.getAttribute('href') ?? ''
        },
        apply: {
          section: bounds(apply),
          title: bounds(applyTitle),
          titleText: applyTitle?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
          cardsContainer: bounds(applyCardsContainer),
          cards: applyCards.map((card) => ({
            bounds: bounds(card),
            number: card.querySelector('.psg-apply__number')?.textContent?.trim() ?? '',
            numberBackgroundColor: card.querySelector('.psg-apply__number') ? getComputedStyle(card.querySelector('.psg-apply__number')).backgroundColor : '',
            title: card.querySelector('.psg-apply__step-title')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
            description: card.querySelector('.psg-apply__description')?.innerText?.replace(/\\s+/g, ' ').trim() ?? ''
          }))
        },
        packages: {
          section: bounds(visiblePackageView),
          viewId: visiblePackageView?.id ?? '',
          heading: visiblePackageView?.querySelector('.heading-block h2')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
          filterDescription: visiblePackageView?.querySelector('.psg-package-filter-description')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
          filterDescriptionBounds: bounds(visiblePackageView?.querySelector('.psg-package-filter-description')),
          filters: packageFilters.map((button) => ({
            bounds: bounds(button),
            key: button.getAttribute('data-package-filter') ?? '',
            label: button.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
            pressed: button.getAttribute('aria-pressed') === 'true',
            description: button.getAttribute('title')?.trim() ?? ''
          })),
          cards: packageCards.map((card) => {
            const body = card.querySelector('.card-body');
            const image = body?.querySelector(':scope > img');
            const headings = body ? [...body.querySelectorAll(':scope > h5')] : [];
            const lists = body ? [...body.querySelectorAll(':scope > ul')] : [];
            const featureHeading = headings[0];
            const includedHeading = headings[headings.length - 1];
            const featureList = lists[0];
            const includedList = lists[lists.length - 1];
            const panelBounds = (heading, list) => {
              const headingRect = heading?.getBoundingClientRect();
              const listRect = list?.getBoundingClientRect();
              if (!headingRect || !listRect) return null;
              return { x: headingRect.x, y: headingRect.y, width: headingRect.width, height: listRect.bottom - headingRect.y };
            };
            return {
              bounds: bounds(card),
              body: bounds(body),
              label: body?.querySelector(':scope > h2')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
              bundle: body?.querySelector(':scope > h4')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
              image: bounds(image),
              imageSrc: image?.getAttribute('src') ?? '',
              imageLoaded: image?.complete && image.naturalWidth > 0,
              featurePanel: panelBounds(featureHeading, featureList),
              includedPanel: panelBounds(includedHeading, includedList),
              featureCount: featureList?.querySelectorAll(':scope > li').length ?? 0,
              includedCount: includedList?.querySelectorAll(':scope > li').length ?? 0,
              quoteHref: body?.querySelector('a[href*="wa.me/6583109631"]')?.getAttribute('href') ?? ''
            };
          })
        },
        tagging: {
          googleTagManagerLoaded: scriptSources.some((src) => src.includes('googletagmanager.com/gtm.js?id=GTM-N7VKTGG')),
          googleTagManagerFrame: Boolean(document.querySelector('iframe[src*="googletagmanager.com/ns.html?id=GTM-N7VKTGG"]')),
          dataLayerInitialized: Array.isArray(window.dataLayer) && window.dataLayer.some((entry) => entry?.event === 'gtm.js'),
          metaPixelLoaded: scriptSources.some((src) => src.includes('connect.facebook.net/en_US/fbevents.js')),
          metaPixelInitialized: typeof window.fbq === 'function',
          metaPixelFallback: Boolean(document.querySelector('img[src*="facebook.com/tr?id=892134809204935"]'))
        },
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      };
    })())`,
    returnByValue: true
  });
  layouts[width] = JSON.parse(evaluation.result.value);
  await send('Runtime.evaluate', {
    expression: `(() => {
      const views = [...document.querySelectorAll('#content > .content-wrap > #webview, #content > .content-wrap > #mobile_view')];
      const visibleView = views.find((element) => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
      visibleView?.querySelector('[data-package-filter="kiosk"]')?.click();
      visibleView?.querySelector('[data-package-filter="order-hub"]')?.click();
    })()`
  });
  await wait(100);
  const packageFilterEvaluation = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const views = [...document.querySelectorAll('#content > .content-wrap > #webview, #content > .content-wrap > #mobile_view')];
      const visibleView = views.find((element) => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
      const activeKeys = visibleView ? [...visibleView.querySelectorAll('[data-package-filter][aria-pressed="true"]')].map((button) => button.getAttribute('data-package-filter')) : [];
      const visibleLabels = visibleView ? [...visibleView.querySelectorAll('.card')]
        .filter((card) => getComputedStyle(card.closest('.col-lg-4, .oc-item') ?? card).display !== 'none')
        .map((card) => card.querySelector('.card-body > h2')?.textContent?.replace(/\\s+/g, ' ').trim() ?? '') : [];
      return { activeKeys, visibleLabels };
    })())`,
    returnByValue: true
  });
  layouts[width].packages.filterState = JSON.parse(packageFilterEvaluation.result.value);
  layouts[width].browserIssues = [...new Set(browserIssues)];
  layouts[width].relevantBrowserIssues = layouts[width].browserIssues.filter(
    (issue) => !knownPreviewIssuePatterns.some((pattern) => pattern.test(issue))
  );

  if (screenshotDir) {
    const { writeFile } = await import('node:fs/promises');
    const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    await writeFile(`${screenshotDir}/appzpos-psg-hero-${width}.png`, Buffer.from(screenshot.data, 'base64'));
    const vendorSection = layouts[width].vendor.section;
    const eligibilitySection = layouts[width].eligibility.section;
    if (vendorSection && eligibilitySection) {
      const vendorScreenshot = await send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: true,
        clip: {
          x: 0,
          y: vendorSection.y,
          width: layouts[width].clientWidth,
          height: eligibilitySection.y + eligibilitySection.height - vendorSection.y,
          scale: 1
        }
      });
      await writeFile(`${screenshotDir}/appzpos-psg-vendor-${width}.png`, Buffer.from(vendorScreenshot.data, 'base64'));
    }
    const formSection = layouts[width].requestDemo.container;
    const formScreenshot = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: formSection.y,
        width: layouts[width].clientWidth,
        height: formSection.height,
        scale: 1
      }
    });
    await writeFile(`${screenshotDir}/appzpos-psg-form-${width}.png`, Buffer.from(formScreenshot.data, 'base64'));
    const faqSection = layouts[width].faq.section;
    if (faqSection) {
      const faqScreenshot = await send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: true,
        clip: {
          x: 0,
          y: faqSection.y,
          width: layouts[width].clientWidth,
          height: faqSection.height,
          scale: 1
        }
      });
      await writeFile(`${screenshotDir}/appzpos-psg-faq-${width}.png`, Buffer.from(faqScreenshot.data, 'base64'));
    }
    const applySection = layouts[width].apply.section;
    if (applySection) {
      const applyScreenshot = await send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: true,
        clip: {
          x: 0,
          y: applySection.y,
          width: layouts[width].clientWidth,
          height: applySection.height,
          scale: 1
        }
      });
      await writeFile(`${screenshotDir}/appzpos-psg-apply-${width}.png`, Buffer.from(applyScreenshot.data, 'base64'));
    }
    await send('Runtime.evaluate', {
      expression: `(() => {
        const views = [...document.querySelectorAll('#content > .content-wrap > #webview, #content > .content-wrap > #mobile_view')];
        const visibleView = views.find((element) => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
        visibleView?.querySelector('[data-package-filter="all"]')?.click();
      })()`
    });
    await wait(100);
    const packageSectionEvaluation = await send('Runtime.evaluate', {
      expression: `JSON.stringify((() => {
        const sections = [...document.querySelectorAll('.psg-packages-view')];
        const section = sections.find((element) => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
        if (!section) return null;
        const bounds = section.getBoundingClientRect();
        return { x: 0, y: bounds.top + scrollY, width: document.documentElement.clientWidth, height: bounds.height };
      })())`,
      returnByValue: true
    });
    const packageSection = JSON.parse(packageSectionEvaluation.result.value);
    if (packageSection) {
      const packageScreenshot = await send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: true,
        clip: { ...packageSection, scale: 1 }
      });
      await writeFile(`${screenshotDir}/appzpos-psg-packages-${width}.png`, Buffer.from(packageScreenshot.data, 'base64'));
    }
  }
}

await send('Page.close');
socket.close();

const failures = [];
for (const [width, layout] of Object.entries(layouts)) {
  if (layout.location !== psgUrl) failures.push(`${width}px: browser did not remain on the PSG route`);
  if (layout.title !== expectedTitle) failures.push(`${width}px: PSG page title is missing or incorrect`);
  if (layout.frameworkOverlay) failures.push(`${width}px: a framework error overlay is visible`);
  if (layout.relevantBrowserIssues.length) failures.push(`${width}px: browser console contains relevant errors or warnings: ${layout.relevantBrowserIssues.join(' | ')}`);
  if (!layout.hero || !layout.copy || !layout.art || !layout.image) failures.push(`${width}px: responsive PSG hero structure is missing`);
  if (layout.heading !== expectedHeading) failures.push(`${width}px: approved PSG heading changed`);
  if (layout.headingForcedBreakCount !== 0) failures.push(`${width}px: PSG hero heading contains a forced line break`);
  if (layout.description !== expectedDescription) failures.push(`${width}px: approved PSG description changed`);
  if (layout.backgroundImage !== 'none') failures.push(`${width}px: PSG hero still uses a background image`);
  if (layout.image && !layout.image.src.endsWith('smes-go-digital-grant-vertical.webp')) failures.push(`${width}px: hero does not use the supplied vertical grant artwork`);
  if (layout.image && !layout.image.loaded) failures.push(`${width}px: grant artwork did not load`);
  if (layout.image && !/IMDA SMEs Go Digital pre-approved solution/i.test(layout.image.alt)) failures.push(`${width}px: grant artwork lacks descriptive alt text`);
  if (!layout.overview.section || !layout.overview.grid || !layout.overview.sharesGrid) failures.push(`${width}px: PSG vendor and eligibility content are not combined in one shared section`);
  if (layout.overview.backgroundColor !== 'rgb(255, 255, 255)') failures.push(`${width}px: combined PSG section does not use a white background`);
  if (layout.overview.borderTopWidth !== 0 || layout.overview.borderBottomWidth !== 0) failures.push(`${width}px: combined PSG section still has horizontal divider lines`);
  if (!layout.vendor.section || !layout.vendor.title || !layout.vendor.copy) failures.push(`${width}px: PSG vendor section is missing`);
  if (layout.vendor.titleAlign !== 'center') failures.push(`${width}px: PSG vendor title is not centered`);
  if (layout.vendor.titleFontSize !== layout.eligibility.titleFontSize) failures.push(`${width}px: PSG vendor and eligibility titles do not use the same font size`);
  if (layout.vendor.backgroundColor !== 'rgb(116, 57, 149)') failures.push(`${width}px: PSG vendor panel does not use the approved purple background`);
  if (layout.vendor.borderTopWidth !== 0) failures.push(`${width}px: PSG vendor panel still has a border`);
  if (layout.vendor.titleColor !== 'rgb(255, 255, 255)' || layout.vendor.copyColor !== 'rgb(255, 255, 255)' || layout.vendor.iconColor !== 'rgb(255, 255, 255)') failures.push(`${width}px: PSG vendor title, wording, or icons are not white`);
  if (layout.vendor.titleWhiteSpace !== 'nowrap' || !layout.vendor.titleFitsOneLine) failures.push(`${width}px: PSG Pre-approved Vendor title does not fit on one line`);
  if (layout.vendor.itemCount !== 3) failures.push(`${width}px: PSG vendor wording changed or is incomplete`);
  if (layout.vendor.copyForcedBreakCount !== 0) failures.push(`${width}px: PSG vendor wording contains forced line breaks`);
  if (layout.vendor.art || layout.vendor.image) failures.push(`${width}px: PSG vendor diagram is still present`);
  if (!layout.eligibility.section || !layout.eligibility.title) failures.push(`${width}px: PSG eligibility section is missing`);
  if (layout.eligibility.titleAlign !== 'center') failures.push(`${width}px: PSG eligibility title is not centered`);
  if (!layout.eligibility.board || layout.eligibility.board.backgroundColor !== 'rgb(255, 255, 255)' || layout.eligibility.board.borderTopStyle === 'none' || layout.eligibility.board.borderRadius <= 0) failures.push(`${width}px: PSG eligibility title and items are not enclosed in one bordered white clipboard`);
  if (!layout.eligibility.board || layout.eligibility.board.clip.content === 'none' || layout.eligibility.board.clip.position !== 'absolute' || layout.eligibility.board.clip.top >= 0 || layout.eligibility.board.clip.borderTopStyle === 'none') failures.push(`${width}px: eligibility board is missing its raised clipboard clip`);
  if (!layout.eligibility.board || layout.eligibility.board.loop.content === 'none' || layout.eligibility.board.loop.position !== 'absolute' || layout.eligibility.board.loop.top >= layout.eligibility.board.clip.top || layout.eligibility.board.loop.borderTopStyle === 'none' || layout.eligibility.board.loop.borderRadius <= 0) failures.push(`${width}px: eligibility board is missing its curved clipboard tab`);
  if (layout.eligibility.title && layout.eligibility.board && (layout.eligibility.title.y < layout.eligibility.board.bounds.y || layout.eligibility.title.y + layout.eligibility.title.height >= layout.eligibility.items[0]?.bounds.y)) failures.push(`${width}px: PSG eligibility title is not positioned inside the clipboard above the checklist`);
  if (layout.eligibility.items.length !== 5) failures.push(`${width}px: PSG eligibility list does not contain all five items`);
  if (layout.eligibility.items.some((item) => !item.hasTick)) failures.push(`${width}px: PSG eligibility items are not presented as a tick list`);
  if (layout.eligibility.items.some((item) => !item.tick || !item.textBounds || item.tick.x >= item.textBounds.x)) failures.push(`${width}px: an eligibility tick is not positioned to the left of its wording`);
  if (layout.eligibility.items.some((item, index, items) => index > 0 && item.bounds.y <= items[index - 1].bounds.y)) failures.push(`${width}px: eligibility board is not a vertically stacked checklist`);
  if (!layout.eligibility.eligibilityLink || !layout.eligibility.guideLink) failures.push(`${width}px: PSG eligibility resource links changed or are missing`);
  if (!layout.requestDemo.container || !layout.requestDemo.host || !layout.requestDemo.visibleView) failures.push(`${width}px: bottom request-demo section is missing`);
  if (layout.requestDemo.opacity !== 1 || layout.requestDemo.transform !== 'none' || layout.requestDemo.filter !== 'none' || layout.requestDemo.animationName !== 'none') failures.push(`${width}px: bottom request-demo section is rendered with a fading, transform, filter, or animation effect`);
  if (!layout.requestDemo.hasSharedDesignClass) failures.push(`${width}px: bottom form does not use the shared contact presentation`);
  if (layout.requestDemo.backgroundImage !== 'none') failures.push(`${width}px: bottom form still uses the legacy background image`);
  if (layout.requestDemo.controlIds.join(',') !== 'name,email,mobilenum,restaurant_name') failures.push(`${width}px: request-demo form controls or identifiers changed`);
  if (layout.requestDemo.invalidControlCount !== 4) failures.push(`${width}px: empty submission does not mark all four required controls`);
  if (layout.requestDemo.visibleValidationCount < 4) failures.push(`${width}px: empty submission does not show all four validation messages`);
  if (layout.requestDemo.sendEmailCalls !== 0) failures.push(`${width}px: invalid submission reached the email API`);
  if (!layout.faq.section || !layout.faq.title) failures.push(`${width}px: standard PSG FAQ section is missing`);
  if (layout.faq.titleAlign !== 'center') failures.push(`${width}px: PSG FAQ title is not centered`);
  if (JSON.stringify(layout.faq.questions) !== JSON.stringify(expectedFaqQuestions)) failures.push(`${width}px: PSG FAQ questions changed or are not rendered as six accordion rows`);
  if (JSON.stringify(layout.faq.answerItemCounts) !== JSON.stringify(expectedFaqAnswerItemCounts)) failures.push(`${width}px: PSG FAQ answers changed or are incomplete`);
  if (!layout.faq.firstItemOpen || !layout.faq.firstAnswer || layout.faq.firstAnswer.height <= 0) failures.push(`${width}px: PSG FAQ accordion does not expand its answer when clicked`);
  if (layout.faq.buttonBackgroundColor !== 'rgb(116, 57, 149)' || layout.faq.buttonColor !== 'rgb(255, 255, 255)') failures.push(`${width}px: PSG FAQ plus/minus button does not use the approved purple and white treatment`);
  if (!layout.faq.grantPortalLink || !layout.faq.contactLink) failures.push(`${width}px: PSG FAQ resource or contact link changed or is missing`);
  if (!layout.apply.section || !layout.apply.title || !layout.apply.cardsContainer) failures.push(`${width}px: responsive PSG application steps section is missing`);
  if (layout.apply.titleText !== 'How to Apply PSG Grant for our POS System') failures.push(`${width}px: PSG application section title changed`);
  if (JSON.stringify(layout.apply.cards.map(({ number, title, description }) => ({ number, title, description }))) !== JSON.stringify(expectedApplySteps)) failures.push(`${width}px: PSG application steps changed or are not rendered as three cards`);
  if (layout.apply.cards.some((card) => card.numberBackgroundColor !== 'rgb(116, 57, 149)')) failures.push(`${width}px: PSG application step numbers do not use the approved purple treatment`);
  if (!layout.packages.section || layout.packages.heading !== 'APPZPOS PSG Packages') failures.push(`${width}px: APPZPOS PSG Packages section or heading is missing`);
  if (!layout.packages.filterDescription || layout.packages.filters.some(({ description }) => !description)) failures.push(`${width}px: package filters are missing their simple descriptions`);
  if (!layout.packages.filterDescriptionBounds || layout.packages.filterDescriptionBounds.width > layout.packages.section.width) failures.push(`${width}px: package filter description is clipped or wider than its section`);
  if (layout.packages.filters.some(({ bounds }) => !bounds || bounds.x < layout.packages.section.x || bounds.x + bounds.width > layout.packages.section.x + layout.packages.section.width || bounds.height < 44)) failures.push(`${width}px: a package filter is clipped or smaller than the minimum touch target`);
  if (JSON.stringify(layout.packages.filters.map(({ label }) => label)) !== JSON.stringify(expectedPackageFilters) || layout.packages.filters.some(({ label }) => /hardware/i.test(label))) failures.push(`${width}px: package filters are missing, reordered, or include an unapproved hardware filter`);
  if (JSON.stringify(layout.packages.filterState.activeKeys) !== JSON.stringify(['kiosk', 'order-hub']) || JSON.stringify(layout.packages.filterState.visibleLabels) !== JSON.stringify(['PACKAGE 5'])) failures.push(`${width}px: combined Kiosk and Order Hub filters do not show only Package 5`);
  if (JSON.stringify(layout.packages.cards.map(({ label, bundle, featureCount, includedCount }) => ({ label, bundle, featureCount, includedCount }))) !== JSON.stringify(expectedPackages)) failures.push(`${width}px: package names, features, or included items changed`);
  if (layout.packages.cards.some((card) => !card.imageSrc || !card.quoteHref)) failures.push(`${width}px: a package image source or quote link is missing`);
  if (!Object.values(layout.tagging).every(Boolean)) failures.push(`${width}px: Google Tag Manager or Meta Pixel tagging is missing`);
  if (layout.scrollWidth > layout.clientWidth) failures.push(`${width}px: page has horizontal overflow`);
}

const desktop = layouts[1440];
if (desktop.copy && desktop.art && desktop.art.x <= desktop.copy.x + desktop.copy.width) {
  failures.push('1440px: grant artwork is not positioned to the right of the wording');
}
if (desktop.vendor.section && desktop.eligibility.section && desktop.eligibility.section.x <= desktop.vendor.section.x + desktop.vendor.section.width) {
  failures.push('1440px: eligibility content is not positioned to the right of the vendor content');
}
if (desktop.vendor.section && desktop.eligibility.section && Math.abs(desktop.vendor.section.width - desktop.eligibility.section.width) > 2) {
  failures.push('1440px: PSG vendor and eligibility panels do not use the balanced width split');
}
if (parseFloat(desktop.vendor.titleFontSize) < 34 || desktop.vendor.titleFontSize !== desktop.eligibility.titleFontSize) {
  failures.push('1440px: PSG vendor and eligibility titles do not use the approved larger matching size');
}
if (desktop.vendor.section && desktop.eligibility.section && (Math.abs(desktop.vendor.section.y - desktop.eligibility.section.y) > 1 || Math.abs(desktop.vendor.section.height - desktop.eligibility.section.height) > 1)) {
  failures.push('1440px: PSG vendor and eligibility panels do not have matching top and bottom edges');
}
if (desktop.vendor.section && desktop.vendor.lastItem && desktop.vendor.section.y + desktop.vendor.section.height - (desktop.vendor.lastItem.y + desktop.vendor.lastItem.height) > 160) {
  failures.push('1440px: PSG vendor content leaves excessive empty space at the bottom of the purple panel');
}
if (desktop.vendor.items.some((item, index, items) => index > 0 && item.y - (items[index - 1].y + items[index - 1].height) > 32)) {
  failures.push('1440px: PSG vendor points have excessive vertical gaps');
}
if (desktop.packages.cards.some((card) => !card.image || !card.featurePanel || !card.includedPanel || !(card.image.x < card.featurePanel.x && card.featurePanel.x < card.includedPanel.x))) {
  failures.push('1440px: package cards are not arranged image, features, then included content horizontally');
}
if (desktop.packages.cards.some((card) => card.bounds.width < desktop.packages.section.width * .8)) {
  failures.push('1440px: package cards do not use the full-width horizontal container');
}
if (desktop.packages.cards.some((card) => Math.abs(card.featurePanel.height - card.includedPanel.height) > 1)) {
  failures.push('1440px: package features and included content do not have matching heights');
}
if (desktop.packages.cards.some((card, index, cards) => index > 0 && card.bounds.y <= cards[index - 1].bounds.y + cards[index - 1].bounds.height)) {
  failures.push('1440px: package cards are not vertically stacked');
}
if (desktop.requestDemo.copy && desktop.requestDemo.formPanel && desktop.requestDemo.formPanel.x <= desktop.requestDemo.copy.x + desktop.requestDemo.copy.width) {
  failures.push('1440px: request-demo form is not positioned to the right of its wording and contact details');
}
if (desktop.apply.title && desktop.apply.cardsContainer && desktop.apply.cardsContainer.x <= desktop.apply.title.x + desktop.apply.title.width) {
  failures.push('1440px: PSG application title is not positioned to the left of the three cards');
}
if (desktop.apply.title && desktop.apply.cardsContainer && Math.abs((desktop.apply.title.y + desktop.apply.title.height / 2) - (desktop.apply.cardsContainer.y + desktop.apply.cardsContainer.height / 2)) > 2) {
  failures.push('1440px: PSG application title is not vertically centered beside the three steps');
}
if (desktop.apply.cards.length === 3 && (desktop.apply.cards.some((card, index, cards) => index > 0 && card.bounds.y <= cards[index - 1].bounds.y + cards[index - 1].bounds.height) || desktop.apply.cards.some((card) => Math.abs(card.bounds.x - desktop.apply.cards[0].bounds.x) > 1))) {
  failures.push('1440px: PSG application cards are not vertically stacked on the right');
}

const mobile = layouts[390];
if (mobile.copy && mobile.art && mobile.art.y <= mobile.copy.y + mobile.copy.height) {
  failures.push('390px: grant artwork is not stacked below the wording');
}
if (mobile.vendor.section && mobile.eligibility.section && mobile.eligibility.section.y <= mobile.vendor.section.y + mobile.vendor.section.height) {
  failures.push('390px: eligibility content is not stacked below the vendor content');
}
if (mobile.requestDemo.copy && mobile.requestDemo.formPanel && mobile.requestDemo.formPanel.y <= mobile.requestDemo.copy.y + mobile.requestDemo.copy.height) {
  failures.push('390px: request-demo form is not stacked below its wording');
}
if (mobile.apply.title && mobile.apply.cardsContainer && mobile.apply.cardsContainer.y <= mobile.apply.title.y + mobile.apply.title.height) {
  failures.push('390px: PSG application cards are not stacked below the title');
}
if (mobile.apply.cards.length === 3 && mobile.apply.cards.some((card, index, cards) => index > 0 && card.bounds.y <= cards[index - 1].bounds.y + cards[index - 1].bounds.height)) {
  failures.push('390px: PSG application cards are not vertically stacked');
}

const tablet = layouts[768];
if (tablet.packages.viewId !== 'mobile_view') {
  failures.push('768px: tablet does not use the stacked package presentation');
}
if (tablet.packages.cards.some((card) => !card.image || !card.featurePanel || !card.includedPanel || !(card.image.y < card.featurePanel.y && card.featurePanel.y < card.includedPanel.y))) {
  failures.push('768px: tablet package cards are not stacked image, features, then included content');
}
if (tablet.copy && tablet.art && tablet.art.y <= tablet.copy.y + tablet.copy.height) {
  failures.push('768px: tablet grant artwork is not stacked below the wording');
}

const laptop = layouts[1024];
if (laptop.packages.viewId !== 'webview') {
  failures.push('1024px: laptop does not use the horizontal package presentation');
}
if (laptop.packages.cards.some((card) => !card.image || !card.featurePanel || !card.includedPanel || !(card.image.x < card.featurePanel.x && card.featurePanel.x < card.includedPanel.x))) {
  failures.push('1024px: laptop package cards are not arranged image, features, then included content horizontally');
}
if (laptop.packages.cards.some((card) => Math.abs(card.featurePanel.height - card.includedPanel.height) > 1)) {
  failures.push('1024px: laptop package feature and included panels do not have matching heights');
}

for (const [width, layout] of Object.entries(layouts)) {
  const filters = layout.packages.filters.map(({ bounds }) => bounds).filter(Boolean);
  const hasOverlap = filters.some((filter, index) => filters.slice(index + 1).some((other) =>
    filter.x < other.x + other.width && filter.x + filter.width > other.x &&
    filter.y < other.y + other.height && filter.y + filter.height > other.y
  ));
  if (hasOverlap) failures.push(`${width}px: package filter buttons overlap`);
}

if (failures.length) {
  console.error(JSON.stringify({ failures, layouts }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'pass', layouts }, null, 2));
