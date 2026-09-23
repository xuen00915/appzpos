import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';

import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { HomeHeroComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-hero/home-hero.component';
import { HomePageTemplateComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/home-page-template/home-page-template.component';
import { CNModalRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-modal-request-demo/cn-modal-request-demo.component';
import { CustomHomeCNComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-f&b-restaurant-cloud-pos-system/cn-f&b-restaurant-cloud-pos-system.component';

describe('CustomHomeCNComponent', () => {
  let component: CustomHomeCNComponent;
  let fixture: ComponentFixture<CustomHomeCNComponent>;
  let title: jasmine.SpyObj<Title>;
  let meta: jasmine.SpyObj<Meta>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    title = jasmine.createSpyObj('Title', ['setTitle']);
    meta = jasmine.createSpyObj('Meta', ['updateTag']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    dialog.open.and.returnValue({ afterClosed: () => ({ subscribe: () => undefined }) } as any);

    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CustomHomeCNComponent, HomePageTemplateComponent, HomeHeroComponent],
      providers: [
        { provide: Title, useValue: title },
        { provide: Meta, useValue: meta },
        { provide: MatDialog, useValue: dialog },
        { provide: CommonFunctionService, useValue: { BindURL_Image: (name: string) => `/images/${name}` } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CustomHomeCNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('keeps the exact Chinese metadata and request-demo behavior', () => {
    expect(title.setTitle).toHaveBeenCalledWith('APPZPOS云端智能POS餐饮系统 收银系统 | 新加坡餐厅运营首选');
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: '收银机、电子点餐、网站点餐、扫码点餐、自助点餐机、KDS厨房系统、排队叫号系统和外卖订单中心。高达50%政府津贴折扣！立即联系我们 +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });

    component.openDialog();
    expect(dialog.open).toHaveBeenCalledWith(CNModalRequestDemoComponent, { width: '600px' });
  });

  it('renders one shared-template hero with the original Chinese copy and CTA destinations', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('app-home-page-template')).not.toBeNull();
    expect(host.querySelectorAll('h1').length).toBe(1);
    expect(host.querySelector('h1')?.textContent).toContain('APPZPOS POS系统云端智能POS餐饮系统高达50%政府津贴折扣');
    expect(host.textContent).toContain('专为餐饮业者设计的全方位餐饮系统，包括收银系统、销售报告分析、会员管理、库存管理、促销优惠，运营流程等');
    expect(host.textContent).toContain('预约免费演示');
    expect(host.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/"]')?.textContent).toContain('WhatsApp联系我们');
  });

  it('maps every existing Chinese section without English homepage fallback content', () => {
    const config = (component as any).pageConfig;
    expect(config.language).toBe('zh');
    expect(config.solutions.items.map((item: any) => item.title)).toEqual([
      '收银机 / 电子点餐', '网站 点餐', '扫码 点餐', '自助 点餐机',
      '排队叫号 系统', 'KDS厨房 系统', '外卖订单 中心'
    ]);
    expect(config.solutions.items.map((item: any) => item.route)).toEqual([
      '/cloud-pos-point-of-sales-system', '/f&b-restaurant-online-ordering-website',
      '/f&b-restaurant-emenu-qr-code-ordering-system', '/self-order-kiosk-restaurant',
      '/f&b-restaurant-queue-number-display-system', '/f&b-restaurant-kitchen-display-system',
      '/f&b-restaurant-delivery-integration'
    ]);
    expect(config.storySections.length).toBe(2);
    expect(config.grant.title).toBe('享受高达50%的政府津贴');
    expect(config.features.items.length).toBe(6);
    expect(config.proof.customersTitle).toBe('我们的客户');
    expect(new Set(config.proof.customers.map((customer: any) => customer.image)).size).toBe(76);
    expect(config.proof.testimonials).toEqual([]);
    expect(config.industries).toBeUndefined();
    expect(config.conversion).toEqual({ locale: 'zh', sectionId: 'requestdemo' });
    expect(JSON.stringify(config)).not.toContain('Everything Works Together');
    expect(JSON.stringify(config)).not.toContain('Our Commitment to Local Excellence');
  });

  it('does not retain duplicate legacy view ids', () => {
    const host = fixture.nativeElement as HTMLElement;
    const ids = Array.from(host.querySelectorAll<HTMLElement>('[id]')).map(element => element.id);
    expect(ids.length).toBe(new Set(ids).size);
    expect(host.querySelector('#webview')).toBeNull();
    expect(host.querySelector('#mobile_view')).toBeNull();
    expect(host.querySelector('#requestdemo app-custom-request-demo')).not.toBeNull();
    expect(host.querySelector('app-cn-custom-request-demo')).toBeNull();
  });
});
