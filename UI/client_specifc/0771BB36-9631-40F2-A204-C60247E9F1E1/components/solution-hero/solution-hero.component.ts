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

