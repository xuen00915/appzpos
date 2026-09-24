import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  HomeCtaConfig,
  HomeHeroConfig,
  HomeHeroIndustry,
  HomeHeroVisual
} from '../home-page-template/home-page-template.models';

export type HeroTransitionPhase = 'settled' | 'breaking' | 'rebuilding';
type ProductShowcaseVisual = Extract<HomeHeroVisual, { kind: 'product-showcase' }>;
type ResponsiveImageVisual = Extract<HomeHeroVisual, { kind: 'responsive-image' }>;

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) config!: HomeHeroConfig;
  @Output() readonly requestDemo = new EventEmitter<void>();

  activeIndustry?: HomeHeroIndustry;
  activeIndustryId = '';
  transitionPhase: HeroTransitionPhase = 'settled';
  officialLogoVisible = true;

  private activeIndustryIndex = 0;
  private autoplayTimer?: ReturnType<typeof setInterval>;
  private transitionTimers: ReturnType<typeof setTimeout>[] = [];
  private autoplayStopped = false;
  private destroyed = false;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  get productVisual(): ProductShowcaseVisual | null {
    return this.config?.visual.kind === 'product-showcase' ? this.config.visual : null;
  }

  get responsiveVisual(): ResponsiveImageVisual | null {
    return this.config?.visual.kind === 'responsive-image' ? this.config.visual : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.resetFromConfig();
    }
  }

  ngOnInit(): void {
    if (!this.activeIndustry && this.productVisual) {
      this.resetFromConfig();
    }
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopAutoplay();
    this.clearTransitionTimers();
  }

  selectIndustry(id: string, manual = false): void {
    const industries = this.productVisual?.industries ?? [];
    if (manual) {
      this.autoplayStopped = true;
      this.stopAutoplay();
    }

    const nextIndex = industries.findIndex((industry) => industry.id === id);
    if (nextIndex < 0 || (id === this.activeIndustryId && this.transitionPhase === 'settled')) {
      return;
    }

    this.clearTransitionTimers();
    this.transitionPhase = 'breaking';

    this.scheduleTransition(() => {
      this.activeIndustryIndex = nextIndex;
      this.activeIndustry = industries[nextIndex];
      this.activeIndustryId = this.activeIndustry.id;
      this.transitionPhase = 'rebuilding';

      this.scheduleTransition(() => {
        this.transitionPhase = 'settled';
      }, 720);
    }, 480);
  }

  trackModule(_index: number, module: string): string {
    return module;
  }

  trackIndustry(_index: number, industry: HomeHeroIndustry): string {
    return industry.id;
  }

  handleCta(cta: HomeCtaConfig): void {
    if (cta.kind === 'action' && cta.action === 'request-demo') {
      this.requestDemo.emit();
    }
  }

  hideOfficialLogo(): void {
    this.officialLogoVisible = false;
  }

  private resetFromConfig(): void {
    this.stopAutoplay();
    this.clearTransitionTimers();
    this.activeIndustryIndex = 0;
    this.transitionPhase = 'settled';
    this.officialLogoVisible = true;
    const firstIndustry = this.productVisual?.industries[0];
    this.activeIndustry = firstIndustry;
    this.activeIndustryId = firstIndustry?.id ?? '';
    if (!this.autoplayStopped) {
      this.startAutoplay();
    }
  }

  private startAutoplay(): void {
    const industries = this.productVisual?.industries ?? [];
    if (this.autoplayStopped || this.autoplayTimer || industries.length < 2 || this.destroyed) {
      return;
    }

    this.autoplayTimer = setInterval(() => {
      const nextIndex = (this.activeIndustryIndex + 1) % industries.length;
      this.selectIndustry(industries[nextIndex].id);
    }, 7000);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  private scheduleTransition(callback: () => void, delay: number): void {
    const timer = setTimeout(() => {
      this.transitionTimers = this.transitionTimers.filter((candidate) => candidate !== timer);
      if (!this.destroyed) {
        callback();
        this.changeDetectorRef.markForCheck();
      }
    }, delay);
    this.transitionTimers.push(timer);
  }

  private clearTransitionTimers(): void {
    this.transitionTimers.forEach((timer) => clearTimeout(timer));
    this.transitionTimers = [];
  }
}
