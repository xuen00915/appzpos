import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const styles = readFileSync(new URL('../../src/styles/_appzpos-marketing-pages.scss', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('../../src/styles/_appzpos-design-system.scss', import.meta.url), 'utf8');

test('structural layout primitives are opt-in and complete', () => {
  for (const selector of [
    '.appz-page', '.appz-section', '.appz-split', '.appz-media-stage',
    '.appz-module-nav', '.appz-proof-rail', '.appz-conversion-panel'
  ]) assert.match(styles, new RegExp(selector.replace('.', '\\.')));

  for (const breakpoint of ['1279px', '1023px', '767px']) {
    assert.match(styles, new RegExp(`@media \\(max-width: ${breakpoint}\\)`));
  }
});

test('responsive design tokens expose content, reading and spacing constraints', () => {
  for (const token of [
    '--appz-font', '--appz-gutter', '--appz-section-space',
    '--appz-content-width', '--appz-reading-width'
  ]) assert.match(tokens, new RegExp(token));
});
