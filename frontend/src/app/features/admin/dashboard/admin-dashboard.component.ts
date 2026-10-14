import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  AdminAnalyticsService,
  PeriodFilter,
} from '../../../core/services/admin-analytics.service';
import {
  LocationSummary,
  TrafficSummary,
  WhatsAppClicksSummary,
} from '../../../core/models/analytics.model';
import { PeriodFilterComponent } from '../shared/period-filter.component';
import { MockBadgeComponent } from '../shared/mock-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

function todayIso(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

interface DashboardData {
  traffic: TrafficSummary;
  locations: LocationSummary;
  whatsapp: WhatsAppClicksSummary;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, PeriodFilterComponent, MockBadgeComponent, LoadingSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-display">Resumo</h1>
          <p class="text-sm text-brand-600">Visão geral do período selecionado.</p>
        </div>
        <app-period-filter [value]="period()" (valueChange)="period.set($event)" />
      </header>

      @if (data(); as d) {
        <div class="flex flex-wrap gap-2">
          <app-mock-badge [isMock]="d.traffic.isMock" />
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <article class="card">
            <p class="text-xs uppercase tracking-wide text-brand-500">Visitas</p>
            <p class="mt-1 text-3xl font-display">{{ d.traffic.totalVisits }}</p>
            @if (d.traffic.comparisonAvailable && d.traffic.previousPeriodVisits !== undefined) {
              <p class="text-xs text-brand-500 mt-1">
                período anterior: {{ d.traffic.previousPeriodVisits }}
              </p>
            }
          </article>
          <article class="card">
            <p class="text-xs uppercase tracking-wide text-brand-500">Visitantes únicos</p>
            <p class="mt-1 text-3xl font-display">{{ d.traffic.totalUniqueVisitors }}</p>
          </article>
          <article class="card">
            <p class="text-xs uppercase tracking-wide text-brand-500">Cliques WhatsApp</p>
            <p class="mt-1 text-3xl font-display">{{ d.whatsapp.total }}</p>
            <p class="text-xs text-brand-500 mt-1">
              intenção de contato (não equivale a agendamento confirmado)
            </p>
          </article>
        </div>

        <article class="card">
          <h2 class="font-display text-lg mb-3">Top localizações</h2>
          @if (d.locations.entries.length === 0) {
            <p class="text-sm text-brand-500">Dados indisponíveis.</p>
          } @else {
            <ul class="divide-y divide-brand-100">
              @for (loc of d.locations.entries.slice(0, 5); track loc.city) {
                <li class="py-2 flex justify-between text-sm">
                  <span>{{ loc.city }} / {{ loc.region }}</span>
                  <span class="font-semibold">{{ loc.visits }}</span>
                </li>
              }
            </ul>
          }
        </article>
      } @else {
        <div class="grid gap-4 md:grid-cols-3">
          <app-loading-skeleton [height]="100" />
          <app-loading-skeleton [height]="100" />
          <app-loading-skeleton [height]="100" />
        </div>
      }
    </section>
  `,
})
export class AdminDashboardComponent {
  private readonly service = inject(AdminAnalyticsService);

  readonly period = signal<PeriodFilter>({ from: todayIso(29), to: todayIso() });
  readonly data = signal<DashboardData | null>(null);

  constructor() {
    effect(() => {
      const p = this.period();
      this.data.set(null);
      forkJoin({
        traffic: this.service.getTraffic(p),
        locations: this.service.getLocations(p),
        whatsapp: this.service.getWhatsAppClicks(p),
      }).subscribe((res) => this.data.set(res));
    });
  }
}
