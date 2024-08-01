import {
  Component,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Employee,
  LANGUAGES,
  OFFICIAL_HOLIDAYS_TURKEY,
} from '../../../models/dashboard.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgControl,
  Validators,
} from '@angular/forms';
import { FocusInvalidInputDirective } from '../../../directives/focus-invalid.directive';
import { NATIONALITIES } from '../../../models/dashboard.model';
import { EmployeesService } from '../../../services/employeesService.service';
import { Timestamp } from '@angular/fire/firestore';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    }

    return { valuesNotEqual: true };
  };
}

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.css',
})
export class EmployeeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EmployeeDialogComponent>);
  employeeData = inject<{ employeeData: Employee; toEdit: boolean }>(
    MAT_DIALOG_DATA
  ).employeeData;

  readonly toEdit = inject<{ employeeData: Employee; toEdit: boolean }>(
    MAT_DIALOG_DATA
  ).toEdit;

  private employeeService = inject(EmployeesService);
  nationalities = NATIONALITIES;
  languages = LANGUAGES;

  unmatchedPasswords = '';
  unmatchedEmploymentDates = '';

  form = new FormGroup({
    personalInformation: new FormGroup({
      full_Name: new FormControl(
        this.employeeData.personalInformation.full_Name,
        {
          validators: [Validators.required],
        }
      ),
      date_Of_Birth: new FormControl(
        this.dateFormat(this.employeeData.personalInformation.date_Of_Birth),
        {
          validators: [Validators.required],
        }
      ),
      gender: new FormControl(
        this.employeeData.personalInformation.gender.toLowerCase(),
        {
          validators: [Validators.required],
        }
      ),
      nationality: new FormControl(
        this.employeeData.personalInformation.nationality.toLowerCase(),
        {
          validators: [Validators.required],
        }
      ),
      marital_Status: new FormControl(
        this.employeeData.personalInformation.marital_Status.toLowerCase(),
        {
          validators: [Validators.required],
        }
      ),
      address: new FormControl(this.employeeData.personalInformation.address, {
        validators: [Validators.required],
      }),
      languages_Spoken: new FormControl(
        this.employeeData.personalInformation.languages_Spoken.map((a) =>
          a.toLowerCase()
        ),

        {
          validators: [Validators.required],
        }
      ),
    }),
    employmentDetails: new FormGroup({
      employee_ID: new FormControl(
        this.employeeData.employmentDetails.employee_ID,
        {
          validators: [Validators.required],
        }
      ),
      date_Of_Joining: new FormControl(
        this.dateFormat(this.employeeData.employmentDetails.date_Of_Joining),
        {
          validators: [Validators.required],
        }
      ),
      end_Of_Contract: new FormControl(
        this.dateFormat(this.employeeData.employmentDetails.end_Of_Contract),
        {
          validators: [Validators.required],
        }
      ),
      employment_Status: new FormControl(
        this.employeeData.employmentDetails.employment_Status.toLowerCase(),
        {
          validators: [Validators.required],
        }
      ),
      office_Location: new FormControl(
        this.employeeData.employmentDetails.office_Location,
        {
          validators: [Validators.required],
        }
      ),
      salary: new FormControl(this.employeeData.employmentDetails.salary, {
        validators: [Validators.required],
      }),
    }),
    professionalInformation: new FormGroup({
      position: new FormControl(
        this.employeeData.professionalInformation.position,
        {
          validators: [Validators.required],
        }
      ),
      department: new FormControl(
        this.employeeData.professionalInformation.department,
        {
          validators: [Validators.required],
        }
      ),
      supervisor: new FormControl(
        this.employeeData.professionalInformation.supervisor,
        {
          validators: [Validators.required],
        }
      ),
      supervisor_Company_Email: new FormControl(
        this.employeeData.professionalInformation.supervisor_Company_Email,
        {
          validators: [Validators.required, Validators.email],
        }
      ),
    }),
    contactInfo: new FormGroup({
      personal_Email: new FormControl(
        this.employeeData.contactInfo.personal_Email,
        {
          validators: [Validators.required, Validators.email],
        }
      ),
      phone_Number: new FormControl(
        this.employeeData.contactInfo.phone_Number,
        {
          validators: [
            Validators.required,
            Validators.pattern(/^[+]?[\d\s-]{10,15}$/),
          ],
        }
      ),
      linkedin_Profile: new FormControl(
        this.employeeData.contactInfo.linkedin_Profile,
        {
          validators: [Validators.required],
        }
      ),
      github_Profile: new FormControl(
        this.employeeData.contactInfo.github_Profile,
        {
          validators: [Validators.required],
        }
      ),
    }),
    credentials: new FormGroup(
      {
        company_Email: new FormControl(
          this.employeeData.credentials.company_Email,
          {
            validators: [Validators.required, Validators.email],
          }
        ),
        password: new FormControl(this.employeeData.credentials.password, {
          validators: [Validators.required],
        }),
        repeat_password: new FormControl(
          this.employeeData.credentials.repeat_password,
          {
            validators: [Validators.required],
          }
        ),
      },
      {
        validators: [equalValues('password', 'repeat_password')],
      }
    ),
    isAdmin: new FormControl(this.employeeData.isAdmin, {
      validators: [Validators.required],
    }),
  });

  @ViewChildren(NgControl) formControls!: QueryList<NgControl>;

  @ViewChild(FocusInvalidInputDirective)
  invalidInputDirective!: FocusInvalidInputDirective;

  onSubmit() {
    //make sure date of joining's date is before end of contract's date
    const eoc =
      this.form.controls['employmentDetails'].controls['end_Of_Contract'].value;

    const doj =
      this.form.controls['employmentDetails'].controls['date_Of_Joining'].value;

    if (eoc && doj && eoc <= doj) {
      this.form.controls['employmentDetails'].controls[
        'date_Of_Joining'
      ].setErrors({ incorrect: true });

      this.unmatchedEmploymentDates =
        'Date of joining must be before End of contract';
    }

    //make sure passwords are the same
    const pass1 = this.form.controls['credentials'].controls['password'].value;
    const pass2 =
      this.form.controls['credentials'].controls['repeat_password'].value;

    if (pass1 && pass2 && pass1 !== pass2) {
      this.form.controls['credentials'].controls['password'].setErrors({
        incorrect: true,
      });

      this.unmatchedPasswords = 'Unmatched Passwords';
    }

    this.invalidInputDirective.check(this.formControls);

    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onRemoveEmployee() {
    if (
      confirm('Are you sure you want to delete this employee data completely?')
    ) {
      this.employeeService.removeEmployee(this.employeeData.id);
      this.onNoClick();
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  dateFormat(date: Timestamp) {
    if (date.nanoseconds === 0 && date.seconds === 0) {
      return '';
    }
    return date.toDate();
  }

  myFilter(d: Date | null): boolean {
    if (!d) return false;
    const day = d.getDay();

    return (
      day !== 0 &&
      day !== 6 &&
      !OFFICIAL_HOLIDAYS_TURKEY.includes(d?.toLocaleDateString() || '')
    );
  }
}
