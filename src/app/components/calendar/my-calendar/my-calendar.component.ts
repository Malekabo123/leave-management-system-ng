import { Component, inject, OnInit } from '@angular/core';
import {
  LeaveRecord,
  OFFICIAL_HOLIDAYS_TURKEY,
} from '../../../models/dashboard.model';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.css'],
})
export class MyCalendarComponent implements OnInit {
  calendars: {
    month: number;
    year: number;
    daysInMonth: {
      date: Date | null;
      isHoliday: boolean;
      leaveStatus?: string;
      halfDay?: string;
    }[][];
  }[] = [];
  leavesPopUps: { date: string; status: string; type: string }[] = [];
  employeeLeaves!: LeaveRecord[];

  private requestsService = inject(RequestsService);

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

  ngOnInit() {
    this.initializeCalendars();

    this.requestsService.allLeaveRecords().subscribe((data) => {
      this.employeeLeaves = data;

      this.initializeEmployeeLeavesInCurrentYear();
    });
  }

  initializeCalendars() {
    this.calendars = [];
    for (let month = 0; month < 12; month++) {
      const daysInMonth = this.initializeDaysInMonth(month, this.selectedYear);
      this.calendars.push({ month, year: this.selectedYear, daysInMonth });
    }
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

    if (week.length) {
      while (week.length < 7) {
        week.push({ date: null, isHoliday: false });
      }
      daysInMonth.push(week);
    }

    return daysInMonth;
  }

  initializeEmployeeLeavesInCurrentYear() {
    if (!this.employeeLeaves) return;
    this.leavesPopUps = [];

    this.employeeLeaves.forEach((leave) => {
      const leaveDateFrom = leave.leaveDateFrom.toDate();
      const leaveDateTo = leave.leaveDateTo.toDate();
      const leaveDates = this.getDatesInRange(leaveDateFrom, leaveDateTo);

      leaveDates.forEach((date) => {
        this.leavesPopUps.push({
          date: date.toDateString(),
          status: leave.leaveStatus,
          type: leave.leaveType,
        });

        const month = date.getMonth();
        const weekIndex = Math.floor(
          (date.getDate() +
            new Date(this.selectedYear, month, 1).getDay() -
            1) /
            7
        );
        const dayIndex = date.getDay();

        if (
          this.calendars[month].daysInMonth[weekIndex][
            dayIndex
          ].date?.getDate() === date.getDate()
        ) {
          //add leave status for days having leave, and add halfDay info if found to set the classes and change the UI
          if (leave.AM_PM) {
            this.calendars[month].daysInMonth[weekIndex][dayIndex] = {
              ...this.calendars[month].daysInMonth[weekIndex][dayIndex],
              leaveStatus: leave.leaveStatus,
              halfDay: leave.AM_PM,
            };
          } else {
            this.calendars[month].daysInMonth[weekIndex][dayIndex] = {
              ...this.calendars[month].daysInMonth[weekIndex][dayIndex],
              leaveStatus: leave.leaveStatus,
            };
          }
        }
      });
    });

    const seenDates: { [key: string]: boolean } = {};
    const result = [];

    //filter leaves with the same dates and let the latest one stay
    for (let i = this.leavesPopUps.length - 1; i >= 0; i--) {
      const record = this.leavesPopUps[i];
      if (!seenDates[record.date]) {
        seenDates[record.date] = true;
        result.unshift(record);
      }
    }

    this.leavesPopUps = result;
  }

  dateIsHoliday(d: Date | null): boolean {
    if (!d) return false;
    const day = d.getDay();
    return (
      day === 0 ||
      day === 6 ||
      OFFICIAL_HOLIDAYS_TURKEY.includes(d.toLocaleDateString())
    );
  }

  onYearChange() {
    this.initializeCalendars();
    this.initializeEmployeeLeavesInCurrentYear();
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

  getDayClass(date: Date | null): string {
    if (!date) return '';
    const month = date.getMonth();
    const weekIndex = Math.floor(
      (date.getDate() + new Date(this.selectedYear, month, 1).getDay() - 1) / 7
    );
    const dayIndex = date.getDay();
    return (
      this.calendars[month].daysInMonth[weekIndex][dayIndex].leaveStatus || ''
    );
  }

  showLeave(leaveDate: Date | null, halfDay: string | undefined) {
    if (!leaveDate) return '';

    const selectedDate = this.leavesPopUps.filter(
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
