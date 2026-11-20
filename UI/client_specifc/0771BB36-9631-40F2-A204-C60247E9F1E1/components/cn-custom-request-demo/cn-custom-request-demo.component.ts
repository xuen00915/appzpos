import { Component } from '@angular/core';
import { CustomRequestDemoComponent } from '../custom-request-demo/custom-request-demo.component';
@Component({selector:'app-cn-custom-request-demo',templateUrl:'../custom-request-demo/custom-request-demo.component.html',styleUrls:['../custom-request-demo/custom-request-demo.component.css']})
export class CNCustomRequestDemoComponent extends CustomRequestDemoComponent { override locale: 'en' | 'zh' = 'zh'; }
