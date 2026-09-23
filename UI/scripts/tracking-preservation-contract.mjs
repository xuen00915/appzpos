import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const root = resolve('client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components');
const read = (path) => readFileSync(path, 'utf8');
const environment = read(resolve('src/environment.ts'));
const template = read(resolve(root, 'home-page-template/home-page-template.component.html'));
const hero = read(resolve(root, 'home-hero/home-hero.component.html'));
const english = read(resolve(root, 'index/home-page-content.en.ts'));
const chinese = read(resolve(root, 'cn-f&b-restaurant-cloud-pos-system/home-page-content.zh.ts'));
const form = read(resolve(root, 'custom-request-demo/custom-request-demo.component.html'));
const whatsapp = "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";
const messenger = "http://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!";

test('original analytics and conversion hooks remain present', () => {
  assert.match(environment, /GTM-N7VKTGG/);
  assert.match(environment, /892134809204935/);
  assert.match(template, /class\.btn-whatsapp/);
  assert.match(template, /class\.btn-fb/);
  assert.match(hero, /data-track-cta/);
  assert.match(english, /sectionId:\s*'requestdemo'/);
  assert.match(chinese, /sectionId:\s*'requestdemo'/);
  assert.ok(english.includes(whatsapp));
  assert.ok(chinese.includes(whatsapp));
  assert.ok(chinese.includes(messenger));
  for (const name of ['name', 'email', 'mobilenum', 'restaurant_name']) {
    assert.match(form, new RegExp(`formControlName="${name}"`));
    assert.match(form, new RegExp(`name="${name}"`));
  }
});
