import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeEcosystemComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-ecosystem/home-ecosystem.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('HomeEcosystemComponent', () => {
  let fixture: ComponentFixture<HomeEcosystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeEcosystemComponent],
      imports: [CommonModule],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomeEcosystemComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('replaces the hardware text link with the real APPZPOS WhatsApp action', () => {
    const hardware = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.ecosystem__hardware-copy')!;
    const action = hardware.querySelector<HTMLAnchorElement>('[data-hardware-whatsapp]');

    expect(action).not.toBeNull();
    expect(action?.textContent?.replace(/\s+/g, ' ').trim()).toBe('WhatsApp Us');
    expect(action?.getAttribute('href')).toBe(
      "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(action?.getAttribute('target')).toBe('_blank');
    expect(hardware.textContent).not.toContain('Contact us to explore the ideal solutions for your business.');
  });

  it('keeps the stacked grant concise without repeating its funding message', () => {
    const grant = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.ecosystem__grant')!;
    const normalizedText = grant.textContent?.replace(/\s+/g, ' ').trim();

    expect(grant.querySelector('.ecosystem__grant-visual')).not.toBeNull();
    expect(grant.querySelector('.ecosystem__grant-copy')).not.toBeNull();
    expect(grant.querySelector('.appz-kicker')).toBeNull();
    expect(grant.querySelector('.ecosystem__grant-rate')).toBeNull();
    expect(grant.querySelector('h2')?.textContent).toContain('Up to 50% Monetary Support');
    expect(grant.querySelector('h2')?.textContent).toContain('To Kickstart To Your F&B Business');
    expect(normalizedText).toContain(
      'SMEs are eligible for up to 50% Productivity Solutions Grant (PSG) support for the adoption of APPZPOS F&B Point of Sales, a Pre-Approved Solution under the IMDA SMEs Go Digital programme.'
    );
    expect(normalizedText).toContain('Learn More');
  });
});
