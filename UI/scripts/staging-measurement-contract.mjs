import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const source = readFileSync(resolve('src/app/services/shared_function/staging-measurement.ts'), 'utf8');

test('staging never reports to the Appzgate GA4 property', () => {
  assert.match(source, /APPZGATE_GA4_ID = 'G-JW8VE6FEP3'/);
  assert.match(source, /w\['ga-disable-' \+ APPZGATE_GA4_ID\] = true/);
  // The opt-out must be set before gtag/GTM start, inside the staging-only initializer.
  const init = source.slice(source.indexOf('export function initializeStagingMeasurement'));
  assert.ok(init.indexOf("ga-disable-") < init.indexOf("gtag('js'"));
  assert.ok(init.indexOf("if (!isMeasurementStaging()") < init.indexOf("ga-disable-"));
});

test('APPZPOS GA4 and Ads destinations are kept and Appzgate is never a send_to target', () => {
  assert.match(source, /send_to: 'G-681EVHYGDY'/);
  assert.match(source, /AW-791515048\//);
  assert.doesNotMatch(source, /send_to: ['"]G-JW8VE6FEP3/);
  assert.doesNotMatch(source, /disable.*G-681EVHYGDY/);
});
