import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';

@Component({
  selector: 'app-pos-hardware-machine-receipt-printer',
  templateUrl: './pos-hardware-machine-receipt-printer.component.html',
  styleUrls: ['./pos-hardware-machine-receipt-printer.component.css']
})
export class CustomHardwareComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta,public dialog: MatDialog) {
       this.titleService.setTitle("Tailor your POS Machine | Receipt Printer | Kiosk | APPZPOS");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Quick Installation Upon Payment - POS Terminal, Receipt Printer, Kiosk Machine, Cash Drawer, Label Printer, Barcode Scanner. WhatsApp: +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });

    const urlParams = new URLSearchParams(window.location.search);
    const scrollToElement = urlParams.get('scrollTo');

    if (scrollToElement) {
        const targetElement = document.getElementById(scrollToElement);
        if (targetElement) {
            targetElement.scrollIntoView();
        }
    }
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
