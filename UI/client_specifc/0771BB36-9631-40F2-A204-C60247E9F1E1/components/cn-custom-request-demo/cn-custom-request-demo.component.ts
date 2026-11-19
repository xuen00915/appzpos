import { finalize } from 'rxjs';

import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ApiService } from '../../../../src/app/services/shared_function/api.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-cn-custom-request-demo',
  templateUrl: './cn-custom-request-demo.component.html',
  styleUrls: ['./cn-custom-request-demo.component.css']
})
export class CNCustomRequestDemoComponent implements OnInit{
    showSuccessMsg: boolean = false;
    successMsg: string = "";
    showErrorMsg:boolean =false;
    errorMsg:string = "";
    submitted = false;
    sending = false;

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

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }
 
  onSubmit( ):void {
    if (this.sending) return;
    this.showSuccessMsg = false;
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
      this.sending = true;
      this.apiService.sendWebsiteEmail(objRequestDemo).pipe(
        finalize(() => { this.sending = false; })
      ).subscribe({
        next: () => {
          this.showSuccessMsg = true;
          this.successMsg = "Successfully submitted !";
          Object.values(this.requestDemoForm.controls).forEach(control => control.setValue(''));
          this.submitted = false;
        },
        error: () => {
          this.showErrorMsg = true;
          this.errorMsg = '暂时无法确认您的咨询是否已提交。您填写的资料已保留，请稍后再试，或通过 WhatsApp 联系我们：+65 8310 9631。';
          this.submitted = false;
        }
      });
    }
  }
}
