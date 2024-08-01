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

  colleagues: {
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
        this.calculateAbsence(data, false);
      });

      this.employeesService
        .colleagues(this.supervisorEmail)
        .subscribe((data) => {
          this.calculateAbsence(data, true);
        });
    } else {
      this.employeesService
        .colleagues(this.supervisorEmail)
        .subscribe((data) => {
          this.calculateAbsence(data, true);
        });
    }
  }

  calculateAbsence(data: Employee[], isColleagues: boolean) {
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
        const dateFrom = leave.leaveDateFrom.toDate();
        const dateTo = leave.leaveDateTo.toDate();
        const leaveRange = this.getDatesInRange(
          dateFrom,
          leave.leaveDateTo.toDate()
        );

        //check the approved leaves and add the employee's absence days this week
        if (
          leave.leaveStatus === 'approved' &&
          (dateFrom.getMonth() === today.getMonth() ||
            dateTo.getMonth() === today.getMonth()) &&
          (dateFrom.getFullYear() === today.getFullYear() ||
            dateTo.getFullYear() === today.getFullYear()) &&
          Math.min(...leaveRange) <= Math.max(...weekDates)
        ) {
          let weekLeaves: string[] = [];
          for (let i = 0; i < weekDates.length; i++) {
            const dateOfWeekDay = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + i
            );

            // Check if there's any item in leaveRange that is less than or equal to the current weekDates[i]
            const leaveBefore = leaveRange.filter(
              (leaveDate) => leaveDate <= weekDates[i]
            );

            if (leaveBefore.includes(weekDates[i])) {
              weekLeaves.push('leave');
            } else if (
              !leaveBefore.includes(weekDates[i]) &&
              !this.dayIsHoliday(dateOfWeekDay)
            ) {
              weekLeaves.push('normal');
            } else if (this.dayIsHoliday(dateOfWeekDay)) {
              weekLeaves.push('holiday');
            }
          }

          console.log(weekLeaves);

          if (weekLeaves.length > 0) {
            if (isColleagues) {
              //check if there are other leaves this week, append to the record if found
              const employeeRecord = this.colleagues.find(
                (theEmployee) =>
                  theEmployee.EmployeName ===
                  employee.personalInformation.full_Name
              );

              if (employeeRecord) {
                const employeeIndex = this.colleagues.indexOf(employeeRecord);

                const a = [...this.colleagues[employeeIndex].thisWeekLeaves];
                const b = [];

                //reconstruct leaves this week if different leaves are found this week
                for (let i = 0; i < a.length; i++) {
                  if (a[i] !== 'normal') {
                    b.push(a[i]);
                  } else {
                    if (weekLeaves[i] === 'leave') {
                      b.push(weekLeaves[i]);
                    } else {
                      b.push('normal');
                    }
                  }
                }

                this.colleagues[employeeIndex].thisWeekLeaves = [...b];
              } else {
                this.colleagues.push({
                  EmployeName: employee.personalInformation.full_Name,
                  profilePhoto: employee.personalInformation.image,
                  thisWeekLeaves: weekLeaves,
                });
              }
            } else {
              //check if there are other leaves this week, append to the record if found
              const employeeRecord = this.teamMembers.find(
                (theEmployee) =>
                  theEmployee.EmployeName ===
                  employee.personalInformation.full_Name
              );

              if (employeeRecord) {
                const employeeIndex = this.teamMembers.indexOf(employeeRecord);
                const a = [...this.teamMembers[employeeIndex].thisWeekLeaves];
                const b = [];

                //reconstruct leaves this week if different leaves are found this week
                for (let i = 0; i < a.length; i++) {
                  if (a[i] !== 'normal') {
                    b.push(a[i]);
                  } else {
                    if (weekLeaves[i] === 'leave') {
                      b.push(weekLeaves[i]);
                    } else {
                      b.push('normal');
                    }
                  }
                }

                this.teamMembers[employeeIndex].thisWeekLeaves = [...b];
              } else {
                this.teamMembers.push({
                  EmployeName: employee.personalInformation.full_Name,
                  profilePhoto: employee.personalInformation.image,
                  thisWeekLeaves: weekLeaves,
                });
              }
            }
          }
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
