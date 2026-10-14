import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authedReq = req.clone({ withCredentials: true });
  return next(authedReq).pipe(
    catchError((err: unknown) => {
      const anyErr = err as { status?: number; url?: string };
      if (anyErr?.status === 401 && (anyErr.url ?? '').includes('/api/admin/')) {
        void router.navigate(['/admin/login'], {
          queryParams: { returnUrl: router.url },
        });
      }
      return throwError(() => err);
    }),
  );
};
