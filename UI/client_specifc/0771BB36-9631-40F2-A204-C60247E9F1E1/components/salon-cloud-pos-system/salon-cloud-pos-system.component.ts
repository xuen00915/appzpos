import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';
 
@Component({
  selector: 'app-salon-cloud-pos-system',
  templateUrl: './salon-cloud-pos-system.component.html',
  styleUrls: ['./salon-cloud-pos-system.component.css']
})
export class CustomIndustryBeautySalonsComponent  {
  
  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta,public dialog: MatDialog) {
   
    this.titleService.setTitle("Cloud POS System for Salons | APPZPOS Point of Sales");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Elevate your Salon Operations - Manage / schedule appointments, streamline transactions, incorporate loyalty memberships. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
 openDialog(): void {
  const dialogRef = this.dialog.open(ModalRequestDemoComponent, {
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}
}
