import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  isAdmin = localStorage.getItem('yourRoleInThisCompany') === 'admin';
}
