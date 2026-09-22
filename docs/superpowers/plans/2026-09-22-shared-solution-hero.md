# Shared Solution Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a reusable light solution-page hero and pilot it only on the POS/E-Waiter page with the supplied counter-and-waiter illustration.

**Architecture:** Add a focused Angular SolutionHeroComponent with one typed immutable input and component-scoped responsive styles. The existing POS/E-Waiter route becomes the sole pilot through a readonly configuration object; its body content remains unchanged, and every other solution page continues using its current inline hero.

**Tech Stack:** Angular 17, TypeScript, component-scoped CSS, Jasmine/Karma, Chrome DevTools Protocol regression script, WebP assets.

**Spec:** docs/superpowers/specs/2026-09-22-shared-solution-hero-design.md

## Global Constraints

- Pilot only on /cloud-pos-point-of-sales-system.
- Use the approved supplied POS/E-Waiter illustration.
- Preserve exactly: APPZPOS Cutting-Edge POS Point of Sales and E-Menu System.
- Keep every POS/E-Waiter element below the hero unchanged.
- Keep all other solution-page heroes unchanged.
- Preserve route, SEO metadata, CTA links, request-demo behavior, floating contact widgets, and all visible wording.
- Preserve GTM GTM-N7VKTGG, Meta Pixel 892134809204935, and connect.facebook.net.
- Use local assets, explicit image dimensions, and no new runtime dependency.
- Do not publish, deploy, or stage the pre-existing UI/package-lock.json change.

## Review Focus

- The long title must render as literal text in exactly one H1, never as HTML.
- Intrinsic image dimensions must be present to avoid layout shift.
- Desktop/tablet must place image left of title; mobile must place it above with no horizontal overflow.
- Reduced-motion users must receive a static hero.
- The pilot must not change body copy, SEO metadata, routes, GTM, or Meta Pixel.

---

## File Structure

**Create**

- UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component.ts — input contract and component.
- UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component.html — semantic markup.
- UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component.css — responsive light hero.
- UI/src/app/components/index/app/solution-hero.component.spec.ts — executable component contract.
- UI/src/assets/images/ecosystem/ecosystem-pos-ewaiter.webp — optimized approved artwork.

**Modify**

- UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts
- UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component.ts
- UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component.html
- UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component.spec.ts
- UI/src/app/components/index/app/solution-island-heroes.spec.ts
- UI/scripts/order-flow-regression.mjs

---

### Task 1: Build the Reusable Hero Contract

**Interfaces**

- Produces SolutionHeroConfig.
- Produces SolutionHeroComponent with selector app-solution-hero.
- Consumes one required config input.

- [ ] **Step 1: Write the failing shared-component test**

Create UI/src/app/components/index/app/solution-hero.component.spec.ts:

~~~ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  SolutionHeroComponent,
  SolutionHeroConfig
} from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component';

