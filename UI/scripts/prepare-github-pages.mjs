import { readFile, writeFile } from 'node:fs/promises';

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
