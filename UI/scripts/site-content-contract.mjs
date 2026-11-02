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
// The November banner redesign replaces long headings/eyebrows with these
// product titles. They are supplied through Angular inputs, not text nodes.
const bannerSource = [
  'cloud-pos-point-of-sales-system', 'f&b-restaurant-online-ordering-website',
  'f&b-restaurant-emenu-qr-code-ordering-system', 'self-order-kiosk-restaurant',
  'f&b-restaurant-kitchen-display-system', 'f&b-restaurant-queue-number-display-system',
  'f&b-restaurant-delivery-integration', 'pos-hardware-machine-receipt-printer',
  'pos-features-crm-payment-gateway'
].map(name => readFileSync(resolve(componentRoot, name, `${name}.component.html`), 'utf8')).join('\n');
const bannerReplacements = new Map([
  ['APPZPOS Kitchen Order Display System', 'Kitchen Display System'],
  ['APPZPOS Online Website Ordering System', 'Online Ordering Website'],
  ['APPZPOS POS Features', 'Connected POS Features'],
  ['APPZPOS Self Ordering System', 'Self-Ordering Kiosks'],
  ['APPZPOS Table QR Code Ordering System', 'Table QR Ordering'],
  ['BUILT FOR YOUR BUSINESS', 'Connected POS Features'],
  ['BUILT FOR YOUR COUNTER', 'Point of Sale Hardware'],
  ['Centralized Delivery Platform Integration Through APPZPOS Order Hub', 'Delivery Order Hub'],
  ['Discover our sleek, durable, and stylish POS hardware. A sustainably built system designed for every business.', 'Point of Sale Hardware'],
  ['Point of Sale Hardware', 'Point of Sale Hardware'],
  ['Restaurant Queue Management System', 'Queue Number Display'],
  ['Secure payment integration, CRM, smart inventory, delivery integration, sales analytics, and more features.', 'Connected POS Features'],
  ['for Quick Service Restaurants', 'Self-Ordering Kiosks'],
  ['with APPZPOS Queue Number Display', 'Queue Number Display']
]);
// Approved homepage hero changes: remove the eyebrow label and CTA arrows, and use EDGE Grant wording.
const expectedHeroHash = '31231ae34c41398747d944392d86151824c788d51b7982af8dfec974663c8e82';
const approvedRemovedPhrases = new Set([
  // Approved CTA cleanup: decorative arrows are not button wording.
  '→',
  'SINGAPORE CLOUD POS',
  '50%',
  'PRODUCTIVITY SOLUTIONS GRANT',
  'UP TO',
  // Approved Chinese card cleanup: remove the decorative trailing dash.
  '云端POS系统 -',
  '实时报告分析 -',
  '第三方整合 -',
  '多店运营 -',
  // The old desktop/mobile banners split this heading around a <br> tag.
  // The shared solution hero keeps the exact wording as one responsive H1.
  'Centralized Delivery Platform Integration',
  'Through APPZPOS Order Hub'
]);

function extractHero(source, configName = 'ENGLISH_HOME_PAGE_CONFIG') {
  const pageConfig = source.indexOf(`export const ${configName}`);
  const start = source.indexOf('  hero: {', pageConfig);
  const end = source.indexOf('  solutions:', start);
  if (pageConfig < 0 || start < 0 || end < 0) return '';
  return source.slice(start, end);
}

const chineseHeroTitle = [...extractHero(homeConfigSource, 'CHINESE_HOME_PAGE_CONFIG')
  .matchAll(/\btitle(?:Accent)?:\s*'([^']+)'/g)]
  .map((match) => match[1])
  .join(' ')
  .replace(/\s+/g, '');

const failures = expectedPhrases
  .filter((phrase) => {
    const replacement = bannerReplacements.get(phrase);
    const preservedInRedesignedBanner = replacement && bannerSource.includes(`title="${replacement}"`);
    const preservedInSharedPosHero = posSolutionHeroTitle.includes(phrase)
      && posSolutionSource.includes(`title: '${posSolutionHeroTitle}'`);
    const preservedInCombinedCopy = [...currentPhrases]
      .some((currentPhrase) => currentPhrase.includes(phrase));
    // Approved homepage change: promote the uppercase label to a title-case H2.
    const preservedCustomerHeading = phrase === 'OUR VALUED CUSTOMERS'
      && currentPhrases.has('Our Valued Customers');
    const preservedInHomeConfig = homeConfigSource.includes(phrase);
    const preservedInSplitChineseHero = chineseHeroTitle.includes(phrase.replace(/\s+/g, ''));
    const preservedConfiguredFeature = phrase.startsWith('- ')
      && homeConfigSource.includes(phrase.slice(2))
      && homeOrderFlowSource.includes('<span> - {{ feature.description }}</span>');
    const preservedIndustryStatus = phrase === 'Showing APPZPOS for {{ activeIndustry.label }}'
      && homeConfigSource.includes("industryStatusPrefix: 'Showing APPZPOS for'");
    return !approvedRemovedPhrases.has(phrase)
      && !preservedInRedesignedBanner
      && !currentPhrases.has(phrase)
      && !preservedInCombinedCopy
      && !preservedCustomerHeading
      && !preservedInHomeConfig
      && !preservedInSplitChineseHero
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
