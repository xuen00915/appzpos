import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentRoot = resolve('client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components');

const baselines = {
  'blogs/blog-bcrs/blog-bcrs.component.html': '2e925b83f2df2fe31164cf3cbb1132dc07f2a312ae07cc30c3c1acb4db1a6595',
  'blogs/blog-main-page/blog-main-page.component.html': '84e8db891f25de8cd5d831576e54d0fd1ba6e0c7e3618128e959a6afa6272e60',
  'cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component.html': '54ac033c98cebe6f9075ff98dce8330b5e2604df473b5a60516f14f4f48a902e',
  'cn-custom-request-demo/cn-custom-request-demo.component.html': '66ce711a79ddc1808df89c0bb490b48477f75b2d392913cf54a26ea34b2620e9',
  'cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component.html': 'dc4ec0dc2707da4a41a56c592ba6b8a774166d594cdca380be217b6b8c0876e0',
  'cn-modal-request-demo/cn-modal-request-demo.component.html': 'b441152b4547ed32d07f535a49c2ba03bfc5fb025b6a8f0f9d35dba01daaa280',
  'custom-request-demo/custom-request-demo.component.html': '241a2b64430780058ac7c209b2393b0f7816822d9a213f52a644d51be568071f',
  'custom-solutions/custom-solutions.component.html': 'd99c20bc1061751d037b1984aa458f89ad6d4115e51ad77744e1cb94f0645867',
  'f&b-restaurant-cloud-pos-system/f&b-restaurant-cloud-pos-system.component.html': '77794ac65e74c52b207bd39a7a03533771d125920b9e64eb669885af3ee3e9aa',
  'f&b-restaurant-delivery-integration/f&b-restaurant-delivery-integration.component.html': '5879ca7a5de9bf49ed4b5a1a42923498f07d024631f8db14eb6062be3e1fcd5c',
  'f&b-restaurant-emenu-qr-code-ordering-system/f&b-restaurant-emenu-qr-code-ordering-system.component.html': '6ac840aa80af8f31744f4bf5ce7968df5ca5a7a9b96dfddc8e14830702709f06',
  'f&b-restaurant-kitchen-display-system/f&b-restaurant-kitchen-display-system.component.html': 'a429a1efd303ea9fb061db0f11b52e49f7e4c7405e65fa07b0f4d205d5cc6b58',
  'f&b-restaurant-online-ordering-website/f&b-restaurant-online-ordering-website.component.html': '6372db96f6e4782adbbdfc649df51a18803b1a718a6bc617d00653ab501ce7ce',
  'f&b-restaurant-queue-number-display-system/f&b-restaurant-queue-number-display-system.component.html': '74dfae571e96e45bba782590271d679d6db91344a93d31a4aa7deda38ee7eca4',
  'home-order-flow/home-order-flow.component.html': '44ee8c1a8bcebbfaad8ff908bbf61f3ed1aa6021a3a967dcfdba4a9a7c21b217',
  'index/index.component.html': '092267b09777cd630066fd0a537f31d9421682914c532b59b53d5b37cc9c1597',
  'modal-request-demo/modal-request-demo.component.html': 'dcfc9bbc2a5e80ab9ac7890dc68c3e40e04d4306c77bc2122d05b59519c95af0',
  'point-of-sales-demo-quotation/point-of-sales-demo-quotation.component.html': 'ba71134035f41134844d5e8fe4590b1c626c44cf31513831832114cbbba3ab33',
  'pos-features-crm-payment-gateway/pos-features-crm-payment-gateway.component.html': '3a6edc5ab7ea92a70d9798a1380a48801f260560c1d7755303a666a5b4732e35',
  'pos-hardware-machine-receipt-printer/pos-hardware-machine-receipt-printer.component.html': '8d25a81823e2ba7b98cbd2ba3b92fe5abf8aea8e7126d103eaf924dbbd7b839f',
  'pos-solutions-partner-integrations/pos-solutions-partner-integrations.component.html': '16300a2480f170907509e457e52696d16effd2426b84aed23d41c3227325b4e4',
  'psg-pos-system-grant-singapore/psg-pos-system-grant-singapore.component.html': '2261693e66f4fab5a67eff616dc7082183f78f331f3d94bc8271108e3268b681',
  'retail-store-cloud-pos-system/retail-store-cloud-pos-system.component.html': '9e2f9cbd8fb4781c3328bbc3505372fc5fbbb2ff0dbd0d246eceb9c77a911b53',
  'salon-cloud-pos-system/salon-cloud-pos-system.component.html': '45123ddb3c72a0db1e952f4085fd74048c21c544f343a5c593cce5eb6030d9e3',
  'self-order-kiosk-restaurant/self-order-kiosk-restaurant.component.html': 'f55c57ac50a6f25621a351f7d442449b478410a19a8845a2753d4aed88a154c9'
};

function uniqueVisibleText(source) {
  return [...new Set(source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .split(/\n+/)
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter((value) => value && !/^\{\{.*\}\}$/.test(value)))]
    .sort()
    .join('\n');
}

const failures = [];
for (const [relativePath, expectedHash] of Object.entries(baselines)) {
  const source = readFileSync(resolve(componentRoot, relativePath), 'utf8');
  const actualHash = createHash('sha256').update(uniqueVisibleText(source)).digest('hex');
  if (actualHash !== expectedHash) failures.push(`${relativePath}: visible wording changed`);
}

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

console.log(`APPZPOS content contract passed for ${Object.keys(baselines).length} templates and 19 public routes.`);
