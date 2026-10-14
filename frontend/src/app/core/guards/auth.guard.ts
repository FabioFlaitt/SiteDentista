import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return auth.refreshSession().pipe(
    map((ok) => {
      if (ok) return true;
      return router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
    }),
    catchError(() =>
      of(router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } })),
    ),
  );
};
