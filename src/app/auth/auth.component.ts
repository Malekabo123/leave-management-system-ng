import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  errorMessage: string = '';
  private authService = inject(AuthService);
  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    const { email, password } = form.value;

    if (form.valid) {
      this.authService.authorizedEmployee(email, password).subscribe((data) => {
        if (data.length === 0) {
          this.errorMessage = 'Invalid email or password';
        } else {
          localStorage.setItem(
            'theEmailYourAdminGivesYou',
            data[0].credentials.company_Email
          );
          localStorage.setItem('theIdOfEmployeeWhoIsLoggedIn', data[0].id);
          localStorage.setItem(
            'theNameOfEmployeeLoggedIn',
            data[0].personalInformation.full_Name
          );
          localStorage.setItem(
            'yourRoleInThisCompany',
            data[0].isAdmin ? 'admin' : 'employee'
          );

          this.router.navigate(['/layout']);
        }
      });
    }
    if (!email || !password) {
      this.errorMessage = 'Enter your company email and password';
    }
  }

  //disable error message when user starts typing again
  onInputChange() {
    this.errorMessage = '';
  }
}
