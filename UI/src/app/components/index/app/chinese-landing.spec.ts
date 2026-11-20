import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CustomHomeCNComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';

describe('APPZPOS Chinese landing page', () => {
  let fixture: ComponentFixture<CustomHomeCNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomHomeCNComponent],
      providers: [
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } },
        { provide: Title, useValue: { setTitle: () => undefined } },
        { provide: Meta, useValue: { updateTag: () => undefined } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(undefined) }) } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(CustomHomeCNComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('renders the English landing-page POS diagram instead of the legacy banner image', () => {
    const host = fixture.nativeElement as HTMLElement;
    const hero = host.querySelector<HTMLElement>('.appzpos-product-hero');
    const terminal = hero?.querySelector<HTMLImageElement>('.appzpos-product-hero__machine > img');

    expect(hero).not.toBeNull();
    expect(terminal?.getAttribute('src')).toBe('assets/images/appzpos-pos-terminal-hardware-only.png');
    expect(hero?.querySelector('.appzpos-software-screen')).not.toBeNull();
    expect(host.querySelector('#slider')).toBeNull();
  });

  it('places the shared ordering-flow diagram between the hero and Chinese content', () => {
    const host = fixture.nativeElement as HTMLElement;
    const hero = host.querySelector<HTMLElement>('.appzpos-product-hero');
    const orderFlow = host.querySelector<HTMLElement>('app-home-order-flow');

    expect(orderFlow).not.toBeNull();
    expect(orderFlow?.previousElementSibling).toBe(hero);
    expect(orderFlow?.nextElementSibling?.id).toBe('content');
  });

  it('keeps the original floating contact artwork and legacy link tagging', () => {
    const host = fixture.nativeElement as HTMLElement;
    const whatsapp = host.querySelector<HTMLAnchorElement>('#webview a.btn-whatsapp');
    const messenger = host.querySelector<HTMLAnchorElement>('#webview a.btn-fb');

    expect(whatsapp).not.toBeNull();
    expect(whatsapp?.getAttribute('href')).toBe(
      "https://wa.me/6583109631?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(whatsapp?.target).toBe('_blank');
    expect(whatsapp?.rel.split(/\s+/)).toContain('noopener');
    expect(whatsapp?.querySelector('img')?.getAttribute('src')).toBe('/images/APPZPOS Point of Sales WhatsApp Us.png');
    expect(whatsapp?.querySelector('img')?.alt).toBe('APPZPOS Point of Sales WhatsApp Us');
    expect(whatsapp?.querySelector('img')?.loading).toBe('lazy');

    expect(messenger).not.toBeNull();
    expect(messenger?.getAttribute('href')).toBe(
      "http://m.me/APPZPOS?text=I'm%20interested%20in%20APPZPOS%20POS%20System%20for%20my%20Business!"
    );
    expect(messenger?.target).toBe('_blank');
    expect(messenger?.rel.split(/\s+/)).toContain('noopener');
    expect(messenger?.querySelector('img')?.getAttribute('src')).toBe('/images/APPZPOS Point of Sales Messenger Us.png');
    expect(messenger?.querySelector('img')?.alt).toBe('APPZPOS Point of Sales Messenger Us');
    expect(messenger?.querySelector('img')?.loading).toBe('lazy');
  });
});
