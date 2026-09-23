import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

export interface IndustryIsland {
  id: string;
  title: string;
  hitArea: string;
  floorArea?: string;
  description: string;
  solutions: readonly { title: string; href: string }[];
}

/** Retains projected page content, forms and analytics bindings unchanged. */
@Component({
  selector: 'app-industry-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  styles: [':host { display: block; min-width: 0; }']
})
export class IndustryPageComponent {}

@Component({
  selector: 'app-industry-islands',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './industry-islands.component.html',
  styleUrls: ['./industry-islands.component.css']
})
export class IndustryIslandsComponent implements OnChanges {
  // Select only the original artwork's #f7f7f7 floor, not white labels or coloured objects.
  readonly floorColourKey = Array.from({ length: 256 }, (_, value) => value === 247 ? '1' : '0').join(' ');
  @Input({ required: true }) islands: readonly IndustryIsland[] = [];
  @Input({ required: true }) imageSrc = '';
  @Input() imageAlt = '';
  @Input() idPrefix = 'industry';
  @Input() interactive = true;
  @Input() showDetails = true;
  @Input() highlightedIds: readonly string[] = [];
  @Input() focusId = '';
  @Input() focusOnSelect = false;
  get cameraId(): string { return this.focusOnSelect && this.selectedId ? this.selectedId : this.focusId; }
  selectedId = '';

  get camera(): { x: number; y: number; scale: number } {
    const island = this.islands.find(item => item.id === this.cameraId);
    const points = Array.from((island?.hitArea || '').matchAll(/([\d.]+)% ([\d.]+)%/g),
      point => [Number(point[1]), Number(point[2])]);
    if (!points.length) return { x: 50, y: 50, scale: 1 };
    const left = Math.min(...points.map(point => point[0]));
    const right = Math.max(...points.map(point => point[0]));
    const top = Math.min(...points.map(point => point[1]));
    const bottom = Math.max(...points.map(point => point[1]));
    return {
      x: (left + right) / 2, y: (top + bottom) / 2,
      scale: Math.min(2, 88 / Math.max(1, right - left), 88 / Math.max(1, bottom - top))
    };
  }

  get cameraTransform(): string | null {
    if (!this.cameraId) return null;
    const { x, y, scale } = this.camera;
    return `translate(${(50 - x) * scale}%, ${(50 - y) * scale}%) scale(${scale})`;
  }

  get activeIsland(): IndustryIsland | undefined {
    return this.islands.find(island => island.id === this.selectedId) || this.islands[0];
  }

  ngOnChanges(): void { this.selectedId = ''; }
  select(island: IndustryIsland): void { if (this.interactive) this.selectedId = island.id; }
}
