# APPZPOS Homepage Order Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive, scroll-controlled converging order-flow section immediately below the APPZPOS homepage hero, with an accessible static fallback for reduced-motion users.

**Architecture:** Keep the feature isolated in a dedicated Angular component. Put immutable copy, coordinates, and pure progress calculations in a model file that can be tested without the DOM. Let the component measure its wrapper only while visible, render SVG positions imperatively, and update Angular state only when the active caption changes.

**Tech Stack:** Angular 17, TypeScript, inline SVG, SCSS, IntersectionObserver, ResizeObserver, requestAnimationFrame, Jasmine/Karma, Chrome DevTools Protocol regression script.

**Spec:** `docs/superpowers/specs/2026-09-21-appzpos-order-flow-design.md`

## Global Constraints

- Insert the component immediately after `.appzpos-product-hero` and before the existing `#content` section.
- Preserve the current hero, routes, links, tracking, WhatsApp and Messenger widgets, and all existing homepage sections.
- Use `viewBox="0 0 1000 460"` with the exact coordinates from the specification.
- Use the seven supplied titles and every supplied bullet exactly. Do not rephrase visible product copy.
- Use no new animation dependency.
- Drive animation from scroll position, not elapsed time.
- Use no global `scroll` event listener.
- Avoid horizontal page overflow at `1440`, `1280`, `1024`, `768`, `430`, and `390` widths.
- Under `prefers-reduced-motion: reduce`, render the complete static seven-step list with no sticky wrapper or animation-frame loop.
- Do not push changes to a remote repository.

## Review Focus

- Progress values below `0`, above `1`, and exactly on every breakpoint must resolve to a valid scene and caption.
- A section shorter than its sticky stage must not divide by zero or return `NaN` progress.
- Header height changes between desktop, sticky, and mobile states must not cover the pinned scene.
- Leaving and re-entering the section must not create duplicate animation-frame loops or observers.
- Missing observer APIs or reduced-motion preference must produce the complete static list instead of a blank or partially pinned scene.

---

## File Structure

**Create:**

- `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.model.ts` - types, exact content, coordinates, breakpoints, and pure scene calculations.
- `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.ts` - observer lifecycle, progress measurement, DOM rendering, and active caption state.
- `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.html` - animated SVG, indicators, caption panel, and static fallback.
- `UI/src/styles/_appzpos-order-flow.scss` - isolated responsive styling and reduced-motion safeguards.
- `UI/src/app/components/index/app/home-order-flow.model.spec.ts` - pure calculation and exact-copy tests.
- `UI/src/app/components/index/app/home-order-flow.component.spec.ts` - rendering, reduced-motion, and lifecycle tests.
- `UI/scripts/order-flow-regression.mjs` - responsive browser and geometry regression checks.

**Modify:**

- `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts` - declare `HomeOrderFlowComponent`.
- `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html` - render `<app-home-order-flow>` after the hero.
- `UI/src/custom-theme.scss` - import the order-flow stylesheet.

---

### Task 1: Pure Order-Flow Model and Progress Geometry

**Files:**

- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.model.ts`
- Create: `UI/src/app/components/index/app/home-order-flow.model.spec.ts`

**Interfaces:**

- Produces: `FlowPoint`, `OrderFlowStep`, `OrderFlowSceneState`, `ORDER_FLOW_STEPS`, `ORDER_FLOW_POINTS`, `ORDER_FLOW_BREAKPOINTS`, `getActiveOrderFlowStepIndex(progress)`, and `createOrderFlowSceneState(progress)`.
- Consumes: no application state or DOM APIs.

- [ ] **Step 1: Write failing model tests**

Create `home-order-flow.model.spec.ts` with literal expectations:

```ts
import {
  ORDER_FLOW_BREAKPOINTS,
  ORDER_FLOW_POINTS,
  ORDER_FLOW_STEPS,
  createOrderFlowSceneState,
  getActiveOrderFlowStepIndex
} from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.model';

