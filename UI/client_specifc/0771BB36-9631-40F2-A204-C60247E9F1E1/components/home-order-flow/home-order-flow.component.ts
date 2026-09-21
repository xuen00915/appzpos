import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ORDER_FLOW_STEPS, OrderFlowStep } from './home-order-flow.model';

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