describe('SolutionHeroComponent', () => {
  let fixture: ComponentFixture<SolutionHeroComponent>;

  const config: SolutionHeroConfig = {
    headingId: 'test-solution-title',
    title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
    imageSrc: 'assets/images/ecosystem/test-solution.webp',
    imageAlt: 'Waiter serving a table beside an APPZPOS counter POS',
    imageWidth: 727,
    imageHeight: 478
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [SolutionHeroComponent] });
    fixture = TestBed.createComponent(SolutionHeroComponent);
    fixture.componentInstance.config = config;
    fixture.detectChanges();
  });

  it('renders one accessible H1 and configured intrinsic image data', () => {
    const host = fixture.nativeElement as HTMLElement;
    const section = host.querySelector<HTMLElement>('[data-solution-hero]');
    const title = section?.querySelector<HTMLHeadingElement>('h1');
    const image = section?.querySelector<HTMLImageElement>('img');

    expect(section?.getAttribute('aria-labelledby')).toBe(config.headingId);
    expect(title?.id).toBe(config.headingId);
    expect(title?.textContent?.trim()).toBe(config.title);
    expect(title?.innerHTML).toBe(config.title);
    expect(host.querySelectorAll('h1').length).toBe(1);
    expect(image?.getAttribute('src')).toBe(config.imageSrc);
    expect(image?.alt).toBe(config.imageAlt);
    expect(image?.width).toBe(727);
    expect(image?.height).toBe(478);
  });

  it('keeps image before title in mobile reading order', () => {
    const host = fixture.nativeElement as HTMLElement;
    const image = host.querySelector('img') as Node;
    const title = host.querySelector('h1') as Node;
    expect(image.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
~~~

- [ ] **Step 2: Run the test and verify RED**

From UI:

~~~bash
export PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH"
npm test -- --watch=false --browsers=ChromeHeadless --include src/app/components/index/app/solution-hero.component.spec.ts
~~~

Expected: compilation fails because solution-hero.component does not exist.

- [ ] **Step 3: Implement the typed component**

Create solution-hero.component.ts:

~~~ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface SolutionHeroConfig {
  readonly headingId: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
}

@Component({
  selector: 'app-solution-hero',
  templateUrl: './solution-hero.component.html',
  styleUrls: ['./solution-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolutionHeroComponent {
  @Input({ required: true }) config!: SolutionHeroConfig;
}
~~~

Create solution-hero.component.html:

~~~html
<section class="appz-solution-hero" data-solution-hero [attr.aria-labelledby]="config.headingId">
  <div class="appz-solution-hero__inner">
    <div class="appz-solution-hero__visual">
      <img
        [src]="config.imageSrc"
        [alt]="config.imageAlt"
        [width]="config.imageWidth"
        [height]="config.imageHeight"
        loading="eager"
        fetchpriority="high">
    </div>
    <div class="appz-solution-hero__copy">
      <h1 [id]="config.headingId">{{ config.title }}</h1>
    </div>
  </div>
</section>
~~~

Create solution-hero.component.css:

~~~css
:host { display: block; }

.appz-solution-hero {
  position: relative;
  min-height: clamp(420px, 46vw, 610px);
  overflow: hidden;
  border-bottom: 1px solid #d8e7f2;
  background:
    radial-gradient(circle at 20% 45%, rgba(127, 203, 255, .2), transparent 34%),
    linear-gradient(135deg, #f8fcff 0%, #eef8ff 54%, #fff 100%);
}

.appz-solution-hero::before {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(10, 134, 232, .035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 134, 232, .035) 1px, transparent 1px);
  background-size: 46px 46px;
  content: '';
  mask-image: linear-gradient(90deg, #000, transparent 58%);
  pointer-events: none;
}

.appz-solution-hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
  width: min(calc(100% - 48px), 1400px);
  min-height: inherit;
  gap: clamp(34px, 6vw, 96px);
  align-items: center;
  margin-inline: auto;
  padding-block: clamp(48px, 6vw, 82px);
}

.appz-solution-hero__visual { display: grid; min-width: 0; place-items: center; }

.appz-solution-hero__visual img {
  display: block;
  width: min(100%, 590px);
  height: auto;
  border-radius: 18px;
  filter: drop-shadow(0 28px 28px rgba(48, 105, 153, .16));
  transform: translate3d(0, 0, 0);
  animation: appz-solution-float 7.5s ease-in-out infinite alternate;
}

.appz-solution-hero__copy { position: relative; padding-top: 24px; }

.appz-solution-hero__copy::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 74px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #0a86e8, #ff6b22);
  content: '';
}

h1 {
  max-width: 17ch;
  margin: 0;
  color: #101d39;
  font-size: clamp(2.15rem, 4vw, 3.85rem);
  font-weight: 760;
  letter-spacing: -.055em;
  line-height: 1.04;
  text-wrap: balance;
}

@keyframes appz-solution-float { to { transform: translate3d(0, -7px, 0); } }

@media (max-width: 1023px) {
  .appz-solution-hero { min-height: 430px; }
  .appz-solution-hero__inner {
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: clamp(24px, 4vw, 48px);
    padding-block: 44px;
  }
  h1 { font-size: clamp(2rem, 4.7vw, 3.15rem); }
}

@media (max-width: 767px) {
  .appz-solution-hero { min-height: 0; }
  .appz-solution-hero__inner {
    grid-template-columns: 1fr;
    width: min(calc(100% - 32px), 1400px);
    gap: 16px;
    padding-block: 30px 42px;
  }
  .appz-solution-hero__visual img { width: min(100%, 440px); }
  .appz-solution-hero__copy { padding-top: 20px; text-align: center; }
  .appz-solution-hero__copy::before {
    left: 50%;
    width: 60px;
    transform: translateX(-50%);
  }
  h1 {
    max-width: 20ch;
    margin-inline: auto;
    font-size: clamp(1.9rem, 8.2vw, 2.55rem);
    line-height: 1.08;
  }
}

@media (prefers-reduced-motion: reduce) {
  .appz-solution-hero__visual img { animation: none; }
}
~~~

Import and add SolutionHeroComponent once to declarations in custom-app.module.ts.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command again. Expected: TOTAL: 2 SUCCESS and exit code 0.

- [ ] **Step 5: Commit**

~~~bash
git add UI/src/app/components/index/app/solution-hero.component.spec.ts \
  UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero \
  UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts
git commit -m "feat: add shared solution hero component"
~~~

---

### Task 2: Pilot the Hero on POS/E-Waiter

**Interfaces**

- Consumes SolutionHeroConfig and app-solution-hero from Task 1.
- Produces readonly solutionHero on CustomPOSEWaiterComponent.

- [ ] **Step 1: Change the integration tests first**

In solution-island-heroes.spec.ts:

~~~ts
import { SolutionHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/solution-hero/solution-hero.component';

// Change only the POS case:
image: 'assets/images/ecosystem/ecosystem-pos-ewaiter.webp'

// Compile the real shared component:
declarations: [...cases.map((item) => item.component), SolutionHeroComponent]

// Support the pilot plus unchanged pages:
const hero = host.querySelector<HTMLElement>('[data-solution-hero], .solution-island-hero');

if (item.component === CustomPOSEWaiterComponent) {
  expect(host.querySelector('app-solution-hero')).not.toBeNull();
  expect(host.querySelectorAll('[data-solution-hero]').length).toBe(1);
}
~~~

Update the colocated POS spec to declare SolutionHeroComponent and expect ecosystem-pos-ewaiter.webp.

- [ ] **Step 2: Run integration tests and verify RED**

~~~bash
npm test -- --watch=false --browsers=ChromeHeadless \
  --include src/app/components/index/app/solution-hero.component.spec.ts \
  --include src/app/components/index/app/solution-island-heroes.spec.ts
~~~

Expected: the component contract passes, but POS fails because it still uses the inline hero and old image.

- [ ] **Step 3: Optimize the approved supplied image**

~~~bash
sips -g pixelWidth -g pixelHeight \
  /var/folders/3j/l2g64jz13m5d_lxsc20j7myc0000gn/T/codex-clipboard-5Awqbs.png
cwebp -quiet -q 90 \
  /var/folders/3j/l2g64jz13m5d_lxsc20j7myc0000gn/T/codex-clipboard-5Awqbs.png \
  -o src/assets/images/ecosystem/ecosystem-pos-ewaiter.webp
~~~

Expected: 727 × 478 WebP. If the attachment is missing, stop and ask for reattachment; do not substitute artwork.

- [ ] **Step 4: Add the POS config and replace only the hero**

In cloud-pos-point-of-sales-system.component.ts:

~~~ts
import { SolutionHeroConfig } from '../solution-hero/solution-hero.component';

readonly solutionHero: SolutionHeroConfig = {
  headingId: 'pos-solution-title',
  title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
  imageSrc: 'assets/images/ecosystem/ecosystem-pos-ewaiter.webp',
  imageAlt: 'APPZPOS waiter taking a table order beside a staffed counter POS system',
  imageWidth: 727,
  imageHeight: 478
};
~~~

Replace only the current hero block in cloud-pos-point-of-sales-system.component.html:

~~~html
<app-solution-hero [config]="solutionHero"></app-solution-hero>
~~~

Do not alter section#content or anything after it.

- [ ] **Step 5: Run tests and preservation checks**

Run the Step 2 test command again, then:

~~~bash
npm run test:site-content
git diff --word-diff=porcelain HEAD -- \
  client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cloud-pos-point-of-sales-system/cloud-pos-point-of-sales-system.component.html
~~~

Expected: tests and content contract pass; the HTML diff contains only the hero replacement.

- [ ] **Step 6: Commit**

~~~bash
git add UI/src/assets/images/ecosystem/ecosystem-pos-ewaiter.webp \
  UI/src/app/components/index/app/solution-island-heroes.spec.ts \
  UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cloud-pos-point-of-sales-system
git commit -m "feat: pilot shared hero on POS solution"
~~~

---

### Task 3: Validate Responsive Behavior and Tracking

**Interfaces**

- Consumes the POS route, data-solution-hero, and the local WebP.
- Produces browser regression coverage only.

- [ ] **Step 1: Update the browser regression before running it**

Change the POS case in scripts/order-flow-regression.mjs:

~~~js
{
  route: '/cloud-pos-point-of-sales-system',
  image: 'assets/images/ecosystem/ecosystem-pos-ewaiter.webp',
  title: 'APPZPOS Cutting-Edge POS Point of Sales and E-Menu System',
  key: 'pos',
  selector: '[data-solution-hero]'
}
~~~

Give unchanged cases selector: '.solution-island-hero'. Query heroCase.selector and add these POS assertions:

~~~js
sharedHero: Boolean(document.querySelector('app-solution-hero [data-solution-hero]')),
legacyHero: Boolean(document.querySelector('app-cloud-pos-point-of-sales-system > .solution-island-hero'))
~~~

Require sharedHero true and legacyHero false for POS.

- [ ] **Step 2: Add reduced-motion and screenshot checks**

Emulate prefers-reduced-motion: reduce on the POS route and require:

~~~js
const image = document.querySelector('[data-solution-hero] img');
const animationName = image ? getComputedStyle(image).animationName : null;
if (animationName !== 'none') failures.push('POS shared hero animation remains active');
~~~

When APPZPOS_SCREENSHOT_DIR is provided, capture POS screenshots at 1440 and 430 as solution-pos-1440.png and solution-pos-430.png.

- [ ] **Step 3: Run the complete verification**

~~~bash
export PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH"
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
npm run test:site-content
appz_shot_dir=$(mktemp -d -t appzpos-shared-hero-XXXXXX)
APPZPOS_CDP_PORT=9225 \
APPZPOS_PREVIEW_URL=http://127.0.0.1:4311/ \
APPZPOS_SCREENSHOT_DIR="$appz_shot_dir" \
node scripts/order-flow-regression.mjs
printf '%s\n' "$appz_shot_dir"
~~~

Expected: all Angular tests succeed; build exits 0 with only known legacy warnings; content contract preserves 956 phrases, locked homepage hero, and 19 routes; browser regression passes at 1440, 1280, 1024, 768, 430, and 390; screenshots show correct desktop/mobile order; reduced-motion animation is none.

- [ ] **Step 4: Verify analytics, built asset, preview, and diffs**

~~~bash
for marker in GTM-N7VKTGG 892134809204935 connect.facebook.net; do
  grep -RaoF "$marker" dist/e-commerce/main.*.js | head -1
done
test -f dist/e-commerce/assets/images/ecosystem/ecosystem-pos-ewaiter.webp
git diff --check -- ':!UI/package-lock.json'
curl -sS -o /dev/null -w '%{http_code}\n' \
  http://127.0.0.1:4311/cloud-pos-point-of-sales-system
~~~

Expected: all markers print, asset exists, diff check is silent, and preview returns 200.

- [ ] **Step 5: Commit regression coverage**

~~~bash
git add UI/scripts/order-flow-regression.mjs
git commit -m "test: cover shared POS solution hero"
~~~

Do not push, publish, deploy, or stage UI/package-lock.json.

