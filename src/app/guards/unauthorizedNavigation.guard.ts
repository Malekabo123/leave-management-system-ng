import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';

//if user tries to change the url to layout without logging in they'll be redirected to login page
export const unauthorizedNavigation: CanMatchFn = () => {
  const router = inject(Router);
  const loginData = localStorage.getItem('theIdOfEmployeeWhoIsLoggedIn');

  if (loginData) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/login'));
};
