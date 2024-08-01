import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from '../profile/profile.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { LeaveManagementComponent } from '../leave-management/leave-management.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../card/card.component';
import { UserFormComponent } from '../profile/user-form/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { OutOfOfficeComponent } from './out-of-office/out-of-office.component';
import { EmployeesTableComponent } from '../user-management/employees-table/employees-table.component';
import { LeaveDialogComponent } from './pending-requests/leave-dialog/leave-dialog.component';
import { EmployeeDialogComponent } from '../user-management/employee-dialog/employee-dialog.component';
import { FocusInvalidInputDirective } from '../../directives/focus-invalid.directive';
import { Filter } from '../../pipes/filter.pipe';
import { TableComponent } from '../table/table.component';
import { AllLeavesDialogComponent } from '../leave-management/all-leaves-dialog/all-leaves-dialog.component';
import { LeaveRequestComponent } from '../leave-management/leave-request/leave-request.component';
import { DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MyLeaveRecordsComponent } from '../leave-management/my-leave-records/my-leave-records.component';
import { LeaveFilter } from '../../pipes/leave-filter.pipe';
import { MyLeaveDialogComponent } from '../leave-management/my-leave-dialog/my-leave-dialog.component';
import { LeaveAnalysisComponent } from './leave-analysis/leave-analysis.component';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperComponent } from './leave-analysis/stepper/stepper.component';
import { MyCalendarComponent } from '../calendar/my-calendar/my-calendar.component';
import { EmployeesCalendarComponent } from '../calendar/employees-calendar/employees-calendar.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    UserManagementComponent,
    LeaveManagementComponent,
    CalendarComponent,
    SidebarComponent,
    CardComponent,
    UserFormComponent,
    PendingRequestsComponent,
    ProgressBarComponent,
    OutOfOfficeComponent,
    EmployeesTableComponent,
    LeaveDialogComponent,
    EmployeeDialogComponent,
    FocusInvalidInputDirective,
    Filter,
    TableComponent,
    AllLeavesDialogComponent,
    LeaveRequestComponent,
    MyLeaveRecordsComponent,
    LeaveFilter,
    MyLeaveDialogComponent,
    LeaveAnalysisComponent,
    StepperComponent,
    MyCalendarComponent,
    EmployeesCalendarComponent,
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTooltipModule,
  ],
  exports: [DashboardComponent, SidebarComponent],
  providers: [DatePipe],
})
export class DashboradModule {}
