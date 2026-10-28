import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';

@Component({
  selector: 'app-retail-store-cloud-pos-system',
  templateUrl: './retail-store-cloud-pos-system.component.html',
  styleUrls: ['../industry-page/industry-layout.css', '../industry-page/industry-overview.css', '../industry-page/industry-procedures.css', '../industry-page/industry-solutions.css', '../industry-page/industry-content-width.css', '../industry-page/industry-workflow.css', '../industry-page/industry-static-timeline.css']
})
export class CustomIndustryRestoreStoreComponent  {
  openSolution: number | null = null;

  hoverSolution(index: number): void {
    if (window.matchMedia('(hover: hover)').matches) this.openSolution = index;
  }

  leaveSolution(event: Event): void {
    const host = event.currentTarget as HTMLElement;
    const next = (event as FocusEvent).relatedTarget as Node | null;
    if (next && host.contains(next)) return;
    if (event.type === 'mouseleave' && host.contains(document.activeElement)) return;
    this.openSolution = null;
  }

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta,public dialog: MatDialog) {
       this.titleService.setTitle("Cloud POS System for Retail Stores | APPZPOS POS System");
   };

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({
        name: 'description',
        content: 'Empower your Retail Store Operations - Simplify inventory, transaction, customer / employee management, sales and reports. WhatsApp: +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
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
