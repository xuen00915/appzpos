import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { collectVisibleText } from './lib/visible-text.mjs';

const componentRoot = resolve('client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components');
const homePath = resolve(componentRoot, 'index/index.component.html');
const homeConfigSource = [
  'index/home-page-content.en.ts',
  'index/home-page-sections.en.ts',
  'index/home-page-proof.en.ts',
  'cn-f&b-restaurant-cloud-pos-system/home-page-content.zh.ts',
  'custom-request-demo/custom-request-demo.component.ts'
].map((path) => readFileSync(resolve(componentRoot, path), 'utf8')).join('\n');
const homeOrderFlowSource = readFileSync(
  resolve(componentRoot, 'home-order-flow/home-order-flow.component.html'),
  'utf8'
);
const expectedPhrases = JSON.parse(readFileSync(resolve('scripts/site-visible-copy.json'), 'utf8'));
const currentPhrases = new Set(collectVisibleText(componentRoot, [
  'custom-white-header.component.html',
  'custom-footer.component.html'
]));
const posSolutionSource = readFileSync(resolve(
  componentRoot,
  'cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component.ts'
), 'utf8');
const posSolutionHeroTitle = 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System';
// Approved homepage hero changes: remove the eyebrow label and CTA arrows.
const expectedHeroHash = '0935fcc0d345b887d9dbaf089fe700f02c3ea4d76d8eaceb53009563d2d9c398';
const approvedRemovedPhrases = new Set([
  // Approved CTA cleanup: decorative arrows are not button wording.
  '→',
  'SINGAPORE CLOUD POS',
  '50%',
  'PRODUCTIVITY SOLUTIONS GRANT',
  'UP TO',
  // The old desktop/mobile banners split this heading around a <br> tag.
  // The shared solution hero keeps the exact wording as one responsive H1.
  'Centralized Delivery Platform Integration',
  'Through APPZPOS Order Hub'
]);

function extractHero(source) {
  const pageConfig = source.indexOf('export const ENGLISH_HOME_PAGE_CONFIG');
  const start = source.indexOf('  hero: {', pageConfig);
  const end = source.indexOf('  solutions:', start);
  if (pageConfig < 0 || start < 0 || end < 0) return '';
  return source.slice(start, end);
}

const failures = expectedPhrases
  .filter((phrase) => {
    const preservedInSharedPosHero = posSolutionHeroTitle.includes(phrase)
      && posSolutionSource.includes(`title: '${posSolutionHeroTitle}'`);
    const preservedInCombinedCopy = [...currentPhrases]
      .some((currentPhrase) => currentPhrase.includes(phrase));
    // Approved homepage change: promote the uppercase label to a title-case H2.
    const preservedCustomerHeading = phrase === 'OUR VALUED CUSTOMERS'
      && currentPhrases.has('Our Valued Customers');
    const preservedInHomeConfig = homeConfigSource.includes(phrase);
    const preservedConfiguredFeature = phrase.startsWith('- ')
      && homeConfigSource.includes(phrase.slice(2))
      && homeOrderFlowSource.includes('<span> - {{ feature.description }}</span>');
    const preservedIndustryStatus = phrase === 'Showing APPZPOS for {{ activeIndustry.label }}'
      && homeConfigSource.includes("industryStatusPrefix: 'Showing APPZPOS for'");
    return !approvedRemovedPhrases.has(phrase)
      && !currentPhrases.has(phrase)
      && !preservedInCombinedCopy
      && !preservedCustomerHeading
      && !preservedInHomeConfig
      && !preservedConfiguredFeature
      && !preservedIndustryStatus
      && !preservedInSharedPosHero;
  })
  .map((phrase) => `visible wording removed: ${phrase}`);

const homeSource = readFileSync(homePath, 'utf8');
const heroHash = createHash('sha256').update(extractHero(homeConfigSource)).digest('hex');
if (heroHash !== expectedHeroHash) failures.push('English homepage hero configuration changed');
if (!homeSource.includes('<app-home-page-template')) failures.push('English homepage no longer uses the shared template');

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
