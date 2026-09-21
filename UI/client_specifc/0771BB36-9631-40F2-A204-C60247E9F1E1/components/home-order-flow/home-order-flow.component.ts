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

interface EcosystemIsland {
  id: string;
  title: string;
  detail: string;
  route: string;
  image: string;
  ariaLabel: string;
  depth: number;
}

@Component({
  selector: 'app-home-order-flow',
  templateUrl: './home-order-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOrderFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ecosystemSection') private sectionRef?: ElementRef<HTMLElement>;
  @ViewChild('ecosystemStage') private stageRef?: ElementRef<HTMLElement>;

  readonly islands: readonly EcosystemIsland[] = [
    {
      id: 'admin',
      title: 'Admin / Back Office',
      detail: 'Cloud POS / Management / Reports',
      route: '/cloud-pos-point-of-sales-system',
      image: 'assets/images/ecosystem/ecosystem-admin.webp',
      ariaLabel: 'Explore APPZPOS admin and back office management',
      depth: .55
    },
    {
      id: 'dining',
      title: 'Dining / Restaurant',
      detail: 'Table QR Ordering / E-Waiter',
      route: '/f&b-restaurant-emenu-qr-code-ordering-system',
      image: 'assets/images/ecosystem/ecosystem-dining.webp',
      ariaLabel: 'Explore Table QR Ordering and E-Waiter',
      depth: .35
    },
    {
      id: 'kitchen',
      title: 'Kitchen',
      detail: 'Kitchen Display System',
      route: '/f&b-restaurant-kitchen-display-system',
      image: 'assets/images/ecosystem/ecosystem-kitchen.webp',
      ariaLabel: 'Explore Kitchen Display System',
      depth: .72
    },
    {
      id: 'pos',
      title: 'POS & Ordering',
      detail: 'POS / Self-Order Kiosk / Queue',
      route: '/custom-solutions',
      image: 'assets/images/ecosystem/ecosystem-pos.webp',
      ariaLabel: 'Explore POS, Self-Order Kiosk and Queue solutions',
      depth: .88
    },
    {
      id: 'website',
      title: 'Website Ordering',
      detail: 'Online ordering and payment',
      route: '/f&b-restaurant-online-ordering-website',
      image: 'assets/images/ecosystem/ecosystem-website.webp',
      ariaLabel: 'Explore Website Ordering',
      depth: .68
    },
    {
      id: 'delivery',
      title: 'Delivery / Order Hub',
      detail: 'Delivery integrations / Order Hub',
      route: '/f&b-restaurant-delivery-integration',
      image: 'assets/images/ecosystem/ecosystem-delivery.webp',
      ariaLabel: 'Explore delivery integrations and Order Hub',
      depth: 1
    }
  ];

  activeIslandId: string | null = null;
  isVisible = false;
  reducedMotion = false;

  private coarsePointer = false;
  private intersectionObserver?: IntersectionObserver;
  private animationFrameId?: number;
  private pointerFrameId?: number;
  private frameRunning = false;
  private destroyed = false;
  private pointerX = 0;
  private pointerY = 0;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const canQueryMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    this.reducedMotion = !canQueryMedia
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.coarsePointer = canQueryMedia
      && window.matchMedia('(pointer: coarse)').matches;
    this.isVisible = this.reducedMotion || typeof window.IntersectionObserver !== 'function';
  }

  ngAfterViewInit(): void {
    if (!this.sectionRef || this.reducedMotion || typeof window.IntersectionObserver !== 'function') {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.intersectionObserver = new window.IntersectionObserver((entries) => {
        this.handleIntersection(entries.some((entry) => entry.isIntersecting));
      }, { threshold: .08, rootMargin: '8% 0px 8% 0px' });
      this.intersectionObserver.observe(this.sectionRef!.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.frameRunning = false;
    this.intersectionObserver?.disconnect();
    if (this.animationFrameId !== undefined) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.pointerFrameId !== undefined) {
      window.cancelAnimationFrame(this.pointerFrameId);
    }
  }

  setActiveIsland(id: string): void {
    this.activeIslandId = id;
    this.changeDetectorRef.markForCheck();
  }

  clearActiveIsland(): void {
    this.activeIslandId = null;
    this.changeDetectorRef.markForCheck();
  }

  handlePointerMove(event: PointerEvent): void {
    const stage = this.stageRef?.nativeElement;
    if (!stage || this.reducedMotion || this.coarsePointer) {
      return;
    }

    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) {
      return;
    }

    this.pointerX = this.clamp((((event.clientX - bounds.left) / bounds.width) - .5) * 10, -5, 5);
    this.pointerY = this.clamp((((event.clientY - bounds.top) / bounds.height) - .5) * 10, -5, 5);
    this.schedulePointerRender();
  }

  resetPointerParallax(): void {
    this.pointerX = 0;
    this.pointerY = 0;
    this.applyTransforms();
  }

  private handleIntersection(isIntersecting: boolean): void {
    if (isIntersecting && !this.isVisible) {
      this.ngZone.run(() => {
        this.isVisible = true;
        this.changeDetectorRef.markForCheck();
      });
    }

    if (!isIntersecting) {
      this.stopFrameLoop();
      return;
    }

    if (!this.reducedMotion && !this.frameRunning && !this.destroyed) {
      this.frameRunning = true;
      this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
    }
  }

  private readonly renderFrame = (): void => {
    if (!this.frameRunning || this.destroyed) {
      return;
    }
    this.applyTransforms();
    this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
  };

  private schedulePointerRender(): void {
    if (this.pointerFrameId !== undefined) {
      return;
    }
    this.pointerFrameId = window.requestAnimationFrame(() => {
      this.pointerFrameId = undefined;
      this.applyTransforms();
    });
  }

  private applyTransforms(): void {
    const stage = this.stageRef?.nativeElement;
    const section = this.sectionRef?.nativeElement;
    if (!stage || !section) {
      return;
    }

    const bounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const travel = this.clamp(
      ((viewportHeight - bounds.top) / (viewportHeight + Math.max(bounds.height, 1))) - .5,
      -.5,
      .5
    );

    stage.querySelectorAll<HTMLElement>('[data-ecosystem-island]').forEach((island) => {
      const depth = Number(island.dataset['depth']) || 0;
      const direction = island.classList.contains('appz-ecosystem__island--lower') ? -1 : 1;
      island.style.setProperty('--pointer-x', `${this.round(this.pointerX * depth)}px`);
      island.style.setProperty('--pointer-y', `${this.round(this.pointerY * depth)}px`);
      island.style.setProperty('--scroll-y', `${this.round(travel * 24 * depth * direction)}px`);
    });
  }

  private stopFrameLoop(): void {
    this.frameRunning = false;
    if (this.animationFrameId !== undefined) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, value));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
