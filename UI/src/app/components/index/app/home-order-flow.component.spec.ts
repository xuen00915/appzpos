import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOrderFlowComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-order-flow/home-order-flow.component';

describe('HomeOrderFlowComponent', () => {
  let fixture: ComponentFixture<HomeOrderFlowComponent>;
  let originalMatchMedia: typeof window.matchMedia;

  const setReducedMotion = (matches: boolean) => {
    window.matchMedia = (() => ({
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true
    })) as typeof window.matchMedia;
  };

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    setReducedMotion(false);
    TestBed.configureTestingModule({
      declarations: [HomeOrderFlowComponent],
      imports: [CommonModule]
    });
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
  });

  afterEach(() => {
    fixture.destroy();
    window.matchMedia = originalMatchMedia;
  });

  it('renders seven indicators and the converging SVG scene', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.appzpos-order-flow__step').length).toBe(7);
    expect(host.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 1000 460');
    expect(host.querySelectorAll('[data-entry-route]').length).toBe(4);
    expect(host.querySelectorAll('[data-entry-figure]').length).toBe(4);
    expect(host.querySelector('[data-merged-figure]')).not.toBeNull();
    expect(host.querySelector('[data-delivery-figure]')).not.toBeNull();
  });

  it('shows the current title and exact bullets in the caption', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appzpos-order-flow__caption h3')?.textContent?.trim())
      .toBe('Table QR Ordering');
    expect(Array.from(host.querySelectorAll('.appzpos-order-flow__caption li'))
      .map((item) => item.textContent?.trim())).toEqual([
        'E-Menu Ordering - Customers scan a QR code to view the menu, and place orders from their phones',
        'Cost Savings - Reduce Printed Menu & dependence on manpower',
        'Online Payment - Multiple integrated payment options for customer to pay securely through mobile'
      ]);
  });

  it('renders only the complete static list when reduced motion is requested', () => {
    fixture.destroy();
    setReducedMotion(true);
    fixture = TestBed.createComponent(HomeOrderFlowComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appzpos-order-flow__scroll')).toBeNull();
    expect(host.querySelectorAll('.appzpos-order-flow__static-step').length).toBe(7);
    expect(host.textContent).toContain(
      'Real-time Overview Report - Easily monitor all your delivery, online and in-store orders in one POS system'
    );
  });
});
