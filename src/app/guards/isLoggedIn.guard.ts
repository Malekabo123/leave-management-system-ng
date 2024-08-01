import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';

//when a logged in user first opens the web app, they'll be redirected to layout without logging in again
export const isLoggedIn: CanMatchFn = () => {
  const router = inject(Router);
  const loginData = localStorage.getItem('theIdOfEmployeeWhoIsLoggedIn');

  if (loginData) {
    return new RedirectCommand(router.parseUrl('/layout'));
  }
  return true;
};
