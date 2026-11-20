import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ConfigService } from '../../../../src/app/services/shared_data/config.service';
import { Meta, Title } from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';

@Component({
  selector: 'app-pos-features-crm-payment-gateway',
  templateUrl: './pos-features-crm-payment-gateway.component.html',
  styleUrls: ['./pos-features-crm-payment-gateway.component.css']
})
export class CustomFeaturesComponent implements OnInit{

  constructor(private configService: ConfigService,private commonFunctionService: CommonFunctionService,private titleService: Title,private meta: Meta,public dialog: MatDialog) { 
    this.configService.objConfigData.Configuration.WebsiteData.Template.Header.Bit_Client_Specific_Header = 1;
    this.titleService.setTitle("CRM | Smart Inventory | Payment Gateway - APPZPOS Features");
  };

  ngOnInit(): void {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Multiple payment gateway, CRM, smart inventory, delivery integration, table management, sales analytics, and more features. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
BindURL_Image(FileName: string): string {
  return this.commonFunctionService.BindURL_Image(FileName);
}
openDialog(): void {
  const dialogRef = this.dialog.open(ModalRequestDemoComponent, {
      id: 'mat-mdc-dialog-0',
    width: '600px',
    panelClass: 'appz-demo-dialog',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}

}
