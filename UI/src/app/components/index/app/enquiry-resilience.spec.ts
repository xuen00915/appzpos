import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/shared_function/api.service';
import { CommonFunctionService } from '../../../services/shared_function/common-function.service';
import { ConfigService } from '../../../services/shared_data/config.service';
import { CustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/custom-request-demo/custom-request-demo.component';
import { ModalRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/modal-request-demo/modal-request-demo.component';
import { CNCustomRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-custom-request-demo/cn-custom-request-demo.component';
import { CNModalRequestDemoComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/cn-modal-request-demo/cn-modal-request-demo.component';
import { CustomContactComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/point-of-sales-demo-quotation/point-of-sales-demo-quotation.component';
import { CustomFeaturesComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/pos-features-crm-payment-gateway/pos-features-crm-payment-gateway.component';

const endpoint = 'https://appzpos.com/api/WebSiteController/SendEmail';
const demoValues = { name: 'Test Owner', email: 'owner@example.com', mobilenum: '+6591234567', restaurant_name: 'Test Cafe' };
for (const kind of ['shared demo', 'demo modal', 'Chinese demo', 'Chinese modal', 'contact', 'API enquiry']) {
  describe(`${kind} form API failure recovery`, () => {
    let component: any;
    let form: any;
    let http: HttpTestingController;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [{ provide: CommonFunctionService, useValue: { BindURL_API: (path: string) => 'https://appzpos.com' + path } }]
      });
      const api = TestBed.inject(ApiService);
      const common = TestBed.inject(CommonFunctionService);
      const config = TestBed.inject(ConfigService);
      const builder = new FormBuilder();
      const dialog: any = { close() {} };
      const title: any = { setTitle() {} };
      const meta: any = { updateTag() {} };
      http = TestBed.inject(HttpTestingController);
      switch (kind) {
        case 'shared demo': component = new CustomRequestDemoComponent(api, common, builder); break;
        case 'demo modal': component = new ModalRequestDemoComponent(api, common, builder, dialog); break;
        case 'Chinese demo': component = new CNCustomRequestDemoComponent(api, common, builder); break;
        case 'Chinese modal': component = new CNModalRequestDemoComponent(api, common, builder, dialog); break;
        case 'contact': component = new CustomContactComponent(api, config, common, builder, title, meta); break;
        default: component = new CustomFeaturesComponent(api, config, common, builder, title, meta, dialog);
      }
      component.ngOnInit();
      form = component.requestDemoForm || component.contactForm || component.APIForm;
      form.setValue(kind === 'contact'
        ? { fullname: 'Test Owner', email: 'owner@example.com', mobilenum: '+6591234567', services: 'POS', message: 'Demo please' }
        : kind === 'API enquiry'
          ? { firstname: 'Test', lastname: 'Owner', email: 'owner@example.com', phone: '+6591234567', company: 'Test Cafe', position: 'Owner' }
          : demoValues);
    });
    afterEach(() => http.verify());

    it('keeps entered details on HTTP failure and permits a successful retry', () => {
      const before = { ...form.value };
      component.onSubmit();
      expect(component.sending).toBeTrue();
      component.onSubmit(); // Double click must not send twice.
      http.expectOne(endpoint).flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });
      expect(component.sending).toBeFalse();
      expect(component.showErrorMsg).toBeTrue();
      expect(component.showSuccessMsg).toBeFalse();
      expect(component.errorMsg).toContain('WhatsApp');
      expect(component.errorMsg).toContain('+65 8310 9631');
      expect(form.value).toEqual(before);
      component.onSubmit();
      expect(component.showErrorMsg).toBeFalse();
      http.expectOne(endpoint).flush(JSON.stringify({ APIResponse: { Message: '' } }));
      expect(component.sending).toBeFalse();
      expect(component.showSuccessMsg).toBeTrue();
      expect(Object.values(form.value).every(value => value === '')).toBeTrue();
    });

    it('keeps entered details after an unexpected successful HTTP response', () => {
      const before = { ...form.value };
      component.onSubmit();
      http.expectOne(endpoint).flush({ maintenance: true });
      expect(component.showSuccessMsg).toBeFalse();
      expect(component.showErrorMsg).toBeTrue();
      expect(component.sending).toBeFalse();
      expect(form.value).toEqual(before);
    });

    it('releases the pending state after a timeout without clearing the form', fakeAsync(() => {
      const before = { ...form.value };
      component.onSubmit();
      const request = http.expectOne(endpoint);
      tick(15000);
      expect(request.cancelled).toBeTrue();
      expect(component.sending).toBeFalse();
      expect(component.showErrorMsg).toBeTrue();
      expect(form.value).toEqual(before);
      http.expectNone(endpoint);
    }));

    it('does not send an invalid form', () => {
      form.controls.email.setValue('invalid');
      component.onSubmit();
      http.expectNone(endpoint);
      expect(component.sending).toBeFalse();
    });
  });
}