describe('APPZPOS order-flow model', () => {
  it('preserves all seven real product steps in their required order', () => {
    expect(ORDER_FLOW_STEPS.map((step) => step.title)).toEqual([
      'Table QR Ordering',
      'Self Ordering Kiosk',
      'Website Ordering',
      'POS / E-Waiter',
      'Queue Number Display',
      'Kitchen Display System (KDS)',
      'Order Hub'
    ]);
    expect(ORDER_FLOW_STEPS.map((step) => step.bullets.length)).toEqual([3, 3, 3, 4, 2, 3, 3]);
    expect(ORDER_FLOW_STEPS[0].bullets[0]).toBe(
      'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones'
    );
    expect(ORDER_FLOW_STEPS[6].bullets[0]).toBe(
      'Centralized Order Management - Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform'
    );
  });

  it('uses the required breakpoints and node coordinates', () => {
    expect(ORDER_FLOW_BREAKPOINTS).toEqual([0, .10, .20, .30, .40, .55, .75, 1]);
    expect(ORDER_FLOW_POINTS).toEqual({
      tableQr: { x: 30, y: 50 },
      kiosk: { x: 30, y: 160 },
      website: { x: 30, y: 270 },
      pos: { x: 30, y: 380 },
      queue: { x: 420, y: 215 },
      kds: { x: 620, y: 215 },
      orderHub: { x: 860, y: 215 },
      delivery: { x: 680, y: 40 }
    });
  });

  it('selects valid steps at clamped values and exact boundaries', () => {
    expect([-1, 0, .099, .10, .20, .30, .40, .55, .75, 1, 2]
      .map(getActiveOrderFlowStepIndex)).toEqual([0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 6]);
  });

  it('moves all entry figures to Queue by progress 0.40', () => {
    const start = createOrderFlowSceneState(0);
    const middle = createOrderFlowSceneState(.20);
    const arrival = createOrderFlowSceneState(.40);

    expect(start.entryFigures[0]).toEqual({ x: 30, y: 50 });
    expect(middle.entryFigures[0]).toEqual({ x: 225, y: 132.5 });
    expect(arrival.entryFiguresVisible).toBeFalse();
    expect(arrival.entryRouteCompletion).toBe(1);
    expect(arrival.mergedFigure).toEqual({ x: 420, y: 215 });
  });

  it('moves Queue to KDS and both final figures to Order Hub', () => {
    expect(createOrderFlowSceneState(.65).mergedFigure).toEqual({ x: 520, y: 215 });

    const finish = createOrderFlowSceneState(1);
    expect(finish.mergedFigure).toEqual({ x: 860, y: 215 });
    expect(finish.deliveryFigure).toEqual({ x: 860, y: 215 });
    expect(finish.kdsRouteCompletion).toBe(1);
    expect(finish.orderHubRouteCompletion).toBe(1);
    expect(finish.deliveryRouteCompletion).toBe(1);
  });

  it('never returns NaN for non-finite progress', () => {
    for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      const state = createOrderFlowSceneState(value);
      expect(Number.isFinite(state.mergedFigure.x)).toBeTrue();
      expect(Number.isFinite(state.mergedFigure.y)).toBeTrue();
    }
  });
});
```

- [ ] **Step 2: Run the model test and verify RED**

Run:

```bash
cd UI
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include=src/app/components/index/app/home-order-flow.model.spec.ts
```

Expected: compilation fails because `home-order-flow.model.ts` does not exist.

- [ ] **Step 3: Implement the exact content and pure geometry**

Create `home-order-flow.model.ts`. Define all seven bullet arrays exactly as written in the design specification. Implement calculations with this structure:

```ts
export interface FlowPoint { x: number; y: number; }

export interface OrderFlowStep {
  id: string;
  shortLabel: string;
  title: string;
  bullets: readonly string[];
  point: FlowPoint;
}

export interface OrderFlowSceneState {
  entryFigures: FlowPoint[];
  entryFiguresVisible: boolean;
  mergedFigure: FlowPoint;
  mergedFigureVisible: boolean;
  deliveryFigure: FlowPoint;
  deliveryFigureVisible: boolean;
  entryRouteCompletion: number;
  kdsRouteCompletion: number;
  orderHubRouteCompletion: number;
  deliveryRouteCompletion: number;
  walkCycle: number;
  mergeSettle: number;
}

export const ORDER_FLOW_BREAKPOINTS = [0, .10, .20, .30, .40, .55, .75, 1] as const;

export const ORDER_FLOW_POINTS = {
  tableQr: { x: 30, y: 50 },
  kiosk: { x: 30, y: 160 },
  website: { x: 30, y: 270 },
  pos: { x: 30, y: 380 },
  queue: { x: 420, y: 215 },
  kds: { x: 620, y: 215 },
  orderHub: { x: 860, y: 215 },
  delivery: { x: 680, y: 40 }
} as const;

