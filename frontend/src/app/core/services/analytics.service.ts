import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { AnalyticsEventPayload } from '../models/analytics.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly api = inject(ApiService);

  trackEvent(payload: AnalyticsEventPayload): void {
    if (!environment.production && environment.useMockAdminData) {
      // Em desenvolvimento, apenas registra no console sem enviar à API.
      // eslint-disable-next-line no-console
      console.warn('[analytics mock]', payload);
      return;
    }
    this.api
      .post('/api/analytics/events', payload)
      .pipe(catchError(() => of(null)))
      .subscribe();
  }
}
