import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { collectVisibleText } from './lib/visible-text.mjs';

const componentRoot = resolve('client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components');
const homePath = resolve(componentRoot, 'index/index.component.html');
const expectedPhrases = JSON.parse(readFileSync(resolve('scripts/site-visible-copy.json'), 'utf8'));
const currentPhrases = new Set(collectVisibleText(componentRoot, [
  'custom-white-header.component.html',
  'custom-footer.component.html'
]));
const expectedHeroHash = '3d420a3a19fe647f131fbe524db1902f67fda2963f1bb88a1421cdcb9da744e1';

function extractHero(source) {
  const start = source.indexOf('<section class="appzpos-product-hero');
  const end = source.indexOf('</section>', start);
  if (start < 0 || end < 0) return '';
  return source.slice(start, end + '</section>'.length);
}

const failures = expectedPhrases
  .filter((phrase) => !currentPhrases.has(phrase))
  .map((phrase) => `visible wording removed: ${phrase}`);

const homeSource = readFileSync(homePath, 'utf8');
const heroHash = createHash('sha256').update(extractHero(homeSource)).digest('hex');
if (heroHash !== expectedHeroHash) failures.push('appzpos-product-hero source changed');

const routesSource = readFileSync(resolve(componentRoot, '../modules/custom-app-routing.module.ts'), 'utf8');
for (const route of [
  'custom-solutions', 'point-of-sales-demo-quotation', 'f&b-restaurant-cloud-pos-system',
  'retail-store-cloud-pos-system', 'salon-cloud-pos-system', 'pos-features-crm-payment-gateway',
  'psg-pos-system-grant-singapore', 'cloud-pos-point-of-sales-system',
  'f&b-restaurant-emenu-qr-code-ordering-system', 'f&b-restaurant-online-ordering-website',
  'self-order-kiosk-restaurant', 'f&b-restaurant-kitchen-display-system',
  'f&b-restaurant-queue-number-display-system', 'f&b-restaurant-delivery-integration',
  'pos-hardware-machine-receipt-printer', 'pos-solutions-partner-integrations',
  'cn-f&b-restaurant-cloud-pos-system', 'blog', 'blog-bcrs'
]) {
  if (!routesSource.includes(`path: '${route}'`)) failures.push(`route removed: ${route}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`APPZPOS content contract passed for ${expectedPhrases.length} phrases, locked appzpos-product-hero, and 19 public routes.`);
