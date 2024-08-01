import { Component, inject } from '@angular/core';
import { EmployeesService } from '../../services/employeesService.service';
import { Employee } from '../../models/dashboard.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private employeesService = inject(EmployeesService);
  userInfo!: Employee;

  ngOnInit() {
    this.employeesService
      .myProfileInfo()
      .pipe(
        map((data) => {
          return data.map((employee) => {
            return {
              ...employee,
              personalInformation: {
                ...employee.personalInformation,
                languages_Spoken:
                  employee.personalInformation.languages_Spoken.map(
                    (language) =>
                      language.charAt(0).toUpperCase() + language.slice(1)
                  ),
              },
            };
          });
        })
      )
      .subscribe((data) => {
        this.userInfo = data[0];
      });
  }
}
