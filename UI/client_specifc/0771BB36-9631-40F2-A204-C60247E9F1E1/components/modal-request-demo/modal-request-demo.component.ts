import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomRequestDemoComponent } from '../custom-request-demo/custom-request-demo.component';
@Component({
  selector: 'app-modal-request-demo',
  templateUrl: '../custom-request-demo/custom-request-demo.component.html',
  styleUrls: ['../custom-request-demo/custom-request-demo.component.css']
})
export class ModalRequestDemoComponent extends CustomRequestDemoComponent {
  override placement: 'embedded' | 'popup' = 'popup';
  private readonly data = inject(MAT_DIALOG_DATA, {optional: true});
  readonly dialogRef = inject(MatDialogRef<ModalRequestDemoComponent>);
  override locale: 'en' | 'zh' = this.data?.locale === 'zh' ? 'zh' : 'en';
  override async onSubmit(): Promise<void> {
    this.dialogRef.disableClose = true;
    await super.onSubmit();
    if (!this.showSuccessMsg) this.dialogRef.disableClose = false;
  }
  override onNoClick(): void { this.dialogRef.close(); }
}
