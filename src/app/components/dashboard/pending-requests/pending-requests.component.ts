import { Component, inject, OnInit } from '@angular/core';
import {
  Employee,
  LeaveRecord,
  calculateLeaveDays,
} from '../../../models/dashboard.model';
import { MatDialog } from '@angular/material/dialog';
import { LeaveDialogComponent } from './leave-dialog/leave-dialog.component';
import { RequestsService } from '../../../services/requests.service';
import { EmployeesService } from '../../../services/employeesService.service';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrl: './pending-requests.component.css',
})
export class PendingRequestsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private requestsService = inject(RequestsService);
  private employeeService = inject(EmployeesService);
  emploInfo!: Employee[];
  employees!: Employee[];
  leavesRequstss!: LeaveRecord[];

  ngOnInit() {
    this.employeeService.allEmployees().subscribe((data) => {
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

      //show pending leave
      this.emploInfo = this.employees
        .map((employee) => ({
          ...employee,
          leaveRecords: employee.leaveRecords.filter((record) => {
            return record.leaveStatus === 'pending';
          }),
        }))
        .filter((employee) => {
          return employee.leaveRecords.length > 0;
        });
    });
  }

  openModal(employeeId: string) {
    const selectedEmployee = this.employees.filter(
      (employee) => employee.id === employeeId
    )[0];

    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      data: selectedEmployee,
      panelClass: 'dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.requestsService.answerRequest(selectedEmployee, result);
      }
    });
  }
}
