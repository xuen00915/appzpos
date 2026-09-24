import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import {
  HomeSolutionFeature,
  HomeSolutionItem,
  HomeSolutionsConfig
} from '../home-page-template/home-page-template.models';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

interface EcosystemIsland {
  readonly id: string;
  readonly title: string;
  readonly modules: readonly { moduleId: string; title: string; summary: string }[];
  readonly route: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly ariaLabel: string;
  readonly depth: number;
}

interface ProductModule {
  readonly id: string;
  readonly title: string;
  readonly route: string;
  readonly image: string;
  readonly features: readonly HomeSolutionFeature[];
}

@Component({
  selector: 'app-home-order-flow',
  templateUrl: './home-order-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOrderFlowComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input({ required: true }) config!: HomeSolutionsConfig;
  @ViewChild('ecosystemSection') private sectionRef?: ElementRef<HTMLElement>;
  @ViewChild('ecosystemStage') private stageRef?: ElementRef<HTMLElement>;

  activeIslandId: string | null = null;
  activeDetailsIslandId: string | null = null;
  islands: readonly EcosystemIsland[] = [];
  productModules: readonly ProductModule[] = [];
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
    private readonly ngZone: NgZone,
    private readonly commonFunctionService: CommonFunctionService,
    private readonly router: Router
  ) {}

  /** Navigate to the selected solution and always open it at its hero section. */
  navigateToModule(event: Event, route: string): void {
    event.preventDefault();
    void this.router.navigateByUrl(route).then(() => {
      this.scrollToPageStart();
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => this.scrollToPageStart());
      }
    });
  }

  private scrollToPageStart(): void {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  get activeDetailsIsland(): EcosystemIsland | undefined {
    return this.islands.find((island) => island.id === this.activeDetailsIslandId);
  }

  get activeDetailsModules(): readonly ProductModule[] {
    const item = this.config?.items.find((candidate) => candidate.id === this.activeDetailsIslandId);
    return item ? [this.toProductModule(item)] : [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) this.selectInitialItem();
  }

  ngOnInit(): void {
    this.selectInitialItem();
    const canQueryMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    this.reducedMotion = !canQueryMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.coarsePointer = canQueryMedia && window.matchMedia('(pointer: coarse)').matches;
    this.isVisible = this.reducedMotion || typeof window.IntersectionObserver !== 'function';
  }

  ngAfterViewInit(): void {
    if (!this.sectionRef || this.reducedMotion || typeof window.IntersectionObserver !== 'function') return;
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
    if (this.animationFrameId !== undefined) window.cancelAnimationFrame(this.animationFrameId);
    if (this.pointerFrameId !== undefined) window.cancelAnimationFrame(this.pointerFrameId);
  }

  setActiveIsland(id: string): void {
    this.activeIslandId = id;
    this.changeDetectorRef.markForCheck();
  }

  clearActiveIsland(): void {
    this.activeIslandId = null;
    this.changeDetectorRef.markForCheck();
  }

  openIslandDetails(event: Event, islandId: string): false {
    event.preventDefault();
    event.stopPropagation();
    this.activeDetailsIslandId = islandId;
    this.activeIslandId = islandId;
    this.changeDetectorRef.markForCheck();
    return false;
  }

  handleOptionKey(event: Event, islandId: string): void {
    const key = (event as KeyboardEvent).key;
    if (key !== 'Enter' && key !== ' ') return;
    this.openIslandDetails(event, islandId);
  }

  handlePointerMove(event: PointerEvent): void {
    const stage = this.stageRef?.nativeElement;
    if (!stage || this.reducedMotion || this.coarsePointer) return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    this.pointerX = this.clamp((((event.clientX - bounds.left) / bounds.width) - .5) * 10, -5, 5);
    this.pointerY = this.clamp((((event.clientY - bounds.top) / bounds.height) - .5) * 10, -5, 5);
    this.schedulePointerRender();
  }

  resetPointerParallax(): void {
    this.pointerX = 0;
    this.pointerY = 0;
    this.applyTransforms();
  }

  private selectInitialItem(): void {
    const items = this.config?.items ?? [];
    this.islands = items.map((item) => ({
      id: item.id,
      title: item.title,
      modules: [{ moduleId: item.id, title: item.moduleTitle, summary: item.summary }],
      route: item.route,
      image: this.imageUrl(item.image),
      imageAlt: item.imageAlt,
      ariaLabel: item.ariaLabel,
      depth: item.depth ?? 0
    }));
    const order = this.config?.productOrder ?? items.map((item) => item.id);
    this.productModules = order
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is HomeSolutionItem => Boolean(item))
      .map((item) => this.toProductModule(item));
    const configured = items.some((item) => item.id === this.config?.initialItemId)
      ? this.config.initialItemId
      : items[0]?.id;
    this.activeDetailsIslandId = configured ?? null;
    if (this.activeIslandId && !items.some((item) => item.id === this.activeIslandId)) {
      this.activeIslandId = null;
    }
  }

  private toProductModule(item: HomeSolutionItem): ProductModule {
    return { id: item.id, title: item.moduleTitle, route: item.route, image: this.imageUrl(item.image), features: item.features };
  }

  private imageUrl(name: string): string {
    return name.startsWith('assets/') || name.startsWith('/') || /^https?:\/\//.test(name)
      ? name
      : this.commonFunctionService.BindURL_Image(name);
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
    if (this.stageRef && !this.reducedMotion && !this.frameRunning && !this.destroyed) {
      this.frameRunning = true;
      this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
    }
  }

  private readonly renderFrame = (): void => {
    if (!this.frameRunning || this.destroyed) return;
    this.applyTransforms();
    this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
  };

  private schedulePointerRender(): void {
    if (this.pointerFrameId !== undefined) return;
    this.pointerFrameId = window.requestAnimationFrame(() => {
      this.pointerFrameId = undefined;
      this.applyTransforms();
    });
  }

  private applyTransforms(): void {
    const stage = this.stageRef?.nativeElement;
    const section = this.sectionRef?.nativeElement;
    if (!stage || !section) return;
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
