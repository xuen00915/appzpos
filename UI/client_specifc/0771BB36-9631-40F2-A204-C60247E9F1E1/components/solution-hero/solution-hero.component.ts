import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface SolutionHeroConfig {
  readonly headingId: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly scrollTargetId: string;
  readonly scrollLabel: string;
  readonly integrationTargetId: string;
  readonly integrationMobileTargetId: string;
  readonly integrationLabel: string;
}

@Component({
  selector: 'app-solution-hero',
  templateUrl: './solution-hero.component.html',
  styleUrls: ['./solution-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolutionHeroComponent {
  @Input({ required: true }) config!: SolutionHeroConfig;

  scrollToTarget(event: Event): void {
    this.scrollTo(event, this.config.scrollTargetId);
  }

  scrollToIntegration(event: Event): void {
    const targetId = window.matchMedia('(max-width: 768px)').matches
      ? this.config.integrationMobileTargetId
      : this.config.integrationTargetId;
    this.scrollTo(event, targetId);
  }

  private scrollTo(event: Event, targetId: string): void {
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }
}
