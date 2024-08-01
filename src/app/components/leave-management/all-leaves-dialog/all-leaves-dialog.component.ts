import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../../models/dashboard.model';

@Component({
  selector: 'app-all-leaves-dialog',
  templateUrl: './all-leaves-dialog.component.html',
  styleUrl: './all-leaves-dialog.component.css',
})
export class AllLeavesDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AllLeavesDialogComponent>);
  readonly employeeData = inject<Employee>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
