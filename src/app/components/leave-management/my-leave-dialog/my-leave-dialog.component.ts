import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeaveRecord } from '../../../models/dashboard.model';

@Component({
  selector: 'app-my-leave-dialog',
  templateUrl: './my-leave-dialog.component.html',
  styleUrl: './my-leave-dialog.component.css',
})
export class MyLeaveDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MyLeaveDialogComponent>);
  readonly leaveData = inject<LeaveRecord>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
