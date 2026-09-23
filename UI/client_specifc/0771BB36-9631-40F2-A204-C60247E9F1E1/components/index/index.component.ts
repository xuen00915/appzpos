import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';

import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';
import { ENGLISH_HOME_PAGE_CONFIG } from './home-page-content.en';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class CustomHomeComponent implements OnInit {
  readonly pageConfig = ENGLISH_HOME_PAGE_CONFIG;

  constructor(
    private readonly titleService: Title,
    private readonly commonFunctionService: CommonFunctionService,
    private readonly meta: Meta,
    public readonly dialog: MatDialog
  ) {
    this.titleService.setTitle('APPZPOS Point of Sales | F&B, Retails & Salons | PSG Grant');
  }

  BindURL_Image(fileName: string): string {
    return this.commonFunctionService.BindURL_Image(fileName);
  }

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content: 'Singapore #1 Trusted Cloud POS System Provider for F&Bs, Retails & Salons. Get Up to 50% Funding of PSG Grant. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalRequestDemoComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
  }
}
