import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const styles = readFileSync(new URL('../../src/styles/_appzpos-order-flow.scss', import.meta.url), 'utf8');

test('the pinned order journey uses a compact desktop, tablet and mobile distance', () => {
  assert.match(styles, /&__scroll\s*\{[\s\S]*?min-height:\s*360vh/);
  assert.match(styles, /@media \(max-width: 1023px\)[\s\S]*?&__scroll\s*\{[\s\S]*?min-height:\s*330vh/);
  assert.match(styles, /@media \(max-width: 767px\)[\s\S]*?&__scroll\s*\{[\s\S]*?min-height:\s*300vh/);
});
