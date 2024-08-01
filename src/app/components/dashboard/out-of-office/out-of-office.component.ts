import { Component, inject, Input } from '@angular/core';
import { EmployeesService } from '../../../services/employeesService.service';
import {
  Employee,
  OFFICIAL_HOLIDAYS_TURKEY,
} from '../../../models/dashboard.model';

@Component({
  selector: 'app-out-of-office',
  templateUrl: './out-of-office.component.html',
  styleUrl: './out-of-office.component.css',
})
export class OutOfOfficeComponent {
  @Input() supervisorEmail!: string;
  private employeesService = inject(EmployeesService);

  isAdmin = localStorage.getItem('yourRoleInThisCompany') === 'admin';
  weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  teamMembers: {
    EmployeName: string;
    profilePhoto: string;
    thisWeekLeaves: string[];
  }[] = [];
  daysToDisplay: string[] = [];

  ngOnInit(): void {
    const todayIndex = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    this.daysToDisplay = ['Today'];

    for (let i = 1; i < 7; i++) {
      this.daysToDisplay.push(this.weekDays[(todayIndex + i) % 7]);
    }

    if (this.isAdmin) {
      this.employeesService.allEmployees().subscribe((data) => {
        this.calculateAbsence(data);
      });
    } else {
      this.employeesService
        .colleagues(this.supervisorEmail)
        .subscribe((data) => {
          this.calculateAbsence(data);
        });
    }
  }

  calculateAbsence(data: Employee[]) {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    //dates of this week, from today to 6 days later
    let weekDates = [today.getDate()];
    let j = 1;

    while (j < 7) {
      weekDates.push((today.getDate() + j) % lastDayOfMonth);
      j++;
    }

    data.map((employee) => {
      employee.leaveRecords.map((leave) => {
        const date = leave.leaveDateFrom.toDate();
        const leaveRange = this.getDatesInRange(
          date,
          leave.leaveDateTo.toDate()
        );

        //check the approved leaves and add the employee's absence days this week
        if (
          leave.leaveStatus === 'approved' &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        ) {
          let weekLeaves: string[] = [];
          for (let i = 0; i < weekDates.length; i++) {
            const dateOfWeekDay = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + i
            );
            if (leaveRange.includes(weekDates[i])) {
              weekLeaves.push('leave');
            } else if (this.dayIsHoliday(dateOfWeekDay)) {
              weekLeaves.push('holiday');
            } else {
              weekLeaves.push('normal');
            }
          }

          this.teamMembers.push({
            EmployeName: employee.personalInformation.full_Name,
            profilePhoto: employee.personalInformation.image,
            thisWeekLeaves: weekLeaves,
          });
        }
      });
    });
  }

  dayIsHoliday(d: Date | null): boolean {
    if (!d) return false;
    const day = d.getDay();

    return (
      day === 0 ||
      day === 6 ||
      OFFICIAL_HOLIDAYS_TURKEY.includes(d?.toLocaleDateString() || '')
    );
  }

  getDatesInRange(startDate: Date, endDate: Date): number[] {
    let dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    dates = dates.filter((date) => !this.dayIsHoliday(date));

    return dates.map((date) => {
      return date.getDate();
    });
  }
}
