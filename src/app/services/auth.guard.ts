import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, from, switchMap, throwError} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()){
    return true;
    } else {
    router.navigate(['/']);
    alert('You must be logged in to view this page');
    return false;
  }

};
