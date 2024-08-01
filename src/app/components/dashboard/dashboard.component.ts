import { Component, inject } from '@angular/core';
import { EmployeesService } from '../../services/employeesService.service';
import { first } from 'rxjs';
import { LeaveRecord } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isAdmin = localStorage.getItem('yourRoleInThisCompany') === 'admin';

  myLeaves!: LeaveRecord[];
  date_of_joining!: Date;
  marital_status!: string;
  gender!: string;
  supervisorEmail!: string;

  private employeesService = inject(EmployeesService);

  ngOnInit() {
    this.employeesService
      .myProfileInfo()
      .pipe(first())
      .subscribe((data) => {
        this.myLeaves = data[0].leaveRecords;
        this.date_of_joining =
          data[0].employmentDetails.date_Of_Joining.toDate();

        this.supervisorEmail =
          data[0].professionalInformation.supervisor_Company_Email;

        this.gender = data[0].personalInformation.gender;
        this.marital_status = data[0].personalInformation.marital_Status;
      });
  }
}
