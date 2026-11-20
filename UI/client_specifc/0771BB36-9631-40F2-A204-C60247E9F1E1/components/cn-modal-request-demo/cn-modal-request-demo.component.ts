import { Component } from '@angular/core';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';
@Component({selector:'app-cn-modal-request-demo',templateUrl:'../custom-request-demo/custom-request-demo.component.html',styleUrls:['../custom-request-demo/custom-request-demo.component.css']})
export class CNModalRequestDemoComponent extends ModalRequestDemoComponent { override locale: 'en' | 'zh' = 'zh'; }
