import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyLeaveDialogComponent } from '../../../leave-management/my-leave-dialog/my-leave-dialog.component';
import { LeaveRecord } from '../../../../models/dashboard.model';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
})
export class StepperComponent {
  @Input() myLeaves!: LeaveRecord[];
  @Input() leaveType!: LeaveRecord[];
  private dialog = inject(MatDialog);

  onClick(leaveId: number) {
    const myLeaveDetails = this.myLeaves.filter(
      (leave) => leave.id === leaveId
    )[0];

    const dialogRef = this.dialog.open(MyLeaveDialogComponent, {
      data: myLeaveDetails,
      panelClass: 'dialog',
    });

    dialogRef.afterClosed().subscribe();
  }
}
