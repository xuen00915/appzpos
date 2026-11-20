import { LeadSpamError } from '../lead-spam-guard';
import { isMeasurementStaging } from '../../../../src/app/services/shared_function/staging-measurement';
import { LeadSubmissionService } from '../lead-submission.service';
 import { Component, OnInit, ElementRef, ChangeDetectorRef, inject} from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ConfigService } from '../../../../src/app/services/shared_data/config.service';
import { ApiService } from '../../../../src/app/services/shared_function/api.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {  CustomvalidationService } from 'src/app/services/shared_function/custom-validation.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({ 
  selector: 'app-point-of-sales-demo-quotation',
  templateUrl: './point-of-sales-demo-quotation.component.html',
  styleUrls: ['./point-of-sales-demo-quotation.component.css']
})
export class CustomContactComponent implements OnInit{
  private readonly leads = inject(LeadSubmissionService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly stagingMeasurement = isMeasurementStaging();
  sending = false;
 
  showSuccessMsg: boolean = false;
  successMsg: string = "";
  showErrorMsg:boolean =false;
  errorMsg:string = "";
  submitted = false;
  contactForm = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl(''),
    mobilenum:new FormControl(''),
    services:new FormControl(''),
    message:new FormControl(''),
    restaurant_name: new FormControl(''),
    website_url: new FormControl('')

  });

  constructor(private apiService: ApiService, private configService: ConfigService,private commonFunctionService: CommonFunctionService,private formBuilder:FormBuilder,private titleService: Title,private meta: Meta) { 
    this.configService.objConfigData.Configuration.WebsiteData.Template.Header.Bit_Client_Specific_Header = 1;
    this.titleService.setTitle("Request a Free Demo Today | POS Quote | Contact APPZPOS");

  }
  ngOnInit(): void {
   this.contactForm  = this.formBuilder.group(
 {
  fullname:['', [Validators.required, Validators.pattern(/.*\S.*/)]],
  email:['',[Validators.required,Validators.email]],
  mobilenum:['',[Validators.required, Validators.pattern(/^[+]?[0-9 ()-]{6,20}$/)]],
  services:['',Validators.required],
  message:[''],
  restaurant_name:[''],
  website_url:[''],
 }

   )
   this.meta.updateTag({
    name: 'description',
    content: "Singapore #1 POS System Vendor. Contact us now for a Free Quotation or schedule a POS Demo. Call /  WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏"
});
  }
 
  get objData(): { [key: string]: AbstractControl } {
    return this.contactForm.controls;
  }

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
  
  scrollToTop(): void {
    // Reuse the existing control so its click handler and tracking still run.
    document.getElementById('gotoTop')?.click();
  }

  async onSubmit(): Promise<void> {
    if (this.sending || this.showSuccessMsg) return;
    this.showErrorMsg = false;
    this.submitted = true;
    if (this.contactForm.invalid) { this.contactForm.markAllAsTouched(); return; }
    this.sending = true;
    const v = this.contactForm.getRawValue();
    try {
      await this.leads.send({Subject:'Contact Enquiry', Name:(v.fullname || '').trim(), EmailAddress:(v.email || '').trim(), Phone:(v.mobilenum || '').trim(), Services:v.services || '', Message:v.message || '', RestaurantName:v.restaurant_name || ''}, 'contact', 'page', v.website_url || '');
      this.successMsg = 'Successfully submitted! Opening your confirmation…';
      this.showSuccessMsg = !isMeasurementStaging();
      this.changeDetector.detectChanges();
      await this.leads.complete('contact', 'page', this.host.nativeElement);
    } catch (error) {
      this.sending = false;
      this.showErrorMsg = true;
      this.errorMsg = error instanceof LeadSpamError ? error.messageFor() : 'We could not send your enquiry. Please try again. Your details have been kept.';
      this.changeDetector.detectChanges();
    }
  }
}
