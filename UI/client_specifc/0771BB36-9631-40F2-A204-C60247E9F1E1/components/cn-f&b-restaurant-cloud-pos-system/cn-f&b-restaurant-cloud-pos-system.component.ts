import { Component, Inject } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { CNModalRequestDemoComponent } from '../cn-modal-request-demo/cn-modal-request-demo.component';



@Component({
  selector: 'app-cn-f&b-restaurant-cloud-pos-system',
  templateUrl: './cn-f&b-restaurant-cloud-pos-system.component.html',
  styleUrls: ['./cn-f&b-restaurant-cloud-pos-system.component.css']
})
export class CustomHomeCNComponent {

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta,public dialog: MatDialog) {
       this.titleService.setTitle("APPZPOS云端智能POS餐饮系统 收银系统 | 新加坡餐厅运营首选");
   }; 

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({ 
        name: 'description',
        content: '收银机、电子点餐、网站点餐、扫码点餐、自助点餐机、KDS厨房系统、排队叫号系统和外卖订单中心。高达50%政府津贴折扣！立即联系我们 +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
  openDialog(): void {
    const dialogRef = this.dialog.open(CNModalRequestDemoComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
