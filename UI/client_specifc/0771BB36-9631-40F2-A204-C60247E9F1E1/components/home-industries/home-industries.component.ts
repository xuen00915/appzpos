import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { HomeIndustrySectionConfig, HomeIndustryStory } from '../home-page-template/home-page-template.models';

@Component({ selector: 'app-home-industries', templateUrl: './home-industries.component.html', styleUrls: ['./home-industries.component.css'] })
export class HomeIndustriesComponent {
  @Input() config!: HomeIndustrySectionConfig;
  activeIndex = 0;
  @ViewChild('industryViewport') industryViewport?: ElementRef<HTMLElement>;

  constructor(private readonly commonFunctionService: CommonFunctionService) {}
  get stories(): readonly HomeIndustryStory[] { return this.config?.stories ?? []; }
  get activeStory(): HomeIndustryStory { return this.stories[this.activeIndex]; }
  imageUrl(name: string): string { return this.commonFunctionService.BindURL_Image(name); }
  isModuleActive(id: string): boolean { return this.activeStory?.modules.includes(id) ?? false; }
  select(index: number): void {
    this.activeIndex = Math.max(0, Math.min(this.stories.length - 1, Math.round(index)));
    this.alignSlide();
  }
  @HostListener('window:resize')
  alignSlide(): void {
    const viewport = this.industryViewport?.nativeElement;
    if (viewport) viewport.scrollLeft = this.activeIndex * viewport.clientWidth;
  }
  onScroll(): void {
    const viewport = this.industryViewport?.nativeElement;
    if (viewport?.clientWidth) this.activeIndex = Math.max(0, Math.min(this.stories.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)));
  }
  moduleTitle(id: string): string { return this.config.modules.find(module => module.id === id)?.title ?? id; }
  handleKeys(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') this.select(0);
    else if (event.key === 'End') this.select(this.stories.length - 1);
    else this.select(this.activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
}