export const ORDER_FLOW_STEPS: readonly OrderFlowStep[] = [
  {
    id: 'table-qr',
    shortLabel: 'Table QR',
    title: 'Table QR Ordering',
    point: ORDER_FLOW_POINTS.tableQr,
    bullets: [
      'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones',
      'Cost Savings - Reduce Printed Menu & dependence on manpower',
      'Online Payment - Multiple integrated payment options for customer to pay securely through mobile'
    ]
  },
  {
    id: 'self-ordering-kiosk',
    shortLabel: 'Kiosk',
    title: 'Self Ordering Kiosk',
    point: ORDER_FLOW_POINTS.kiosk,
    bullets: [
      'Contactless Ordering - Allow customers to use the self-service kiosk to browse the menu, place orders, process payments, and reduce their wait times',
      'Interactive Interface - User-friendly touchscreen interfaces allow customers to easily navigate through the ordering process',
      'Secure Payment - Multiple payment options with integrated payment terminals & online payment gateways'
    ]
  },
  {
    id: 'website-ordering',
    shortLabel: 'Website',
    title: 'Website Ordering',
    point: ORDER_FLOW_POINTS.website,
    bullets: [
      'Online Ordering - Allow customers to place orders online and easily track order status',
      'Order Scheduling - Allow customers reserve or schedule Future Delivery or Pickup Orders',
      'Online Payment - Multiple integrated payment options for customer to pay securely through website'
    ]
  },
  {
    id: 'pos-e-waiter',
    shortLabel: 'POS / E-Waiter',
    title: 'POS / E-Waiter',
    point: ORDER_FLOW_POINTS.pos,
    bullets: [
      'Cloud based POS system - access the data anywhere',
      'Easy menu setup - modifiers, promotion items or bundle',
      'Report - Daily Sales, Item Sales, Customer Sales',
      'CRM - collect customer data and offer loyalty programs with tier based'
    ]
  },
  {
    id: 'queue-number-display',
    shortLabel: 'Queue',
    title: 'Queue Number Display',
    point: ORDER_FLOW_POINTS.queue,
    bullets: [
      'Order Management - An unique queue number is assigned to orders from all ordering portals',
      'Queue Number Display - Syncs with KDS, real time queue number updates when orders are ready for pickup.'
    ]
  },
  {
    id: 'kitchen-display-system',
    shortLabel: 'KDS',
    title: 'Kitchen Display System (KDS)',
    point: ORDER_FLOW_POINTS.kds,
    bullets: [
      'Order Tracking - Receive real-time updates for new orders, modifications, or cancellations',
      'Visual Alerts - Color indication to convey the status of orders (e.g., new orders, in progress, completed)',
      'Error Reduction - Minimize order errors'
    ]
  },
  {
    id: 'order-hub',
    shortLabel: 'Order Hub',
    title: 'Order Hub',
    point: ORDER_FLOW_POINTS.orderHub,
    bullets: [
      'Centralized Order Management - Integrated with GrabFood, Foodpanda, and Deliveroo to one centralized platform',
      'Order tracking - Receive real-time order status updates and directly send to POS and KDS systems',
      'Real-time Overview Report - Easily monitor all your delivery, online and in-store orders in one POS system'
    ]
  }
];

const finiteProgress = (value: number): number => Number.isFinite(value) ? value : 0;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, finiteProgress(value)));
const phaseProgress = (value: number, start: number, end: number): number =>
  clamp01((clamp01(value) - start) / (end - start));
const lerpPoint = (from: FlowPoint, to: FlowPoint, amount: number): FlowPoint => ({
  x: from.x + ((to.x - from.x) * amount),
  y: from.y + ((to.y - from.y) * amount)
});

export function getActiveOrderFlowStepIndex(progress: number): number {
  const value = clamp01(progress);
  for (let index = ORDER_FLOW_BREAKPOINTS.length - 2; index >= 0; index -= 1) {
    if (value >= ORDER_FLOW_BREAKPOINTS[index]) return index;
  }
  return 0;
}

