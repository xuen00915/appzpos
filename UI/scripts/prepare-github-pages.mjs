import { mkdir, readFile, writeFile } from 'node:fs/promises';

const indexPath = new URL('../dist/e-commerce/index.html', import.meta.url);
const fallbackPath = new URL('../dist/e-commerce/404.html', import.meta.url);

const navigationPatch = `
  <script data-github-pages-navigation>
    (() => {
      const prefix = '/appzpos';
      const rewriteLinks = (root) => {
        if (!root.querySelectorAll) return;
        root.querySelectorAll('a[href^="/"]').forEach((link) => {
          const href = link.getAttribute('href');
          if (href && href !== prefix && !href.startsWith(prefix + '/')) {
            link.setAttribute('href', prefix + (href === '/' ? '/' : href));
          }
        });
      };

      rewriteLinks(document);
      new MutationObserver((records) => {
        records.forEach((record) => record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) rewriteLinks(node);
        }));
      }).observe(document.documentElement, { childList: true, subtree: true });
    })();
  </script>
`;

const source = await readFile(indexPath, 'utf8');
if (!source.includes('data-github-pages-navigation')) {
  const output = source.replace('</head>', `${navigationPatch}</head>`);
  await writeFile(indexPath, output);
  await writeFile(fallbackPath, output);
}

// Pages answers unknown paths with 404.html (HTTP 404). Google Ads disapproves final URLs
// that return 404, so ad landing pages get a real index.html and answer with HTTP 200.
const landingRoutes = {
  'lp/restaurant-pos-system-singapore': {
    title: 'Restaurant POS System Singapore | Cloud F&amp;B POS | APPZPOS',
    description: 'Restaurant POS system in Singapore: cloud POS for F&amp;B with kitchen display, delivery integration and reports. Up to 50% EDGE Grant support for eligible companies. Book a free demo.'
  }
};
const siteHtml = await readFile(indexPath, 'utf8');
for (const [route, head] of Object.entries(landingRoutes)) {
  // The app sets these at runtime; writing them into the static HTML too means crawlers, link
  // previews and no-script readers see the landing copy instead of the sitewide title and "#1" claim.
  const landingHtml = siteHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${head.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${head.description}"><meta name="robots" content="noindex, nofollow">`);
  if (!landingHtml.includes(head.title) || !landingHtml.includes('noindex')) throw new Error(`Landing head was not applied for ${route}`);
  const directory = new URL(`../dist/e-commerce/${route}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), landingHtml);
}

