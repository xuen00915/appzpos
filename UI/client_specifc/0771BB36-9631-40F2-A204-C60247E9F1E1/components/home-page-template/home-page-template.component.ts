import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { HomeCtaConfig, HomePageTemplateConfig } from './home-page-template.models';

@Component({
  selector: 'app-home-page-template',
  templateUrl: './home-page-template.component.html',
  styleUrls: ['./home-page-template.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageTemplateComponent {
  @Input({ required: true }) config!: HomePageTemplateConfig;
  @Output() readonly requestDemo = new EventEmitter<void>();

  handleAction(cta: HomeCtaConfig): void {
    if (cta.kind === 'action' && cta.action === 'request-demo') {
      this.requestDemo.emit();
    }
  }
}
