import {
  Component,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../../../models/dashboard.model';
import { FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { FocusInvalidInputDirective } from '../../../../directives/focus-invalid.directive';

@Component({
  selector: 'app-leave-dialog',
  templateUrl: './leave-dialog.component.html',
  styleUrl: './leave-dialog.component.css',
})
export class LeaveDialogComponent {
  readonly dialogRef = inject(MatDialogRef<LeaveDialogComponent>);
  readonly employeeData = inject<Employee>(MAT_DIALOG_DATA);

  dataToDisplay = {
    full_name: this.employeeData.personalInformation.full_Name,
    gender: this.employeeData.personalInformation.gender,
    employee_ID: this.employeeData.employmentDetails.employee_ID,
    department: this.employeeData.professionalInformation.department,
    leaveData: this.employeeData.leaveRecords.filter(
      (leave) => leave.leaveStatus === 'pending'
    )[0],
    pastLeaveInfo: this.employeeData.leaveRecords.filter(
      (leave) => leave.leaveStatus !== 'pending'
    ),
  };

  form = new FormGroup({
    approver_description: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  @ViewChildren(NgControl) formControls!: QueryList<NgControl>;

  @ViewChild(FocusInvalidInputDirective)
  invalidInputDirective!: FocusInvalidInputDirective;

  onSubmit(data: Object) {
    this.invalidInputDirective.check(this.formControls);
    if (this.form.valid) {
      this.dialogRef.close({
        ...data,
        approver_description: this.form.controls.approver_description.value,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
