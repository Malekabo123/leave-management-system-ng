import { Component, inject, Input } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { LeaveRecord, leavesFilter } from '../../../models/dashboard.model';
import { MatDialog } from '@angular/material/dialog';
import { MyLeaveDialogComponent } from '../my-leave-dialog/my-leave-dialog.component';

@Component({
  selector: 'app-my-leave-records',
  templateUrl: './my-leave-records.component.html',
  styleUrl: './my-leave-records.component.css',
})
export class MyLeaveRecordsComponent {
  @Input() search!: string;
  private requestsService = inject(RequestsService);
  private dialog = inject(MatDialog);

  tableHeaders = ['LEAVE', 'RANGE', 'DAYS', 'STATUS', 'APPROVER', 'ACTION'];
  dataToDisplay!: leavesFilter[];
  myLeaves!: LeaveRecord[];

  ngOnInit() {
    this.requestsService.allLeaveRecords().subscribe((data) => {
      this.myLeaves = data;

      this.dataToDisplay = data.map((leave) => {
        let leaveRange = '';

        if (leave.halfDay) {
          leaveRange = `${leave.leaveDateFrom
            .toDate()
            .toDateString()} - ${leave.AM_PM?.toUpperCase()}`;
        } else if (+leave.leaveDays === 1) {
          leaveRange = `${leave.leaveDateFrom.toDate().toDateString()}`;
        } else {
          leaveRange = `From ${leave.leaveDateFrom
            .toDate()
            .toDateString()} to ${leave.leaveDateTo.toDate().toDateString()}`;
        }

        return {
          leaveType: leave.leaveType,
          range: leaveRange,
          days: leave.leaveDays,
          status: leave.leaveStatus,
          approver: leave.approver,
          leaveId: leave.id,
        };
      });
    });
  }

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
