import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { ApiService } from './api.service';
import {
  LocationSummary,
  TrafficSummary,
  WhatsAppClicksSummary,
} from '../models/analytics.model';
import { environment } from '../../../environments/environment';
import { adminMocks } from '../../features/admin/mocks/admin-mocks';

export interface PeriodFilter {
  from: string; // ISO date
  to: string; // ISO date
}

/**
 * Service used by admin dashboard pages. Returns real API data when configured,
 * or clearly-labeled mock data in development. Mocks are never silently mixed
 * with real data in production.
 */
@Injectable({ providedIn: 'root' })
export class AdminAnalyticsService {
  private readonly api = inject(ApiService);

  getTraffic(period: PeriodFilter): Observable<TrafficSummary> {
    if (environment.useMockAdminData) {
      return of(adminMocks.trafficSummary(period)).pipe(delay(300));
    }
    return this.api
      .get<TrafficSummary>('/api/admin/analytics/traffic', period as unknown as Record<string, string>)
      .pipe(map((res) => ({ ...res, isMock: false })));
  }

  getLocations(period: PeriodFilter): Observable<LocationSummary> {
    if (environment.useMockAdminData) {
      return of(adminMocks.locationSummary()).pipe(delay(300));
    }
    return this.api
      .get<LocationSummary>(
        '/api/admin/analytics/locations',
        period as unknown as Record<string, string>,
      )
      .pipe(map((res) => ({ ...res, isMock: false })));
  }

  getWhatsAppClicks(period: PeriodFilter): Observable<WhatsAppClicksSummary> {
    if (environment.useMockAdminData) {
      return of(adminMocks.whatsAppSummary(period)).pipe(delay(300));
    }
    return this.api
      .get<WhatsAppClicksSummary>(
        '/api/admin/analytics/whatsapp-clicks',
        period as unknown as Record<string, string>,
      )
      .pipe(map((res) => ({ ...res, isMock: false })));
  }
}
