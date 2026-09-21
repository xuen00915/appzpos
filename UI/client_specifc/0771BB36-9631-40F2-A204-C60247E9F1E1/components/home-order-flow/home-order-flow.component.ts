import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FlowPoint,
  ORDER_FLOW_BREAKPOINTS,
  ORDER_FLOW_STEPS,
  OrderFlowStep,
  createOrderFlowSceneState,
  getActiveOrderFlowStepIndex
} from './home-order-flow.model';

@Component({
  selector: 'app-home-order-flow',
  templateUrl: './home-order-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOrderFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('orderFlowSection') private sectionRef?: ElementRef<HTMLElement>;
  @ViewChild('orderFlowStage') private stageRef?: ElementRef<HTMLElement>;

  readonly steps = ORDER_FLOW_STEPS;
  activeStepIndex = 0;
  reducedMotion = false;

  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private animationFrameId?: number;
  private navigationReleaseId?: number;
  private navigationTarget?: number;
  private destroyed = false;
  private frameRunning = false;
  private headerHeight = 60;

  constructor(
    private readonly hostRef: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {}

  get activeStep(): OrderFlowStep {
    return this.steps[this.activeStepIndex];
  }

  ngOnInit(): void {
    this.reducedMotion = typeof window === 'undefined'
      || typeof window.matchMedia !== 'function'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || typeof window.IntersectionObserver !== 'function'
      || typeof window.ResizeObserver !== 'function';
  }

  ngAfterViewInit(): void {
    if (this.reducedMotion || !this.sectionRef || !this.stageRef) {
      return;
    }

    this.renderProgress(0);
    this.ngZone.runOutsideAngular(() => this.initializeObservers());
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.frameRunning = false;
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    if (this.animationFrameId !== undefined) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    if (this.navigationReleaseId !== undefined) {
      window.clearTimeout(this.navigationReleaseId);
      this.navigationReleaseId = undefined;
    }
  }

  goToStep(index: number): void {
    if (!this.sectionRef || !this.stageRef || index < 0 || index >= this.steps.length) {
      return;
    }

    const breakpoint = ORDER_FLOW_BREAKPOINTS[index];
    const targetProgress = index === 0 ? 0 : Math.min(.998, breakpoint + .002);
    const sectionBounds = this.sectionRef.nativeElement.getBoundingClientRect();
    const stageHeight = this.stageRef.nativeElement.getBoundingClientRect().height || window.innerHeight;
    const travelDistance = Math.max(0, sectionBounds.height - stageHeight);
    const sectionTop = window.scrollY + sectionBounds.top;

    this.navigationTarget = targetProgress;
    this.renderProgress(targetProgress);
    window.scrollTo({
      top: sectionTop + (travelDistance * targetProgress),
      behavior: this.reducedMotion ? 'auto' : 'smooth'
    });

    if (this.navigationReleaseId !== undefined) {
      window.clearTimeout(this.navigationReleaseId);
    }
    this.navigationReleaseId = window.setTimeout(() => {
      this.navigationTarget = undefined;
      this.navigationReleaseId = undefined;
    }, 850);
  }

  skipInteraction(): void {
    const content = document.querySelector<HTMLElement>('#content');
    if (!content) {
      return;
    }

    this.navigationTarget = undefined;
    if (this.navigationReleaseId !== undefined) {
      window.clearTimeout(this.navigationReleaseId);
      this.navigationReleaseId = undefined;
    }
    window.scrollTo({
      top: window.scrollY + content.getBoundingClientRect().top - this.headerHeight,
      behavior: this.reducedMotion ? 'auto' : 'smooth'
    });
  }

  calculateProgress(bounds: Pick<DOMRect, 'top' | 'height'>, stageHeight: number): number {
    const availableDistance = bounds.height - stageHeight;
    if (!Number.isFinite(availableDistance) || availableDistance <= 0) {
      return 0;
    }

    return Math.min(1, Math.max(0, -bounds.top / availableDistance));
  }

  renderProgress(progress: number): void {
    const section = this.sectionRef?.nativeElement;
    if (!section) {
      return;
    }

    const state = createOrderFlowSceneState(progress);
    const entryFigures = Array.from(
      section.querySelectorAll<SVGGraphicsElement>('[data-entry-figure]')
    );
    entryFigures.forEach((figure, index) => {
      this.setFigure(
        figure,
        state.entryFigures[index],
        state.entryFiguresVisible,
        state.walkCycle
      );
    });

    this.setFigure(
      section.querySelector<SVGGraphicsElement>('[data-merged-figure]'),
      state.mergedFigure,
      state.mergedFigureVisible,
      progress >= .55 ? state.walkCycle : 0,
      .84 + (.16 * state.mergeSettle)
    );
    this.setFigure(
      section.querySelector<SVGGraphicsElement>('[data-delivery-figure]'),
      state.deliveryFigure,
      state.deliveryFigureVisible,
      state.walkCycle
    );

    section.querySelectorAll<SVGGeometryElement>('[data-entry-route-complete]')
      .forEach((route) => this.setRouteCompletion(route, state.entryRouteCompletion));
    this.setRouteCompletion(
      section.querySelector<SVGGeometryElement>('[data-kds-route-complete]'),
      state.kdsRouteCompletion
    );
    this.setRouteCompletion(
      section.querySelector<SVGGeometryElement>('[data-order-hub-route-complete]'),
      state.orderHubRouteCompletion
    );
    this.setRouteCompletion(
      section.querySelector<SVGGeometryElement>('[data-delivery-route-complete]'),
      state.deliveryRouteCompletion
    );

    const nextStepIndex = getActiveOrderFlowStepIndex(progress);
    if (nextStepIndex !== this.activeStepIndex) {
      this.ngZone.run(() => {
        this.activeStepIndex = nextStepIndex;
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  private initializeObservers(): void {
    const section = this.sectionRef?.nativeElement;
    if (!section) {
      return;
    }

    this.intersectionObserver = new window.IntersectionObserver((entries) => {
      this.handleIntersection(entries.some((entry) => entry.isIntersecting));
    }, { rootMargin: '25% 0px 25% 0px' });
    this.intersectionObserver.observe(section);

    this.resizeObserver = new window.ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height;
      if (height) {
        this.setHeaderHeight(height);
      }
    });

    const header = document.querySelector<HTMLElement>('#header-wrap');
    if (header) {
      this.setHeaderHeight(header.getBoundingClientRect().height);
      this.resizeObserver.observe(header);
    } else {
      this.setHeaderHeight(60);
    }
  }

  private handleIntersection(isIntersecting: boolean): void {
    if (!isIntersecting) {
      this.frameRunning = false;
      if (this.animationFrameId !== undefined) {
        window.cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = undefined;
      }
      return;
    }

    if (this.frameRunning || this.destroyed) {
      return;
    }

    this.frameRunning = true;
    this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
  }

  private readonly renderFrame = (): void => {
    if (!this.frameRunning || this.destroyed || !this.sectionRef || !this.stageRef) {
      return;
    }

    const sectionBounds = this.sectionRef.nativeElement.getBoundingClientRect();
    const stageHeight = this.stageRef.nativeElement.getBoundingClientRect().height || window.innerHeight;
    const measuredProgress = this.calculateProgress(sectionBounds, stageHeight);
    if (this.navigationTarget !== undefined && Math.abs(measuredProgress - this.navigationTarget) < .006) {
      this.navigationTarget = undefined;
    }
    this.renderProgress(this.navigationTarget ?? measuredProgress);
    this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
  };

  private setHeaderHeight(height: number): void {
    const safeHeight = Number.isFinite(height) && height > 0 ? height : 60;
    this.headerHeight = Math.round(safeHeight);
    this.hostRef.nativeElement.style.setProperty(
      '--appzpos-order-flow-nav-height',
      `${this.headerHeight}px`
    );
  }

  private setFigure(
    element: SVGGraphicsElement | null,
    point: FlowPoint,
    visible: boolean,
    walkCycle: number,
    scale = 1
  ): void {
    if (!element) {
      return;
    }

    element.setAttribute('transform', `translate(${point.x} ${point.y}) scale(${scale})`);
    element.setAttribute('opacity', visible ? '1' : '0');
    element.querySelector<SVGGraphicsElement>('[data-token-core]')
      ?.setAttribute('transform', `translate(0 ${walkCycle * 1.25}) rotate(${walkCycle * 1.5})`);
  }

  private setRouteCompletion(element: SVGGeometryElement | null, completion: number): void {
    if (element) {
      element.style.strokeDashoffset = String(1 - completion);
    }
  }
}
