 import { Component, OnInit} from '@angular/core';
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
    message:new FormControl('')

  });

  constructor(private apiService: ApiService, private configService: ConfigService,private commonFunctionService: CommonFunctionService,private formBuilder:FormBuilder,private titleService: Title,private meta: Meta) { 
    this.configService.objConfigData.Configuration.WebsiteData.Template.Header.Bit_Client_Specific_Header = 1;
    this.titleService.setTitle("Request a Free Demo Today | POS Quote | Contact APPZPOS");

  }
  ngOnInit(): void {
   this.contactForm  = this.formBuilder.group(
 {
  fullname:['', [Validators.required, Validators.pattern('^[A-Za-z]|[\s]+')]],
  email:['',[Validators.required,Validators.email]],
  mobilenum:['',[Validators.required, Validators.pattern("^[+]?[0-9]*$")]],
  services:['',Validators.required],
  message:['',Validators.required],
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
  
  onSubmit( ):void{
    this.showErrorMsg =false;
    this.showSuccessMsg=false;
    this.submitted = true;
    if (this.contactForm.valid) { 
      var objParam: any = {};
      objParam.Subject ="Contact Enquiry";
      objParam.Message =this.contactForm.value.message;
      objParam.Name = this.contactForm.value.fullname;
      objParam.EmailAddress= this.contactForm.value.email;
      objParam.Phone = this.contactForm.value.mobilenum;
      objParam.Services = this.contactForm.value.services;
      var objectContact:any={};
      objectContact.ContactUs = objParam; 
      var objResponse: any = this.apiService.apiCallPOST_Sync("/api/WebSiteController/SendEmail", objectContact);
      var objAPIResponse: any = objResponse.__zone_symbol__value;
      if(JSON.parse(objAPIResponse).APIResponse.Message == ""){
        this.showSuccessMsg=true;
        this.successMsg="Successfully submitted !";
        (Object as any).values(this.contactForm.controls).forEach((control: FormControl) => {
          control.setValue("");
          this.submitted=false;
      }); 
      }
      else{
        this.showErrorMsg=true;
        this.errorMsg = JSON.parse(objAPIResponse).APIResponse.Message;
        this.submitted=false;
      }
    }  
  }
}
