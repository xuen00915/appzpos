import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { CustomIndustryRestoreStoreComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/retail-store-cloud-pos-system/retail-store-cloud-pos-system.component';
import { CustomIndustryBeautySalonsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/salon-cloud-pos-system/salon-cloud-pos-system.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('Static industry timelines', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomIndustryRestoreStoreComponent, CustomIndustryBeautySalonsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) }) } }
      ]
    });
  });

  it('renders the retail workflow as three static icon steps while retaining the full overview', () => {
    const fixture = TestBed.createComponent(CustomIndustryRestoreStoreComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('.industry-static-timeline__step').length).toBe(3);
    expect(root.querySelectorAll('.industry-static-timeline__heading i').length).toBe(3);
    expect(root.querySelectorAll('.industry-static-timeline__number')[0].textContent?.trim()).toBe('01');
    expect(root.querySelector<HTMLImageElement>('.restaurant-overview__diagram')?.getAttribute('src'))
      .toContain('APPZPOS-Point-of-Sale-Systems-for-Retail-floorpan.png');
    expect(root.querySelector('app-industry-islands')).toBeNull();
    fixture.destroy();
  });

  it('renders the salon workflow as seven static icon steps while retaining the full overview', () => {
    const fixture = TestBed.createComponent(CustomIndustryBeautySalonsComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('.industry-static-timeline__step').length).toBe(7);
    expect(root.querySelectorAll('.industry-static-timeline__heading i').length).toBe(7);
    expect(root.querySelectorAll('.industry-static-timeline__number')[6].textContent?.trim()).toBe('07');
    expect(root.querySelector<HTMLImageElement>('.restaurant-overview__diagram')?.getAttribute('src'))
      .toContain('APPZPOS-POS-System-for-Beauty-Salon-floorplan.png');
    expect(root.querySelector('app-industry-islands')).toBeNull();
    fixture.destroy();
  });
});
