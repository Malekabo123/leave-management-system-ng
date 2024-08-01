import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';
import { EmployeesService } from '../../../services/employeesService.service';
import { Employee } from '../../../models/dashboard.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.css',
})
export class EmployeesTableComponent {
  private dialog = inject(MatDialog);
  private employeesService = inject(EmployeesService);

  search = '';
  tableHeaders = [
    'NAME',
    'POSITION',
    'SUPERVISOR',
    'LOCATION',
    'EMAIL',
    'PHONE',
    'JOIN DATE',
    'ACTION',
  ];

  employeess!: Employee[];
  dataToDisplay!: string[][];

  ngOnInit() {
    this.employeesService.allEmployees().subscribe((data) => {
      this.employeess = data;

      this.dataToDisplay = this.employeess.map(
        (employee: {
          personalInformation: { full_Name: string };
          professionalInformation: { position: string; supervisor: string };
          employmentDetails: {
            office_Location: string;
            date_Of_Joining: Timestamp;
          };
          contactInfo: { phone_Number: string };
          credentials: { company_Email: string };
          id: string;
        }) => {
          return (
            [
              employee.personalInformation.full_Name,
              employee.professionalInformation.position,
              employee.professionalInformation.supervisor,
              employee.employmentDetails.office_Location,
              employee.credentials.company_Email,
              employee.contactInfo.phone_Number,
              employee.employmentDetails.date_Of_Joining
                .toDate()
                .toDateString(),
              employee.id,
              'employeeData',
            ] || []
          );
        }
      );
    });
  }

  openEditModal(employeeId: string) {
    const employeeData = this.employeess.filter(
      (employee) => employee.id === employeeId
    )[0];

    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: { employeeData: employeeData, toEdit: true },
      panelClass: 'dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeesService.editEmployeeInfo(
          this.updateEmployeeData(result, employeeData)
        );
      }
    });
  }

  updateEmployeeData(result: any, employeeData: Employee) {
    return {
      ...employeeData,
      ...result,
      personalInformation: {
        ...employeeData.personalInformation,
        ...result.personalInformation,
      },
      employmentDetails: {
        ...employeeData.employmentDetails,
        ...result.employmentDetails,
      },
      professionalInformation: {
        ...employeeData.professionalInformation,
        ...result.professionalInformation,
      },
      contactInfo: {
        ...employeeData.contactInfo,
        ...result.contactInfo,
      },
      credentials: {
        ...employeeData.credentials,
        ...result.credentials,
      },
    };
  }

  openAddModal() {
    const newId = Math.random() * 20;
    let newEmployee: Employee = {
      id: newId.toString(),
      personalInformation: {
        image: '',
        full_Name: '',
        date_Of_Birth: Timestamp.fromDate(new Date(0)),
        gender: '',
        nationality: '',
        marital_Status: '',
        address: '',
        languages_Spoken: [],
      },
      employmentDetails: {
        employee_ID: '',
        date_Of_Joining: Timestamp.fromDate(new Date(0)),
        end_Of_Contract: Timestamp.fromDate(new Date(0)),
        employment_Status: '',
        office_Location: '',
        salary: '',
      },
      professionalInformation: {
        position: '',
        department: '',
        supervisor: localStorage.getItem('theNameOfEmployeeLoggedIn')!,
        supervisor_Company_Email: localStorage.getItem(
          'theEmailYourAdminGivesYou'
        )!,
      },
      contactInfo: {
        personal_Email: '',
        phone_Number: '',
        linkedin_Profile: '',
        github_Profile: '',
      },
      credentials: {
        company_Email: '',
        password: '',
        repeat_password: '',
      },
      isAdmin: false,
      leaveRecords: [],
    };

    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: { employeeData: newEmployee, toEdit: false },
      panelClass: 'dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeesService.addEmployee(
          this.updateEmployeeData(result, newEmployee)
        );
      }
    });
  }
}
