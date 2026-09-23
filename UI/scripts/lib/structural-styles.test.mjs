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

test('sitewide shell aliases retain one 1240px source of truth', () => {
  assert.match(tokens, /--appz-shell-width:\s*1240px/);
  assert.match(tokens, /--appz-page-gutter:\s*clamp\(16px,\s*3vw,\s*32px\)/);
  assert.match(tokens, /--appz-header-height:\s*76px/);
  assert.match(tokens, /--appz-container:\s*var\(--appz-shell-width\)/);
  assert.match(tokens, /--appz-content-width:\s*var\(--appz-shell-width\)/);
});

test('section typography is scoped to explicit title and description hooks', () => {
  assert.match(tokens, /--appz-section-title-size:\s*clamp\(1\.9rem,\s*2\.7vw,\s*3rem\)/);
  assert.match(tokens, /--appz-section-title-line:\s*1\.08/);
  assert.match(tokens, /--appz-section-description-line:\s*1\.65/);
  assert.doesNotMatch(tokens, /#content h2:not\(\.fs-6\)/);
  assert.match(tokens, /\[data-home-page-template\]\[lang="zh"\][\s\S]*letter-spacing:\s*\.055em/);
});
