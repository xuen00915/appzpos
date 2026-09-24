import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../../modal-request-demo/modal-request-demo.component';

@Component({
  selector: 'app-blog-bcrs',
  templateUrl: './blog-bcrs.component.html',
  styleUrls: ['./blog-bcrs.component.css']
})
export class BlogBcrsComponent  {
  
  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta,public dialog: MatDialog) {
       this.titleService.setTitle("Cloud POS System for F&B Restaurant | APPZPOS POS System");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: 'Suitable for all F&B business - fast food & restaurant modes. Streamline orders, sales, transactions & delivery integration. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
 openDialog(): void {
  const dialogRef = this.dialog.open(ModalRequestDemoComponent, {
    width: '600px',
    panelClass: 'appz-demo-dialog',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}
}
