import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';



@Component({
  selector: 'app-pos-solutions-partner-integrations',
  templateUrl: './pos-solutions-partner-integrations.component.html',
  styleUrls: ['./pos-solutions-partner-integrations.component.css']
})
export class CustomPartnerIntegrationComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta,public dialog: MatDialog) {
       this.titleService.setTitle("POS Integration with Third Party Platforms | Payments");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'APPZPOS accepts all payments, integrates with accounting software, delivery platforms, and mall management systems. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
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