export function createOrderFlowSceneState(progress: number): OrderFlowSceneState {
  const value = clamp01(progress);
  const entry = phaseProgress(value, 0, .40);
  const kitchen = phaseProgress(value, .55, .75);
  const hub = phaseProgress(value, .75, 1);
  const entryPoints = [
    ORDER_FLOW_POINTS.tableQr,
    ORDER_FLOW_POINTS.kiosk,
    ORDER_FLOW_POINTS.website,
    ORDER_FLOW_POINTS.pos
  ];
  const mergedFigure = value < .55
    ? ORDER_FLOW_POINTS.queue
    : value < .75
      ? lerpPoint(ORDER_FLOW_POINTS.queue, ORDER_FLOW_POINTS.kds, kitchen)
      : lerpPoint(ORDER_FLOW_POINTS.kds, ORDER_FLOW_POINTS.orderHub, hub);

  return {
    entryFigures: entryPoints.map((point) => lerpPoint(point, ORDER_FLOW_POINTS.queue, entry)),
    entryFiguresVisible: value < .40,
    mergedFigure,
    mergedFigureVisible: value >= .40,
    deliveryFigure: lerpPoint(ORDER_FLOW_POINTS.delivery, ORDER_FLOW_POINTS.orderHub, hub),
    deliveryFigureVisible: value >= .75,
    entryRouteCompletion: entry,
    kdsRouteCompletion: kitchen,
    orderHubRouteCompletion: hub,
    deliveryRouteCompletion: hub,
    walkCycle: Math.sin(value * Math.PI * 24),
    mergeSettle: phaseProgress(value, .40, .44)
  };
}
```

- [ ] **Step 4: Run the model test and verify GREEN**

Run the Task 1 test command again.

Expected: `TOTAL: 6 SUCCESS` and exit code `0`.

- [ ] **Step 5: Commit Task 1**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.model.ts UI/src/app/components/index/app/home-order-flow.model.spec.ts
git commit -m "feat: model APPZPOS order flow progress"
```

---

### Task 2: Accessible Component Markup and Static Fallback

**Files:**

- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.ts`
- Create: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.html`
- Create: `UI/src/app/components/index/app/home-order-flow.component.spec.ts`

**Interfaces:**

- Consumes: all exports from `home-order-flow.model.ts`.
- Produces: Angular selector `app-home-order-flow`, semantic animated markup, and static reduced-motion markup.

- [ ] **Step 1: Write failing component rendering tests**

Create `home-order-flow.component.spec.ts` with a controllable `matchMedia` replacement:

```ts
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeOrderFlowComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component';

describe('HomeOrderFlowComponent', () => {
  let fixture: ComponentFixture<HomeOrderFlowComponent>;
  let originalMatchMedia: typeof window.matchMedia;

  const setReducedMotion = (matches: boolean) => {
    window.matchMedia = (() => ({
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true
    })) as typeof window.matchMedia;
  };

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    setReducedMotion(false);
    TestBed.configureTestingModule({
      declarations: [HomeOrderFlowComponent],
      imports: [CommonModule]
    });
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
  });

  afterEach(() => {
    fixture.destroy();
    window.matchMedia = originalMatchMedia;
  });

  it('renders seven indicators and the converging SVG scene', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.appzpos-order-flow__step').length).toBe(7);
    expect(host.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 1000 460');
    expect(host.querySelectorAll('[data-entry-route]').length).toBe(4);
    expect(host.querySelectorAll('[data-entry-figure]').length).toBe(4);
    expect(host.querySelector('[data-merged-figure]')).not.toBeNull();
    expect(host.querySelector('[data-delivery-figure]')).not.toBeNull();
  });

  it('shows the current title and exact bullets in the caption', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appzpos-order-flow__caption h3')?.textContent?.trim())
      .toBe('Table QR Ordering');
    expect(Array.from(host.querySelectorAll('.appzpos-order-flow__caption li'))
      .map((item) => item.textContent?.trim())).toEqual([
        'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones',
        'Cost Savings - Reduce Printed Menu & dependence on manpower',
        'Online Payment - Multiple integrated payment options for customer to pay securely through mobile'
      ]);
  });

  it('renders only the complete static list when reduced motion is requested', () => {
    fixture.destroy();
    setReducedMotion(true);
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appzpos-order-flow__scroll')).toBeNull();
    expect(host.querySelectorAll('.appzpos-order-flow__static-step').length).toBe(7);
    expect(host.textContent).toContain('Real-time Overview Report - Easily monitor all your delivery, online and in-store orders in one POS system');
  });
});
```

- [ ] **Step 2: Run the component test and verify RED**

Run:

```bash
cd UI
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include=src/app/components/index/app/home-order-flow.component.spec.ts
```

Expected: compilation fails because `HomeOrderFlowComponent` does not exist.

- [ ] **Step 3: Implement the component shell**

Create the component class with `ChangeDetectionStrategy.OnPush`, expose `steps`, `activeStepIndex`, `activeStep`, and `reducedMotion`, and defer observer initialization to Task 3:

