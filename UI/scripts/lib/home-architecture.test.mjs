import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const legacyTemplate = readFileSync(new URL('../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html', import.meta.url), 'utf8');
const template = readFileSync(new URL('../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component.html', import.meta.url), 'utf8');
const marketingStyles = readFileSync(new URL('../../src/styles/_appzpos-marketing-pages.scss', import.meta.url), 'utf8');

test('the shared hero leads into the approved homepage sequence without the product suite', () => {
  const selectors = [
    'app-home-order-flow',
    'app-home-ecosystem',
    'app-home-industries',
    'app-home-proof',
    'app-custom-request-demo'
  ];
  let previous = template.indexOf('<app-home-hero');
  for (const selector of selectors) {
    const current = template.indexOf(`<${selector}`, previous);
    assert.ok(current > previous, `${selector} must follow the previous homepage chapter`);
    previous = current;
  }
  assert.doesNotMatch(template, /<app-home-product-suite/);
});

test('the previous duplicated body is excluded from the rendered page', () => {
  assert.match(legacyTemplate, /class="appzpos-legacy-copy-bank" hidden aria-hidden="true"/);
  assert.doesNotMatch(legacyTemplate, /<section id="content">/);
});

test('legacy page rules cannot override the new homepage component themes', () => {
  assert.match(marketingStyles, /#content:not\(\.appz-home-story\)\s*\{/);
  assert.doesNotMatch(marketingStyles, /app-index #content\s*\{/);
});
