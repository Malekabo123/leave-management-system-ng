import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LeaveManagementComponent } from './components/leave-management/leave-management.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LayoutComponent } from './layout/layout.component';
import { isLoggedIn } from './guards/isLoggedIn.guard';
import { unauthorizedNavigation } from './guards/unauthorizedNavigation.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent, canMatch: [isLoggedIn] },
  {
    path: 'layout',
    component: LayoutComponent,
    canMatch: [unauthorizedNavigation],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'leave-management', component: LeaveManagementComponent },
      { path: 'calendar', component: CalendarComponent },
    ],
  },
];