```ts
@Component({
  selector: 'app-home-order-flow',
  templateUrl: './home-order-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOrderFlowComponent implements OnInit {
  readonly steps = ORDER_FLOW_STEPS;
  activeStepIndex = 0;
  reducedMotion = false;

  get activeStep(): OrderFlowStep {
    return this.steps[this.activeStepIndex];
  }

  ngOnInit(): void {
    this.reducedMotion = typeof window === 'undefined'
      || typeof window.matchMedia !== 'function'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
```

Create the template with:

- One visually hidden `<h2>APPZPOS ordering flow</h2>`.
- An `*ngIf="!reducedMotion; else staticOrderFlow"` animated wrapper.
- A seven-item indicator `<ol>`.
- One inline SVG containing all base routes, green completion routes, eight node markers, four entry figures, one merged figure, and one delivery figure.
- Figure groups made from stroke-only circles and lines and marked `aria-hidden="true"`.
- A caption `<article>` rendered through `*ngFor` plus `*ngIf="index === activeStepIndex"` so its CSS entry animation restarts at each step.
- An `<ng-template #staticOrderFlow>` containing an ordered list of all seven titles and bullet lists.

Use `pathLength="1"` and `stroke-dasharray="1"` on completion paths. Add data attributes required by tests and the Task 3 renderer.

- [ ] **Step 4: Run the component test and verify GREEN**

Run the Task 2 test command again.

Expected: `TOTAL: 3 SUCCESS` and exit code `0`.

- [ ] **Step 5: Commit Task 2**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow UI/src/app/components/index/app/home-order-flow.component.spec.ts
git commit -m "feat: add accessible APPZPOS order flow scene"
```

---

### Task 3: Scroll Controller, DOM Rendering, and Lifecycle Cleanup

**Files:**

- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component.html`
- Modify: `UI/src/app/components/index/app/home-order-flow.component.spec.ts`

**Interfaces:**

- Consumes: `createOrderFlowSceneState(progress)` and `getActiveOrderFlowStepIndex(progress)`.
- Produces: one guarded frame loop, DOM updates for route completion and figure transforms, and complete cleanup in `ngOnDestroy`.

- [ ] **Step 1: Add failing scroll and cleanup tests**

Extend the component spec with observer doubles and these behaviors:

```ts
it('maps a measured wrapper position to clamped scroll progress', () => {
  fixture.detectChanges();
  const component = fixture.componentInstance;
  expect(component.calculateProgress({ top: 0, height: 7600 } as DOMRect, 900)).toBe(0);
  expect(component.calculateProgress({ top: -3350, height: 7600 } as DOMRect, 900)).toBeCloseTo(.5, 5);
  expect(component.calculateProgress({ top: -9000, height: 7600 } as DOMRect, 900)).toBe(1);
  expect(component.calculateProgress({ top: -10, height: 900 } as DOMRect, 900)).toBe(0);
});

it('changes Angular caption state only when a breakpoint is crossed', () => {
  fixture.detectChanges();
  const component = fixture.componentInstance;
  component.renderProgress(.099);
  expect(component.activeStepIndex).toBe(0);
  component.renderProgress(.10);
  expect(component.activeStepIndex).toBe(1);
  component.renderProgress(.75);
  expect(component.activeStepIndex).toBe(6);
});

it('disconnects observers and cancels its frame when destroyed', () => {
  fixture.detectChanges();
  const component = fixture.componentInstance;
  const disconnectIntersection = spyOn(component['intersectionObserver']!, 'disconnect');
  const disconnectResize = spyOn(component['resizeObserver']!, 'disconnect');
  const cancelFrame = spyOn(window, 'cancelAnimationFrame');
  component['animationFrameId'] = 42;
  fixture.destroy();
  expect(disconnectIntersection).toHaveBeenCalled();
  expect(disconnectResize).toHaveBeenCalled();
  expect(cancelFrame).toHaveBeenCalledWith(42);
});

it('starts only one frame loop and stops it when the section leaves view', () => {
  fixture.detectChanges();
  const component = fixture.componentInstance;
  const requestFrame = spyOn(window, 'requestAnimationFrame').and.returnValue(17);
  component['handleIntersection'](true);
  component['handleIntersection'](true);
  expect(requestFrame).toHaveBeenCalledTimes(1);
  component['handleIntersection'](false);
  expect(component['frameRunning']).toBeFalse();
});

it('updates the sticky offset when the fixed header changes height', () => {
  fixture.detectChanges();
  const component = fixture.componentInstance;
  component['setHeaderHeight'](84);
  expect((fixture.nativeElement as HTMLElement).style
    .getPropertyValue('--appzpos-order-flow-nav-height')).toBe('84px');
});

it('falls back to the static list when required observer APIs are unavailable', () => {
  const originalIntersectionObserver = window.IntersectionObserver;
  const originalResizeObserver = window.ResizeObserver;
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined });
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: undefined });
  fixture.destroy();
  fixture = TestBed.createComponent(HomeOrderFlowComponent);
  fixture.detectChanges();
  expect(fixture.componentInstance.reducedMotion).toBeTrue();
  expect((fixture.nativeElement as HTMLElement)
    .querySelectorAll('.appzpos-order-flow__static-step').length).toBe(7);
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: originalIntersectionObserver });
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: originalResizeObserver });
});
```

