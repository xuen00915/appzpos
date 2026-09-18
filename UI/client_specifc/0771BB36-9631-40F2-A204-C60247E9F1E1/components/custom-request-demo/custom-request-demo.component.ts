
import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ApiService } from '../../../../src/app/services/shared_function/api.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-custom-request-demo',
  templateUrl: './custom-request-demo.component.html',
  styleUrls: ['./custom-request-demo.component.css']
})
export class CustomRequestDemoComponent implements OnInit{
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
