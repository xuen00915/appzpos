import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { collectVisibleText, extractVisibleText } from './visible-text.mjs';

test('extractVisibleText returns unique normalized visible phrases', () => {
  const source = `
    <!-- hidden -->
    <section><h1> One POS. </h1><p>Every &amp; Order</p></section>
    <style>.ignored { color: red; }</style>
    <script>ignored()</script>
    <p>One POS.</p><span>{{ dynamicOnly }}</span>
  `;

  assert.deepEqual(extractVisibleText(source), ['One POS.', 'Every & Order']);
});

test('collectVisibleText scans nested component templates and supports exclusions', () => {
  const root = mkdtempSync(join(tmpdir(), 'appzpos-copy-'));
  const nested = join(root, 'nested');
  mkdirSync(nested);
  writeFileSync(join(root, 'first.component.html'), '<h1>Alpha</h1>');
  writeFileSync(join(nested, 'second.component.html'), '<p>Beta</p>');
  writeFileSync(join(nested, 'ignored.component.html'), '<p>Ignore me</p>');

  assert.deepEqual(collectVisibleText(root, ['ignored.component.html']), ['Alpha', 'Beta']);
});
