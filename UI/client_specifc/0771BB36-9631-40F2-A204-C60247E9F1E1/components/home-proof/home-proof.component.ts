import { Component, Input } from '@angular/core';

import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { HomeCustomerLogo, HomeProofConfig, HomeTestimonial } from '../home-page-template/home-page-template.models';

@Component({ selector: 'app-home-proof', templateUrl: './home-proof.component.html', styleUrls: ['./home-proof.component.css'] })
export class HomeProofComponent {
  @Input() config!: HomeProofConfig;
  @Input() mode: 'all' | 'customers' | 'reviews' = 'all';
  readonly expandedTestimonials = new Set<number>();

  constructor(private readonly commonFunctionService: CommonFunctionService) {}

  get customers(): readonly HomeCustomerLogo[] { return this.config?.customers ?? []; }
  get testimonials(): readonly HomeTestimonial[] { return this.config?.testimonials ?? []; }
  get showCustomers(): boolean { return this.mode !== 'reviews'; }
  get showReviews(): boolean { return this.mode !== 'customers' && this.testimonials.length > 0; }
  get homeSection(): string | null { return this.mode === 'all' ? null : this.mode; }
  get customerRows(): readonly (readonly HomeCustomerLogo[])[] {
    return [0, 1, 2]
      .map(row => this.customers.filter((_, index) => index % 3 === row))
      .filter(row => row.length > 0);
  }

  imageUrl(name: string): string { return this.commonFunctionService.BindURL_Image(name); }

  toggleTestimonial(index: number): void {
    if (this.expandedTestimonials.has(index)) this.expandedTestimonials.delete(index);
    else this.expandedTestimonials.add(index);
  }
}
