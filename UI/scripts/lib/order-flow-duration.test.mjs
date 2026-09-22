import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const styles = readFileSync(new URL('../../src/styles/_appzpos-order-flow.scss', import.meta.url), 'utf8');

test('the ecosystem is a responsive scene rather than a pinned scroll journey', () => {
  assert.match(styles, /aspect-ratio:\s*6\s*\/\s*5/);
  assert.match(styles, /@keyframes\s+appz-float-admin/);
  assert.match(styles, /@keyframes\s+appz-delivery-travel/);
  assert.match(styles, /@media \(max-width: 767px\)[\s\S]*?display:\s*grid/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /position:\s*sticky/);
  assert.doesNotMatch(styles, /min-height:\s*(?:300|330|360)vh/);
});
