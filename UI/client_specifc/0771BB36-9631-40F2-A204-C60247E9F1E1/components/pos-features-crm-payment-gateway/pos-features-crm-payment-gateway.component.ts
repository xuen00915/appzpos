import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ConfigService } from '../../../../src/app/services/shared_data/config.service';
import { ApiService } from '../../../../src/app/services/shared_function/api.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Meta, Title } from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';

@Component({
  selector: 'app-pos-features-crm-payment-gateway',
  templateUrl: './pos-features-crm-payment-gateway.component.html',
  styleUrls: ['./pos-features-crm-payment-gateway.component.css']
})
export class CustomFeaturesComponent implements OnInit{

  showSuccessMsg: boolean = false;
  successMsg: string = "";
  showErrorMsg:boolean =false;
  errorMsg:string = "";
  submitted = false;
  APIForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone:new FormControl(''),
    company:new FormControl(''),
    position:new FormControl('')

  });

  constructor(private apiService: ApiService, private configService: ConfigService,private commonFunctionService: CommonFunctionService,private formBuilder:FormBuilder,private titleService: Title,private meta: Meta,public dialog: MatDialog) { 
    this.configService.objConfigData.Configuration.WebsiteData.Template.Header.Bit_Client_Specific_Header = 1;
    this.titleService.setTitle("CRM | Smart Inventory | Payment Gateway - APPZPOS Features");
  };

  ngOnInit(): void {
    this.APIForm  = this.formBuilder.group(
      {
        firstname:['', [Validators.required, Validators.pattern('^[A-Za-z]|[\s]+')]],
        lastname:['', [Validators.required, Validators.pattern('^[A-Za-z]|[\s]+')]],
        email:['',[Validators.required,Validators.email]],
        phone:['',[Validators.required, Validators.pattern("^[+]?[0-9]*$")]],
        company:['',Validators.required],
        position:['',Validators.required],
      }
    )

    this.meta.updateTag({ 
        name: 'description',
        content: 'Multiple payment gateway, CRM, smart inventory, delivery integration, table management, sales analytics, and more features. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
 get objData(): { [key: string]: AbstractControl } {
  return this.APIForm.controls;
}

BindURL_Image(FileName: string): string {
  return this.commonFunctionService.BindURL_Image(FileName);
}
openDialog(): void {
  const dialogRef = this.dialog.open(ModalRequestDemoComponent, {
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}

onSubmit( ):void{
  this.showErrorMsg =false;
  this.showSuccessMsg=false;
  this.submitted = true;
  if (this.APIForm.valid) { 
    var objParam: any = {};
    objParam.Subject ="API Enquiry";
    objParam.FirstName =this.APIForm.value.firstname;
    objParam.LastName = this.APIForm.value.lastname;
    objParam.EmailAddress= this.APIForm.value.email;
    objParam.Phone = this.APIForm.value.phone;
    objParam.Company = this.APIForm.value.company;
    objParam.Position = this.APIForm.value.position;
    var objectAPI:any={};
    objectAPI.ContactUs = objParam; 
    var objResponse: any = this.apiService.apiCallPOST_Sync("/api/WebSiteController/SendEmail", objectAPI);
    var objAPIResponse: any = objResponse.__zone_symbol__value;
    if(JSON.parse(objAPIResponse).APIResponse.Message == ""){
      this.showSuccessMsg=true;
      this.successMsg="Successfully submitted !";
      (Object as any).values(this.APIForm.controls).forEach((control: FormControl) => {
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
