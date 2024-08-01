import { Component, inject, Input } from '@angular/core';
import { LeaveRecord } from '../../../models/dashboard.model';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {
  @Input() myLeaves!: LeaveRecord[];
  @Input() date_of_joining!: Date;

  leaveTypes = [
    {
      type: 'vacation',
      allowedDaysByYear: 0,
      allowedDaysByMonth: 2,
      usedLeaves: 0,
    },
    {
      type: 'sick',
      allowedDaysByYear: 5,
      allowedDaysByMonth: 0,
      usedLeaves: 0,
    },
  ];

  ngOnInit() {
    let monthsFromJoining = 0;
    if (new Date().getFullYear() === this.date_of_joining.getFullYear()) {
      monthsFromJoining =
        new Date().getMonth() - this.date_of_joining.getMonth() + 1;
    } else {
      monthsFromJoining = new Date().getMonth() + 1;
    }

    //if the employee joined this year start calculating from date of join, else start from 1 Jan this year
    this.leaveTypes.find(
      (leave) => leave.type === 'vacation'
    )!.allowedDaysByYear = monthsFromJoining * 2;

    this.myLeaves.map((leave) => {
      if (
        leave.leaveDateFrom.toDate().getFullYear() === new Date().getFullYear()
      ) {
        const localLeave = this.leaveTypes.find(
          (leaveType) => leaveType.type === leave.leaveType
        );
        if (localLeave) {
          localLeave.usedLeaves += +leave.leaveDays;
        }
      }
    });
  }
}
