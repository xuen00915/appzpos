import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { CommonFunctionService } from './common-function.service';

// Every request is intercepted: these tests must never send a real enquiry.
describe('Website enquiry API', () => {
  let api: ApiService;
  let http: HttpTestingController;
  const endpoint = 'https://appzpos.com/api/WebSiteController/SendEmail';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: CommonFunctionService, useValue: { BindURL_API: (path: string) => 'https://appzpos.com' + path } }]
    });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  for (const response of [{ APIResponse: { Message: '' } }, JSON.stringify({ APIResponse: { Message: '' } })]) {
    it('accepts the confirmed success envelope without changing the payload', () => {
      const success = jasmine.createSpy('success');
      const payload = { ContactUs: { Subject: 'Demo Enquiry', Name: 'Test Owner' } };
      api.sendWebsiteEmail(payload).subscribe({ next: success, error: fail });
      const req = http.expectOne(endpoint);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(success).not.toHaveBeenCalled();
      req.flush(response);
      expect(success).toHaveBeenCalledTimes(1);
    });
  }

  for (const response of [null, {}, '<html>Unavailable</html>', { APIResponse: { Message: 'Rejected' } }]) {
    it('rejects an unconfirmed or malformed response', () => {
      const error = jasmine.createSpy('error');
      api.sendWebsiteEmail({}).subscribe({ next: () => fail('Must not report success'), error });
      http.expectOne(endpoint).flush(response);
      expect(error).toHaveBeenCalledTimes(1);
    });
  }

  it('handles HTTP 503 without retrying or sending a duplicate enquiry', () => {
    const error = jasmine.createSpy('error');
    api.sendWebsiteEmail({}).subscribe({ next: () => fail('Must not report success'), error });
    http.expectOne(endpoint).flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });
    expect(error).toHaveBeenCalledTimes(1);
    http.expectNone(endpoint);
  });

  it('handles a network failure', () => {
    const error = jasmine.createSpy('error');
    api.sendWebsiteEmail({}).subscribe({ next: () => fail('Must not report success'), error });
    http.expectOne(endpoint).error(new ProgressEvent('error'));
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('cancels a stalled request after 15 seconds without retrying', fakeAsync(() => {
    const error = jasmine.createSpy('error');
    api.sendWebsiteEmail({}).subscribe({ next: () => fail('Must not report success'), error });
    const req = http.expectOne(endpoint);
    tick(14999);
    expect(error).not.toHaveBeenCalled();
    tick(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(req.cancelled).toBeTrue();
    http.expectNone(endpoint);
  }));
});
