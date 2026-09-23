import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { collectVisibleText } from './lib/visible-text.mjs';

const componentRoot = resolve('client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components');
const phrases = collectVisibleText(componentRoot, [
  'custom-white-header.component.html',
  'custom-footer.component.html'
]);

writeFileSync(resolve('scripts/site-visible-copy.json'), `${JSON.stringify(phrases, null, 2)}\n`);
console.log(`Wrote ${phrases.length} protected APPZPOS phrases.`);
