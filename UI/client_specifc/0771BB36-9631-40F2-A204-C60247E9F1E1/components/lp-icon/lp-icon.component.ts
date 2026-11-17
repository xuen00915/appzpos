import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type LpIconName =
  | 'star' | 'users' | 'percent' | 'layers' | 'package' | 'pin'
  | 'clipboard' | 'play' | 'headset' | 'store' | 'cloud' | 'chart' | 'monitor' | 'chevron';

/**
 * Decorative inline SVG icon set for the landing page (24px grid, 1.8 stroke).
 * Icons are aria-hidden; always pair them with visible text.
 */
@Component({
  selector: 'app-lp-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"
         [attr.fill]="name === 'star' ? 'currentColor' : 'none'" stroke="currentColor"
         [attr.stroke-width]="name === 'star' ? 0 : 1.8" stroke-linecap="round" stroke-linejoin="round">
      <ng-container [ngSwitch]="name">
        <path *ngSwitchCase="'star'" d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9z"/>
        <ng-container *ngSwitchCase="'users'"><circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.7a3.4 3.4 0 010 6.6M18.5 14.4A6.5 6.5 0 0121.5 20"/></ng-container>
        <ng-container *ngSwitchCase="'percent'"><path d="M19 5L5 19"/><circle cx="7.2" cy="7.2" r="2.6"/><circle cx="16.8" cy="16.8" r="2.6"/></ng-container>
        <ng-container *ngSwitchCase="'layers'"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 16.5l9 5 9-5"/></ng-container>
        <ng-container *ngSwitchCase="'package'"><path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></ng-container>
        <ng-container *ngSwitchCase="'pin'"><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></ng-container>
        <ng-container *ngSwitchCase="'clipboard'"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 12h6M9 16h4"/></ng-container>
        <ng-container *ngSwitchCase="'play'"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M10 8.3l5 2.7-5 2.7z"/><path d="M8 21h8"/></ng-container>
        <ng-container *ngSwitchCase="'headset'"><path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20a3 3 0 01-3 2h-3"/></ng-container>
        <ng-container *ngSwitchCase="'store'"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/><path d="M10 20v-5h4v5"/></ng-container>
        <path *ngSwitchCase="'cloud'" d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0118 10.5 3.75 3.75 0 0117.25 18z"/>
        <ng-container *ngSwitchCase="'chart'"><path d="M4 4v16h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/></ng-container>
        <ng-container *ngSwitchCase="'monitor'"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></ng-container>
        <path *ngSwitchCase="'chevron'" d="M6 9l6 6 6-6"/>
      </ng-container>
    </svg>
  `,
  styles: [':host { display: inline-flex; width: 1em; height: 1em; line-height: 0; } svg { width: 100%; height: 100%; }']
})
export class LpIconComponent {
  @Input() name: LpIconName = 'star';
}
