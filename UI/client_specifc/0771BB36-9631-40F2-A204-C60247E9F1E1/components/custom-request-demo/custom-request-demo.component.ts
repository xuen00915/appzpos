import { LeadSpamError } from '../lead-spam-guard';
import { isMeasurementStaging } from '../../../../src/app/services/shared_function/staging-measurement';
import { Component, Input, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LeadSubmissionService } from '../lead-submission.service';

type RequestDemoLocale = 'en' | 'zh';

interface RequestDemoCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly intro: readonly string[];
  readonly nameLabel: string;
  readonly nameRequired: string;
  readonly nameInvalid: string;
  readonly emailLabel: string;
  readonly emailRequired: string;
  readonly emailInvalid: string;
  readonly mobileLabel: string;
  readonly mobileRequired: string;
  readonly mobileInvalid: string;
  readonly businessLabel: string;
  readonly businessRequired: string;
  readonly businessInvalid: string;
  readonly submitLabel: string;
}

const REQUEST_DEMO_COPY: Readonly<Record<RequestDemoLocale, RequestDemoCopy>> = {
  en: {
    eyebrow: 'REQUEST A DEMO',
    title: 'Request a Demo',
    lead: 'Discover the best pos system in Singapore to upgrade your business.',
    intro: ['Contact us and schedule a free POS demo today!'],
    nameLabel: 'Name',
    nameRequired: 'Name is required!',
    nameInvalid: 'Invalid Name!',
    emailLabel: 'Email',
    emailRequired: 'Email is required!',
    emailInvalid: 'Invalid Email!',
    mobileLabel: 'Phone / WhatsApp',
    mobileRequired: 'Mobile Number is required!',
    mobileInvalid: 'Mobile Number is not valid!',
    businessLabel: 'Business name (optional)',
    businessRequired: 'Restaurant Name is required!',
    businessInvalid: 'Invalid Restaurant Name!',
    submitLabel: 'Request a Demo'
  },
  zh: {
    eyebrow: '',
    title: '联系APPZPOS',
    lead: '新加坡最佳POS收银系统，协助您轻松管理餐厅业务。',
    intro: [
      '如果您想了解更多有关我们的POS方案和报价，或想预约免费的POS演示，',
      '欢迎通过WhatsApp联系我们+65 83109631，或填写以下表格。'
    ],
    nameLabel: '名字',
    nameRequired: '名字为必填项!',
    nameInvalid: '不合规名字!',
    emailLabel: '电子邮件地址',
    emailRequired: '电子邮件地址为必填项!',
    emailInvalid: '不合规电子邮件地址!',
    mobileLabel: '电话号码',
    mobileRequired: '电话号码为必填项!',
    mobileInvalid: '不合规电话号码!',
    businessLabel: '公司名字（选填）',
    businessRequired: '公司名字为必填项!',
    businessInvalid: '不合规公司名字!',
    submitLabel: '预约演示'
  }
};

@Component({
  selector: 'app-custom-request-demo',
  templateUrl: './custom-request-demo.component.html',
  styleUrls: ['./custom-request-demo.component.css']
})
export class CustomRequestDemoComponent {
  @Input() locale: RequestDemoLocale = 'en';
  /** Form-only presentation for landing pages: hides the eyebrow, lead and contact details. */
  @Input() compact = false;
  placement: 'embedded' | 'popup' = 'embedded';
  protected readonly leads = inject(LeadSubmissionService);
  protected readonly host = inject(ElementRef<HTMLElement>);
  private readonly builder = inject(FormBuilder);
  showSuccessMsg = false;
  successMsg = '';
  showErrorMsg = false;
  errorMsg = '';
  submitted = false;
  private readonly changeDetector = inject(ChangeDetectorRef);
  sending = false;
  requestDemoForm = this.builder.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    email: ['', [Validators.required, Validators.email]],
    mobilenum: ['', [Validators.required, Validators.pattern(/^[+]?[0-9 ()-]{6,20}$/)]],
    restaurant_name: [''],
    website_url: ['']
  });
  get objData(): { [key: string]: AbstractControl } { return this.requestDemoForm.controls; }
  get copy() { return REQUEST_DEMO_COPY[this.locale]; }
  onNoClick(): void {}
  async onSubmit(): Promise<void> {
    if (this.sending || this.showSuccessMsg) return;
    this.submitted = true;
    this.showErrorMsg = false;
    if (this.requestDemoForm.invalid) { this.requestDemoForm.markAllAsTouched(); return; }
    this.sending = true;
    const v = this.requestDemoForm.getRawValue();
    try {
      await this.leads.send({Subject: 'Demo Enquiry', Name: v.name.trim(), EmailAddress: v.email.trim(), Phone: v.mobilenum.trim(), RestaurantName: v.restaurant_name.trim()}, 'demo', this.placement, v.website_url);
      this.successMsg = this.locale === 'zh' ? '提交成功，正在转至确认页面。' : 'Successfully submitted! Opening your confirmation…';
      this.showSuccessMsg = !isMeasurementStaging();
      this.changeDetector.detectChanges();
      await this.leads.complete('demo', this.placement, this.host.nativeElement, () => this.onNoClick());
    } catch (error) {
      this.showErrorMsg = true;
      this.errorMsg = error instanceof LeadSpamError ? error.messageFor(this.locale) : this.locale === 'zh' ? '暂时无法发送，请重试。您输入的内容已保留。' : 'We could not send your request. Please try again. Your details have been kept.';
      this.sending = false;
      this.changeDetector.detectChanges();
    }
  }
}
