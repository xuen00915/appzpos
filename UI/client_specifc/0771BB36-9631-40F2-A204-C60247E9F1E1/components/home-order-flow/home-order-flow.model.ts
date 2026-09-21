export interface FlowPoint {
  x: number;
  y: number;
}

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
    if (value >= ORDER_FLOW_BREAKPOINTS[index]) {
      return index;
    }
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
