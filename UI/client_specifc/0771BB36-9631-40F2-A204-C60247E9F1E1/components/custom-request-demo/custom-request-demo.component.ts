
import { Component, Input, OnInit  } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ApiService } from '../../../../src/app/services/shared_function/api.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var $: any;

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
    title: 'Request For Demo',
    lead: 'Discover the best pos system in Singapore to upgrade your business.',
    intro: ['Contact us and schedule a free POS demo today!'],
    nameLabel: 'Name',
    nameRequired: 'Name is required!',
    nameInvalid: 'Invalid Name!',
    emailLabel: 'Email',
    emailRequired: 'Email is required!',
    emailInvalid: 'Invalid Email!',
    mobileLabel: 'Mobile Number',
    mobileRequired: 'Mobile Number is required!',
    mobileInvalid: 'Mobile Number is not valid!',
    businessLabel: 'Restaurant Name',
    businessRequired: 'Restaurant Name is required!',
    businessInvalid: 'Invalid Restaurant Name!',
    submitLabel: 'Submit'
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
    businessLabel: '公司名字',
    businessRequired: '公司名字为必填项!',
    businessInvalid: '不合规公司名字!',
    submitLabel: 'Submit'
  }
};

@Component({
  selector: 'app-custom-request-demo',
  templateUrl: './custom-request-demo.component.html',
  styleUrls: ['./custom-request-demo.component.css']
})
export class CustomRequestDemoComponent implements OnInit{
    @Input() locale: RequestDemoLocale = 'en';

    showSuccessMsg: boolean = false;
    successMsg: string = "";
    showErrorMsg:boolean =false;
    errorMsg:string = "";
    submitted = false;

    requestDemoForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      mobilenum:new FormControl(''),
      restaurant_name:new FormControl('')
    });
  constructor(private apiService: ApiService, private commonFunctionService: CommonFunctionService,private formBuilder:FormBuilder) { 
  }
  ngOnInit(): void {
    this.requestDemoForm  = this.formBuilder.group(
      {
        name:['',[ Validators.required, Validators.pattern('^[A-Za-z]|[\s]+')]],
       email:['',[Validators.required,Validators.email]],
       mobilenum:['',[Validators.required, Validators.pattern("^[+]?[0-9]*$")]],
       restaurant_name:['',Validators.required],
      })
  }
  get objData(): { [key: string]: AbstractControl } {
    return this.requestDemoForm.controls;
  }

  get copy() {
    return REQUEST_DEMO_COPY[this.locale];
  }

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
 
  onSubmit( ):void { 
    this.showErrorMsg =false; 
    this.submitted = true;   
 
    if(this.requestDemoForm.valid){
      var objParam: any = {};
      objParam.Subject ="Demo Enquiry";
      objParam.RestaurantName = this.requestDemoForm.value.restaurant_name;
      objParam.Name = this.requestDemoForm.value.name;
      objParam.EmailAddress= this.requestDemoForm.value.email;
      objParam.Phone = this.requestDemoForm.value.mobilenum; 
      var objRequestDemo:any={};
      objRequestDemo.ContactUs = objParam;
      var objResponse: any = this.apiService.apiCallPOST_Sync("/api/WebSiteController/SendEmail", objRequestDemo);
      var objAPIResponse: any = objResponse.__zone_symbol__value;
      if(JSON.parse(objAPIResponse).APIResponse.Message == ""){
        this.showSuccessMsg=true;
        this.successMsg="Successfully submitted !";     
        (Object as any).values(this.requestDemoForm.controls).forEach((control: FormControl) => {
          control.setValue("");
      });
      this.submitted=false;   
      }
      else{
        this.showErrorMsg=true;
        this.errorMsg = JSON.parse(objAPIResponse).APIResponse.Message;
        this.submitted=false;
      } 
    } 
  }
}
