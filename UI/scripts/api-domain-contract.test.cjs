const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function load(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true }
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => {
    if (!(name in imports)) throw new Error('Unexpected import: ' + name);
    return imports[name];
  }});
  return exports;
}
const { environment } = load('src/environment.ts');
const { CommonFunctionService } = load('src/app/services/shared_function/common-function.service.ts', {
  '@angular/core': { Injectable: () => value => value },
  '../../../environment': { environment }
});
const service = new CommonFunctionService({objConfigData: {Configuration: {CompanyDetails: {Company_Ref_No: 'public-brand'}}}}, {});
test('configured enquiry endpoint remains on the separate backend', () => {
  assert.equal(environment.apiserverDomain, 'https://website-api.appzpos.com');
  assert.equal(service.BindURL_API('/api/WebSiteController/SendEmail'), 'https://website-api.appzpos.com/api/WebSiteController/SendEmail');
});
test('API and image URLs can use different domains without rewriting absolute API URLs', () => {
  const original = {...environment};
  try {
    environment.serverDomain = 'https://media.example.invalid';
    environment.apiserverDomain = 'https://api.example.invalid';
    assert.equal(service.BindURL_API('/api/example'), 'https://api.example.invalid/api/example');
    assert.equal(service.BindURL_Image('logo.png'), 'https://media.example.invalid/admin/Upload/public-brand/Images/logo.png');
    assert.equal(service.BindURL_API('https://other.example.invalid/api/example'), 'https://other.example.invalid/api/example');
  } finally { Object.assign(environment, original); }
});
