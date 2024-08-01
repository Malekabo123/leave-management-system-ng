import { Component, inject } from '@angular/core';
import {
  calculateLeaveDays,
  Employee,
  LeaveRecord,
  OFFICIAL_HOLIDAYS_TURKEY,
} from '../../models/dashboard.model';
import { MatDialog } from '@angular/material/dialog';
import { AllLeavesDialogComponent } from './all-leaves-dialog/all-leaves-dialog.component';
import { EmployeesService } from '../../services/employeesService.service';
import { DatePipe } from '@angular/common';
import { RequestsService } from '../../services/requests.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrl: './leave-management.component.css',
})
export class LeaveManagementComponent {
  private dialog = inject(MatDialog);
  private employeesService = inject(EmployeesService);
  private requestsService = inject(RequestsService);
  private datePipe = inject(DatePipe);

  search = '';
  search2 = '';
  isRequestFormShown = false;
  tableHeaders = [
    'NAME',
    'LEAVE',
    'RANGE',
    'DAYS',
    'STATUS',
    'APPROVER',
    'ACTION',
  ];
  foundPending = false;
  isAdmin = localStorage.getItem('yourRoleInThisCompany') === 'admin';

  names: string[] = [];
  pendingLeave!: LeaveRecord[];
  employees!: Employee[];
  dataToDisplay!: string[][];

  ngOnInit() {
    if (this.isAdmin) {
      this.employeesService.allEmployees().subscribe((data) => {
        this.employees = data.map((employee) => ({
          ...employee,
          leaveRecords: employee.leaveRecords.map((record) => ({
            ...record,
            leaveDays: calculateLeaveDays(
              record.leaveDateFrom,
              record.leaveDateTo
            ).toString(),
          })),
        }));

        //retuen one leave from each employee
        this.dataToDisplay = this.employees
          .map((employee) => {
            if (employee.leaveRecords.length > 0) {
              let leaveRange = '';

              if (employee.leaveRecords[0].halfDay) {
                leaveRange = `${this.datePipe.transform(
                  employee.leaveRecords[0].leaveDateFrom.toDate(),
                  'MMM dd yyyy'
                )} - ${employee.leaveRecords[0].AM_PM?.toUpperCase()}`;
              } else if (+employee.leaveRecords[0].leaveDays === 1) {
                leaveRange = `${this.datePipe.transform(
                  employee.leaveRecords[0].leaveDateFrom.toDate(),
                  'MMM dd yyyy'
                )}`;
              } else {
                leaveRange = `From ${this.datePipe.transform(
                  employee.leaveRecords[0].leaveDateFrom.toDate(),
                  'MMM dd yyyy'
                )} to ${this.datePipe.transform(
                  employee.leaveRecords[0].leaveDateTo.toDate(),
                  'MMM dd yyyy'
                )}`;
              }

              return [
                employee.personalInformation.full_Name,
                employee.leaveRecords[0].leaveType,
                leaveRange,
                employee.leaveRecords[0].leaveDays,
                employee.leaveRecords[0].leaveStatus,
                employee.leaveRecords[0].approver,
                employee.personalInformation.full_Name,
                'employeeLeaves',
              ];
            }
            return [];
          })
          .filter((data) => data.length > 0);
      });
    }

    //used to disable send leave request
    this.foundPending = true;
    this.requestsService.allLeaveRecords().subscribe((data) => {
      this.pendingLeave = data.filter(
        (leave) => leave.leaveStatus === 'pending'
      );
      if (this.pendingLeave.length === 0) {
        this.foundPending = false;
      }
    });
  }

  showAllModal(Employeeame: string) {
    const employeeLeaveRecords = this.employees.filter(
      (employee) => employee.personalInformation.full_Name === Employeeame
    )[0];

    const dialogRef = this.dialog.open(AllLeavesDialogComponent, {
      data: employeeLeaveRecords,
      panelClass: 'dialog',
    });

    dialogRef.afterClosed().subscribe();
  }

  openRequestForm() {
    this.isRequestFormShown = true;
  }

  closeRequestForm(isAdded?: string) {
    if (isAdded) {
      this.foundPending = true;
    }
    this.isRequestFormShown = false;
  }

  deleteRequest(leaveId: number) {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.requestsService.cancelLeave(leaveId);
    }
  }
}
