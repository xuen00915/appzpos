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
