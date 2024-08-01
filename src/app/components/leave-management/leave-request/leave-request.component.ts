import {
  Component,
  EventEmitter,
  inject,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { FocusInvalidInputDirective } from '../../../directives/focus-invalid.directive';
import { RequestsService } from '../../../services/requests.service';
import {
  LeaveRecord,
  OFFICIAL_HOLIDAYS_TURKEY,
} from '../../../models/dashboard.model';
import { EmployeesService } from '../../../services/employeesService.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css',
})
export class LeaveRequestComponent {
  @Output() isRequestFormShown = new EventEmitter();
  private requestsService = inject(RequestsService);
  private employeesService = inject(EmployeesService);

  myLeaves!: LeaveRecord[];
  date_of_joining!: Date;
  approved: string[] = [];
  notAllowedDates!: string[];
  form!: FormGroup;
  halfDayForm!: FormGroup;

  private isUpdating = false;
  private isUpdating2 = false;
  allowedLeaveDays = 0;
  isHalfDay = false;
  leaveTypes = ['sick', 'vacation', 'study', 'unpaid'];

  @ViewChildren(NgControl) formControls!: QueryList<NgControl>;

  @ViewChild(FocusInvalidInputDirective)
  invalidInputDirective!: FocusInvalidInputDirective;

  ngOnInit() {
    this.halfDayForm = new FormGroup({
      leaveDate: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.required],
        }
      ),
      AM_PM: new FormControl('', {
        validators: [Validators.required],
      }),
      leaveType: new FormControl('', {
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.form = new FormGroup({
      leaveDateFrom: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.required],
        }
      ),
      leaveDateTo: new FormControl(
        { value: '', disabled: true },
        {
          validators: [Validators.required],
        }
      ),
      leaveType: new FormControl('', {
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.employeesService
      .myProfileInfo()
      .pipe(first())
      .subscribe((data) => {
        this.myLeaves = data[0].leaveRecords;
        this.date_of_joining =
          data[0].employmentDetails.date_Of_Joining.toDate();

        //set the parental option if found
        if (data[0].personalInformation.marital_Status === 'married') {
          if (data[0].personalInformation.gender === 'male') {
            this.leaveTypes.push('paternity');
          } else {
            this.leaveTypes.push('maternity');
          }
        }
      });

    //disable the date picker until a leave type is selected
    this.halfDayForm.get('leaveType')!.valueChanges.subscribe((value) => {
      if (this.isUpdating2) return;
      this.isUpdating2 = true;

      if (value) {
        this.halfDayForm.get('leaveDate')!.enable();
      } else {
        this.halfDayForm.get('leaveDate')!.disable();
      }

      this.isUpdating2 = false;
    });

    //disable the date picker until a leave type is selected
    this.form.get('leaveType')!.valueChanges.subscribe((value) => {
      if (this.isUpdating) return;
      this.isUpdating = true;

      if (value) {
        this.form.get('leaveDateFrom')!.enable();
      } else {
        this.form.get('leaveDateFrom')!.disable();
        this.form.get('leaveDateTo')!.disable();
        this.form.get('leaveDateTo')!.setValue('');
      }

      this.isUpdating = false;
    });

    this.form.get('leaveDateFrom')!.valueChanges.subscribe((value) => {
      if (this.isUpdating) return;
      this.isUpdating = true;

      if (value) {
        this.form.get('leaveDateTo')!.enable();
      } else {
        this.form.get('leaveDateTo')!.disable();
        this.form.get('leaveDateTo')!.setValue('');
      }

      this.isUpdating = false;
    });
  }

  onClose() {
    this.isRequestFormShown.emit();
  }

  onSubmit() {
    this.invalidInputDirective.check(this.formControls);

    //get all approved leaves dates to prevent user from selecting them
    this.myLeaves.forEach((leave) => {
      const datesRange = this.getDatesInRange(
        leave.leaveDateFrom.toDate(),
        leave.leaveDateTo.toDate()
      ).map((date) => {
        return date.toLocaleDateString();
      });

      if (leave.leaveStatus === 'approved') {
        this.approved = [...this.approved, ...datesRange];
      }
    });

    let datesPrevented: string[] = [];

    if (this.form.valid) {
      const dates = this.getDatesInRange(
        this.form.controls['leaveDateFrom'].value,
        this.form.controls['leaveDateTo'].value
      );
      const range = dates.length;

      //check if a previous approved leave's date is selected
      dates.forEach((date) => {
        if (this.approved.includes(date.toLocaleDateString())) {
          datesPrevented.push(date.toLocaleDateString());
        }
      });

      //get study and unpaid leaves as much as you can
      if (
        this.form.controls['leaveType'].value === 'unpaid' ||
        this.form.controls['leaveType'].value === 'study'
      ) {
        this.allowedLeaveDays = 5000;
      }

      //prevent user from taking a leave request more than they can take, or selecting date that exists in previous leave
      if (range > this.allowedLeaveDays || datesPrevented.length > 0) {
        this.form.controls['leaveDateFrom'].setErrors({ incorrect: true });
      } else {
        this.form.get('leaveDateFrom')?.setErrors(null);
      }
    }

    if (this.halfDayForm.valid) {
      const haldDayDate =
        this.halfDayForm.controls['leaveDate'].value.toLocaleDateString();

      if (this.approved.includes(haldDayDate)) {
        datesPrevented.push(haldDayDate);
      }

      //prevent user from selecting a date that exists in previous leave
      if (datesPrevented.length > 0) {
        this.halfDayForm.controls['leaveDate'].setErrors({ incorrect: true });
      } else {
        this.halfDayForm.get('leaveDate')?.setErrors(null);
      }
    }

    this.notAllowedDates = [...datesPrevented];

    if (this.form.valid) {
      this.requestsService.addRequest(this.form.value, this.isHalfDay);
      this.isRequestFormShown.emit('isAdded');
    }

    if (this.halfDayForm.valid) {
      this.requestsService.addRequest(this.halfDayForm.value, this.isHalfDay);
      this.isRequestFormShown.emit('isAdded');
    }
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

  getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.filter((date) => !this.dayIsHoliday(date));
  }

  myFilter(d: Date | null): boolean {
    if (!d) return false;
    const day = d.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      day !== 0 &&
      day !== 6 &&
      !OFFICIAL_HOLIDAYS_TURKEY.includes(d?.toLocaleDateString() || '') &&
      d >= today
    );
  }

  disableOption(typeToDisable: string) {
    const selectedTypeLeaves = this.myLeaves
      .filter(
        (leave) =>
          leave.leaveType === typeToDisable && leave.leaveStatus !== 'rejected'
      )
      .filter(
        (leave) =>
          leave.leaveDateFrom.toDate().getFullYear() ===
          new Date().getFullYear()
      );

    const parentalFound = selectedTypeLeaves.find(
      (leave) =>
        leave.leaveType === 'paternity' || leave.leaveType === 'maternity'
    );

    let vacationAllowance = 0;
    if (typeToDisable === 'vacation') {
      if (this.date_of_joining.getFullYear() === new Date().getFullYear()) {
        vacationAllowance =
          (new Date().getMonth() - this.date_of_joining.getMonth() + 1) * 2;
      } else {
        vacationAllowance = (new Date().getMonth() + 1) * 2;
      }
    }

    let totalAllowedThisYear = 0;
    switch (typeToDisable) {
      case 'sick':
        totalAllowedThisYear = 5;
        break;

      case 'paternity':
        totalAllowedThisYear = 10;
        break;

      case 'maternity':
        totalAllowedThisYear = 80;
        break;

      case 'vacation':
        totalAllowedThisYear = vacationAllowance;
        break;

      case 'unpaid':
        return false;

      case 'study':
        return false;

      default:
        break;
    }

    let allowedSoFar = totalAllowedThisYear;

    selectedTypeLeaves.map((leave) => {
      allowedSoFar -= +leave.leaveDays;
    });

    if (allowedSoFar === 0 || parentalFound) {
      return true;
    }
    return false;
  }

  getAllowedDays(isHalfDay: boolean) {
    const selectedType = isHalfDay
      ? this.halfDayForm.controls['leaveType'].value
      : this.form.controls['leaveType'].value;

    const selectedTypeLeaves = this.myLeaves
      .filter(
        (leave) =>
          leave.leaveType === selectedType && leave.leaveStatus !== 'rejected'
      )
      .filter(
        (leave) =>
          leave.leaveDateFrom.toDate().getFullYear() ===
          new Date().getFullYear()
      );

    let vacationAllowance = 0;
    if (selectedType === 'vacation') {
      if (this.date_of_joining.getFullYear() === new Date().getFullYear()) {
        vacationAllowance =
          (new Date().getMonth() - this.date_of_joining.getMonth() + 1) * 2;
      } else {
        vacationAllowance = (new Date().getMonth() + 1) * 2;
      }
    }

    let totalAllowedThisYear = 0;
    switch (selectedType) {
      case 'sick':
        totalAllowedThisYear = 5;
        break;

      case 'paternity':
        totalAllowedThisYear = 10;
        break;

      case 'maternity':
        totalAllowedThisYear = 80;
        break;

      case 'vacation':
        totalAllowedThisYear = vacationAllowance;
        break;

      case 'unpaid':
        return '∞';

      case 'study':
        return '∞';

      default:
        break;
    }

    let allowedSoFar = totalAllowedThisYear;

    selectedTypeLeaves.map((leave) => {
      allowedSoFar -= +leave.leaveDays;
    });

    this.allowedLeaveDays = allowedSoFar;

    return allowedSoFar;
  }

  toggleCheckbox() {
    this.isHalfDay = !this.isHalfDay;

    //prevent the scenario where: one form is correctly filled, then half day is clicked, then click on submit
    //this way the form data before clicking half day will be sent to firebase, so emptying description prevents this
    if (this.isHalfDay) {
      this.form.controls['description'].setValue('');
    } else {
      this.halfDayForm.controls['description'].setValue('');
    }
  }
}
