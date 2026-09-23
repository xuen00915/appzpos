import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';

import { CustomHomeComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/index/index.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { HomeHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component';
import { HomePageTemplateComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component';

describe('APPZPOS preservation contract', () => {
  let fixture: ComponentFixture<CustomHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CustomHomeComponent, HomePageTemplateComponent, HomeHeroComponent],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
        { provide: Title, useValue: { setTitle: () => undefined } },
        { provide: Meta, useValue: { updateTag: () => undefined } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) }) } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(CustomHomeComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('keeps the existing homepage hero contract', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.appzpos-product-hero h1')?.textContent?.replace(/\s+/g, ' ').trim())
      .toBe('All-In-One POS System in Singapore with PSG Grant');
    expect(host.querySelector('.appzpos-product-hero__machine')).not.toBeNull();
    expect(host.querySelectorAll('.appzpos-product-hero [role="tab"]').length).toBe(4);
  });

  it('keeps request demo and WhatsApp conversion destinations', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(Array.from(host.querySelectorAll('button')).some((button) =>
      button.textContent?.trim() === 'Request a Demo')).toBeTrue();
    expect(host.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/6583109631"]')).not.toBeNull();
  });
});