Provide complete `IntersectionObserver` and `ResizeObserver` test doubles in `beforeEach`. Each double must store its callback, implement `observe`, `unobserve`, and `disconnect`, and allow the test to trigger intersecting and resize entries.

- [ ] **Step 2: Run the component test and verify RED**

Run the Task 2 test command.

Expected: tests fail because `calculateProgress`, `renderProgress`, and observer lifecycle fields do not exist.

- [ ] **Step 3: Implement observer and animation-frame lifecycle**

Update the component to implement `AfterViewInit` and `OnDestroy`. Add:

```ts
@ViewChild('orderFlowSection') private sectionRef?: ElementRef<HTMLElement>;
@ViewChild('orderFlowStage') private stageRef?: ElementRef<HTMLElement>;

private intersectionObserver?: IntersectionObserver;
private resizeObserver?: ResizeObserver;
private animationFrameId?: number;
private destroyed = false;
private frameRunning = false;

calculateProgress(bounds: Pick<DOMRect, 'top' | 'height'>, stageHeight: number): number {
  const distance = Math.max(1, bounds.height - stageHeight);
  return Math.min(1, Math.max(0, -bounds.top / distance));
}
```

Initialization rules:

1. Set `reducedMotion` to true and return immediately for reduced motion or unavailable observer APIs.
2. Observe the section with `IntersectionObserver`.
3. Start one frame loop when intersecting and stop it when no longer intersecting.
4. Observe `#header-wrap` with `ResizeObserver` and set `--appzpos-order-flow-nav-height` on the component host.
5. Use a `60px` fallback when the header is missing.

Implement `renderProgress(progress)` to:

- Call `createOrderFlowSceneState`.
- Set each `[data-entry-figure]` transform and opacity.
- Set `[data-merged-figure]` and `[data-delivery-figure]` transforms and opacity.
- Set the four entry completion paths plus the Queue-to-KDS, KDS-to-Hub, and delivery completion paths.
- Apply opposite leg rotations from `walkCycle` to every visible figure.
- Update `activeStepIndex` and call `ChangeDetectorRef.markForCheck()` only when `getActiveOrderFlowStepIndex(progress)` changes.

Use helper functions with explicit selectors:

```ts
private setFigure(element: SVGGraphicsElement | null, point: FlowPoint, visible: boolean, walkCycle: number): void {
  if (!element) return;
  element.setAttribute('transform', `translate(${point.x} ${point.y})`);
  element.setAttribute('opacity', visible ? '1' : '0');
  element.querySelector<SVGGraphicsElement>('[data-left-leg]')
    ?.setAttribute('transform', `rotate(${walkCycle * 18} 0 0)`);
  element.querySelector<SVGGraphicsElement>('[data-right-leg]')
    ?.setAttribute('transform', `rotate(${-walkCycle * 18} 0 0)`);
}

private setRouteCompletion(element: SVGGeometryElement | null, completion: number): void {
  if (!element) return;
  element.style.strokeDashoffset = String(1 - completion);
}
```

In `ngOnDestroy`, set `destroyed`, disconnect both observers, cancel the active frame, and clear all media-query listeners.

- [ ] **Step 4: Run component and model tests and verify GREEN**

Run:

```bash
cd UI
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include=src/app/components/index/app/home-order-flow.model.spec.ts --include=src/app/components/index/app/home-order-flow.component.spec.ts
```

Expected: all order-flow tests pass with exit code `0`.

- [ ] **Step 5: Commit Task 3**

```bash
git add UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow UI/src/app/components/index/app/home-order-flow.component.spec.ts
git commit -m "feat: drive order flow from page scroll"
```

---

