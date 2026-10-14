import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AdminUser, LoginRequest, LoginResponse } from '../models/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly currentUserSignal = signal<AdminUser | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(request: LoginRequest): Observable<AdminUser> {
    return this.api.post<LoginResponse>('/api/auth/login', request).pipe(
      tap((res) => this.currentUserSignal.set(res.user)),
      map((res) => res.user),
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>('/api/auth/logout', {}).pipe(
      tap(() => this.currentUserSignal.set(null)),
    );
  }

  refreshSession(): Observable<boolean> {
    return this.api.get<AdminUser>('/api/auth/me').pipe(
      tap((user) => this.currentUserSignal.set(user)),
      map(() => true),
      catchError(() => {
        this.currentUserSignal.set(null);
        return of(false);
      }),
    );
  }
}
