import { Component, Input } from '@angular/core';
import { LeaveRecord } from '../../../models/dashboard.model';

@Component({
  selector: 'app-leave-analysis',
  templateUrl: './leave-analysis.component.html',
  styleUrl: './leave-analysis.component.css',
})
export class LeaveAnalysisComponent {
  @Input() myLeaves!: LeaveRecord[];
  @Input() date_of_joining!: Date;
  @Input() marital_status!: string;
  @Input() gender!: string;

  allLeaveType = [
    { type: 'sick', totalDaysThisYear: 0, allowedSoFar: 0 },
    { type: 'vacation', totalDaysThisYear: 0, allowedSoFar: 2 },
    { type: 'study', totalDaysThisYear: 0, allowedSoFar: 0 },
    { type: 'unpaid', totalDaysThisYear: 0, allowedSoFar: 0 },
  ];
  parentalLeave!: string | null;

  leaveAnalysis!: {
    [key: string]: LeaveRecord[];
  };

  ngOnInit() {
    this.parentalLeave =
      this.marital_status === 'married'
        ? this.gender === 'male'
          ? 'paternity'
          : 'maternity'
        : null;

    if (this.parentalLeave) {
      this.allLeaveType.push({
        type: this.parentalLeave,
        totalDaysThisYear: 0,
        allowedSoFar: 0,
      });
    }

    this.leaveAnalysis = this.sortLeaveRecords(
      this.groupByTypeAndYear(this.myLeaves)
    );

    this.allLeaveType.forEach((item) => {
      if (this.leaveAnalysis[item.type]) {
        this.leaveAnalysis[item.type].map((record) => {
          if (
            record.leaveDateFrom.toDate().getFullYear() ===
              new Date().getFullYear() &&
            record.leaveStatus !== 'rejected'
          ) {
            item.totalDaysThisYear = item.totalDaysThisYear + +record.leaveDays;
          }
        });
      }
    });

    this.calculateAllowedLeavesByMonth('vacation');
    this.calculateAllowedLeavesByMonth('sick');
    this.parentalLeave &&
      this.calculateAllowedLeavesByMonth(this.parentalLeave);
  }

  groupByTypeAndYear(leaveRecords: LeaveRecord[]): {
    [key: string]: LeaveRecord[];
  } {
    return leaveRecords.reduce((acc, record) => {
      const type = record.leaveType;

      if (!acc[type]) {
        acc[type] = [];
      }

      if (
        record.leaveDateFrom.toDate().getFullYear() === new Date().getFullYear()
      ) {
        acc[type].push(record);
      }

      return acc;
    }, {} as { [key: string]: LeaveRecord[] });
  }

  //sort leaves from every type to be from newest on top to older on bottom
  sortLeaveRecords(recordsByType: { [key: string]: LeaveRecord[] }): {
    [key: string]: LeaveRecord[];
  } {
    const sortedRecordsByType: {
      [key: string]: LeaveRecord[];
    } = {};

    for (const [leaveType, records] of Object.entries(recordsByType)) {
      sortedRecordsByType[leaveType] = records.sort((a, b) => {
        const dateA = a.leaveDateTo.toDate();
        const dateB = b.leaveDateTo.toDate();
        return dateB.getTime() - dateA.getTime(); // Descending order
      });
    }

    return sortedRecordsByType;
  }

  getTotalDays(type: string): number {
    const leave = this.allLeaveType.find((leave) => leave.type === type);
    return leave ? leave.totalDaysThisYear : 0;
  }

  getAllowedDays(type: string): number {
    return this.allLeaveType.find((leaveType) => leaveType.type === type)!
      .allowedSoFar;
  }

  calculateAllowedLeavesByMonth(leaveType: string) {
    const calculationYearStart =
      new Date().getFullYear() === this.date_of_joining.getFullYear();
    let totalMonthlyLeavesSoFar = 5; //5 for sick leaves, if vacation it'll be changed below

    if (leaveType === 'vacation') {
      if (calculationYearStart) {
        //start calculating from the date join
        totalMonthlyLeavesSoFar =
          (new Date().getMonth() + 1 - this.date_of_joining.getMonth()) * 2;
      } else {
        //start calculating from the start of this year
        totalMonthlyLeavesSoFar = (new Date().getMonth() + 1) * 2;
      }
    }

    this.leaveAnalysis[leaveType] &&
      this.leaveAnalysis[leaveType].map((leave) => {
        totalMonthlyLeavesSoFar -= +leave.leaveDays;
      });

    if (leaveType === 'vacation') {
      this.allLeaveType.find(
        (leaveType) => leaveType.type === 'vacation'
      )!.allowedSoFar = totalMonthlyLeavesSoFar;
    } else if (leaveType === 'sick') {
      this.allLeaveType.find(
        (leaveType) => leaveType.type === 'sick'
      )!.allowedSoFar = totalMonthlyLeavesSoFar;
    }
  }
}