### Task 4: Homepage Integration and Responsive Styling

**Files:**

- Create: `UI/src/styles/_appzpos-order-flow.scss`
- Modify: `UI/src/custom-theme.scss`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts`
- Modify: `UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html`
- Modify: `UI/src/app/components/index/app/home-order-flow.component.spec.ts`

**Interfaces:**

- Consumes: selector `app-home-order-flow`.
- Produces: integrated section placement and responsive visual system.

- [ ] **Step 1: Add a failing integration placement test**

Add this test to the existing `home-hero.spec.ts`. Its existing `CUSTOM_ELEMENTS_SCHEMA` renders the selector without importing the child component:

```ts
it('places the order-flow story directly after the homepage hero', () => {
  const host = fixture.nativeElement as HTMLElement;
  const hero = host.querySelector('.appzpos-product-hero');
  const orderFlow = hero?.nextElementSibling;
  expect(orderFlow?.tagName.toLowerCase()).toBe('app-home-order-flow');
  expect(orderFlow?.nextElementSibling?.getAttribute('id')).toBe('content');
});
```

- [ ] **Step 2: Run the placement test and verify RED**

Run:

```bash
cd UI
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include=src/app/components/index/app/home-hero.spec.ts
```

Expected: the new placement test fails because the hero is still followed by `#content`.

- [ ] **Step 3: Integrate the component and stylesheet**

Add `HomeOrderFlowComponent` to `custom-app.module.ts` imports and declarations. Add this exact placement:

```html
</section>

<app-home-order-flow></app-home-order-flow>

<section id="content">
```

Import the new partial in `custom-theme.scss`:

```scss
@use 'styles/appzpos-home-hero';
@use 'styles/appzpos-order-flow';
```

- [ ] **Step 4: Implement responsive SCSS**

Create namespaced styles with these concrete layout rules:

```scss
.appzpos-order-flow {
  --flow-navy: #102342;
  --flow-blue: #1698df;
  --flow-orange: #f47735;
  --flow-green: #2f9d68;
  --flow-paper: #fbfaf6;
  --flow-line: #a7b5c5;
  position: relative;
  color: var(--flow-navy);
  background: var(--flow-paper);
}

.appzpos-order-flow__scroll { min-height: 760vh; }
.appzpos-order-flow__stage {
  position: sticky;
  top: var(--appzpos-order-flow-nav-height, 60px);
  min-height: calc(100dvh - var(--appzpos-order-flow-nav-height, 60px));
  overflow: clip;
}
.appzpos-order-flow__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(18rem, .7fr);
  gap: clamp(1.5rem, 3vw, 3.5rem);
  width: min(94vw, 90rem);
  margin-inline: auto;
}
.appzpos-order-flow__scene svg { display: block; width: 100%; height: auto; overflow: visible; }
.appzpos-order-flow__route { fill: none; stroke: var(--flow-line); stroke-dasharray: 8 10; vector-effect: non-scaling-stroke; }
.appzpos-order-flow__route--complete { stroke: var(--flow-green); stroke-dasharray: 1; stroke-dashoffset: 1; }
.appzpos-order-flow__figure { transition: opacity 120ms linear; }
.appzpos-order-flow__caption-panel { min-height: 21rem; }
.appzpos-order-flow__caption { animation: appzpos-order-caption-in 220ms ease-out both; }
```

Add explicit breakpoints:

- At `max-width: 1023px`, use one column, `650vh`, and place the caption below the scene.
- At `max-width: 767px`, reduce outer padding, use `min-height: calc(100dvh - nav height)`, keep indicators horizontally scrollable, use `font-size: 28px` for SVG labels, and use `vector-effect: non-scaling-stroke` for all strokes.
- At `max-width: 430px`, cap the caption body to available stage space without clipping bullets and keep the stage internally scroll-free.
- Under `prefers-reduced-motion: reduce`, disable caption animation and all transitions.
- Use `@supports not (height: 100dvh)` with a `100vh` fallback.

Style the static list as a normal document-flow ordered list with no sticky positioning and no excessive vertical height.

- [ ] **Step 5: Run tests and production build**

Run:

```bash
cd UI
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include=src/app/components/index/app/home-hero.spec.ts --include=src/app/components/index/app/home-order-flow.model.spec.ts --include=src/app/components/index/app/home-order-flow.component.spec.ts
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js build
```

Expected: all selected tests pass and the production build exits `0`. Record, but do not expand scope for, the existing initial-bundle budget warning.

