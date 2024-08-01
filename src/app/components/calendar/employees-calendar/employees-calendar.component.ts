import { Component, inject } from '@angular/core';
import {
  Employee,
  LeaveRecord,
  OFFICIAL_HOLIDAYS_TURKEY,
} from '../../../models/dashboard.model';
import { EmployeesService } from '../../../services/employeesService.service';

@Component({
  selector: 'app-employees-calendar',
  templateUrl: './employees-calendar.component.html',
  styleUrl: './employees-calendar.component.css',
})
export class EmployeesCalendarComponent {
  calendars: {
    [employeeId: string]: {
      month: number;
      year: number;
      daysInMonth: {
        date: Date | null;
        isHoliday: boolean;
        leaveStatus?: string;
        halfDay?: string;
      }[][];
    };
  } = {};
  leavesPopUps: {
    [employeeId: string]: { date: string; status: string; type: string }[];
  } = {};
  employeesInfo!: Employee[];
  employeeLeaves!: LeaveRecord[];

  private employeesService = inject(EmployeesService);

  months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' },
  ];
  years = [2022, 2023, 2024];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();

  ngOnInit() {
    this.employeesService.allEmployees().subscribe((data) => {
      this.employeesInfo = data;

      //calendars with no leaves yet, just the right dates in the right calendar cells
      this.initializeCalendarsForAllEmployees();
    });
  }

  initializeCalendarsForAllEmployees() {
    this.calendars = {};
    this.employeesInfo.forEach((employee) => {
      const daysInMonth = this.initializeDaysInMonth(
        this.selectedMonth,
        this.selectedYear
      );
      this.calendars[employee.id] = {
        month: this.selectedMonth,
        year: this.selectedYear,
        daysInMonth,
      };

      this.initializeEmployeeLeavesInCurrentMonth(employee.id);
    });
  }

  initializeDaysInMonth(month: number, year: number) {
    const daysInMonth: {
      date: Date | null;
      isHoliday: boolean;
      leaveStatus?: string;
    }[][] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let week: { date: Date | null; isHoliday: boolean }[] = [];

    //empty cells before the 1st day of month
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      week.push({ date: null, isHoliday: false });
    }

    for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
      const currentDate = new Date(year, month, date);
      const isHoliday = this.dateIsHoliday(currentDate);
      week.push({ date: currentDate, isHoliday });

      if (week.length === 7) {
        daysInMonth.push(week);
        week = [];
      }
    }

    //empty days after the last day of month
    if (week.length) {
      while (week.length < 7) {
        week.push({ date: null, isHoliday: false });
      }
      daysInMonth.push(week);
    }

    return daysInMonth;
  }

  initializeEmployeeLeavesInCurrentMonth(employeeId: string) {
    this.employeeLeaves = this.employeesInfo.find(
      (employee) => employee.id === employeeId
    )?.leaveRecords!;

    this.leavesPopUps[employeeId] = [];

    this.employeeLeaves.forEach((leave) => {
      const leaveDateFrom = leave.leaveDateFrom.toDate();
      const leaveDateTo = leave.leaveDateTo.toDate();

      //leaves as dates without the holidays, an array of leaves dates only
      const leaveDates = this.getDatesInRange(leaveDateFrom, leaveDateTo);

      leaveDates.forEach((date) => {
        this.leavesPopUps[employeeId].push({
          date: date.toDateString(),
          status: leave.leaveStatus,
          type: leave.leaveType,
        });

        const weekIndex = Math.floor(
          (date.getDate() +
            new Date(this.selectedYear, date.getMonth(), 1).getDay() -
            1) /
            7
        );

        const dayIndex = date.getDay();

        //set a leave in the cell of the leave date in leave's month in leave's year
        if (
          this.calendars[employeeId].month === date.getMonth() &&
          this.calendars[employeeId].year === date.getFullYear() &&
          this.calendars[employeeId].daysInMonth[weekIndex][
            dayIndex
          ].date?.getDate() === date.getDate()
        ) {
          if (leave.AM_PM) {
            this.calendars[employeeId].daysInMonth[weekIndex][dayIndex] = {
              ...this.calendars[employeeId].daysInMonth[weekIndex][dayIndex],
              leaveStatus: leave.leaveStatus,
              halfDay: leave.AM_PM,
            };
          } else {
            this.calendars[employeeId].daysInMonth[weekIndex][dayIndex] = {
              ...this.calendars[employeeId].daysInMonth[weekIndex][dayIndex],
              leaveStatus: leave.leaveStatus,
            };
          }
        }
      });
    });

    const seenDates: { [key: string]: boolean } = {};
    const result = [];

    //remove duplicated dates from pop ups, this prevents the leaves that has been rejected then approved or pending then
    //approved/rejected from having the old leave status. It'll show the last leave status of this date cell
    for (let i = this.leavesPopUps[employeeId].length - 1; i >= 0; i--) {
      const record = this.leavesPopUps[employeeId][i];
      if (!seenDates[record.date]) {
        seenDates[record.date] = true;
        result.unshift(record);
      }
    }

    this.leavesPopUps[employeeId] = result;
  }

  //weekend or a holiday in turkey
  dateIsHoliday(d: Date | null): boolean {
    if (!d) return false;
    const day = d.getDay();
    return (
      day === 0 ||
      day === 6 ||
      OFFICIAL_HOLIDAYS_TURKEY.includes(d.toLocaleDateString())
    );
  }

  onMonthChange() {
    this.initializeCalendarsForAllEmployees();
  }

  onYearChange() {
    this.initializeCalendarsForAllEmployees();
  }

  getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.filter((date) => !this.dateIsHoliday(date));
  }

  getDayClass(employeeId: string, date: Date | null): string {
    if (!date) return '';
    const weekIndex = Math.floor(
      (date.getDate() +
        new Date(this.selectedYear, this.selectedMonth, 1).getDay() -
        1) /
        7
    );
    const dayIndex = date.getDay();
    return (
      this.calendars[employeeId].daysInMonth[weekIndex][dayIndex].leaveStatus ||
      ''
    );
  }

  showLeave(
    employeeId: string,
    leaveDate: Date | null,
    halfDay: string | undefined
  ) {
    if (!leaveDate) return '';

    const selectedDate = this.leavesPopUps[employeeId].filter(
      (leave) => leave.date === leaveDate.toDateString()
    )[0];

    return (
      selectedDate &&
      (halfDay
        ? `Type: ${selectedDate.type} \n Status: ${selectedDate.status} \n Half Day ${halfDay}`
        : `Type: ${selectedDate.type} \n Status: ${selectedDate.status}`)
    );
  }
}