- [ ] **Step 6: Commit Task 4**

```bash
git add UI/src/styles/_appzpos-order-flow.scss UI/src/custom-theme.scss UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/modules/custom-app.module.ts UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component.html UI/src/app/components/index/app/home-hero.spec.ts
git commit -m "feat: integrate responsive homepage order flow"
```

---

### Task 5: Browser Regression, Accessibility Verification, and Preview

**Files:**

- Create: `UI/scripts/order-flow-regression.mjs`
- Modify only if a regression fails: files introduced or changed in Tasks 1-4.

**Interfaces:**

- Consumes: local production preview at `http://127.0.0.1:4300/` and Chrome DevTools Protocol port `9225`.
- Produces: a nonzero exit code with precise viewport-specific failures or a JSON pass result.

- [ ] **Step 1: Write the browser regression before visual fixes**

Implement a CDP script following `UI/scripts/hero-screen-fit-regression.mjs`. For each width `1440`, `1280`, `1024`, `768`, `430`, and `390`:

```js
const viewports = [1440, 1280, 1024, 768, 430, 390];
const expectedTitles = [
  'Table QR Ordering',
  'Self Ordering Kiosk',
  'Website Ordering',
  'POS / E-Waiter',
  'Queue Number Display',
  'Kitchen Display System (KDS)',
  'Order Hub'
];
```

Evaluate and fail when any condition is false:

- `<app-home-order-flow>` is the hero's next sibling and `#content` follows it.
- The page has zero horizontal overflow.
- The sticky stage top is at or below `#header-wrap` bottom.
- Every SVG node label has a nonempty rectangle and does not intersect its associated circle rectangle.
- The seven indicator labels match `expectedTitles` through their accessible labels.
- Scrolling to progress `.10`, `.40`, `.55`, and `.75` activates steps `2`, `5`, `6`, and `7` respectively.
- At progress `.40`, all entry figures are hidden and the merged figure is visible at Queue.
- At progress `1`, merged and delivery figures share the Order Hub coordinates.
- Existing Google Tag Manager `GTM-N7VKTGG`, Meta Pixel loader, WhatsApp action, and Messenger widget remain present.

Then emulate `prefers-reduced-motion: reduce`, reload, and fail unless:

- `.appzpos-order-flow__scroll` is absent.
- Exactly seven `.appzpos-order-flow__static-step` elements exist.
- The component's height is less than `500vh`.

- [ ] **Step 2: Run the browser regression and verify RED if visual defects remain**

Start a CDP browser and run:

```bash
cd UI
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --headless=new --disable-gpu --remote-debugging-port=9225 --user-data-dir=/tmp/appzpos-order-flow-cdp about:blank
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node scripts/order-flow-regression.mjs
```

Expected before final adjustments: the script identifies any label collision, sticky-header overlap, overflow, or breakpoint mismatch by viewport.

- [ ] **Step 3: Fix only evidence-backed responsive defects**

Adjust the new component or `_appzpos-order-flow.scss` only for failures reported by the script. Do not modify the hero or unrelated homepage sections.

- [ ] **Step 4: Run the full verification suite**

Run:

```bash
cd UI
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node node_modules/@angular/cli/bin/ng.js build
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node scripts/hero-screen-fit-regression.mjs
PATH="/Users/dmsyx/Library/Application Support/Zed/node/node-v24.11.0-darwin-arm64/bin:$PATH" node scripts/order-flow-regression.mjs
git diff --check
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4300/
```

Expected:

- All unit tests pass.
- Production build exits `0`.
- Both browser regression scripts report `status: pass`.
- `git diff --check` exits `0`.
- Preview returns HTTP `200`.

- [ ] **Step 5: Run the design pre-flight audit**

Check the rendered page and source for:

- Exact product copy and no invented claims.
- One light page theme with APPZPOS colors.
- No label collision at all required widths.
- No animation under reduced motion.
- No new global scroll listener.
- No unrelated homepage changes.
- No broken tracking, CTA, WhatsApp, or Messenger behavior.

- [ ] **Step 6: Commit Task 5**

```bash
git add UI/scripts/order-flow-regression.mjs UI/client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow UI/src/styles/_appzpos-order-flow.scss
git commit -m "test: verify APPZPOS order flow responsiveness"
```

- [ ] **Step 7: Hand off the preview**

Keep the local preview server running at:

`http://127.0.0.1:4300/`

Report changed files, animation structure, verification evidence, known pre-existing warnings, and confirm that nothing was pushed.
