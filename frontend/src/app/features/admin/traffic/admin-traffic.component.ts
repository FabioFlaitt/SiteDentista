import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {
  AdminAnalyticsService,
  PeriodFilter,
} from '../../../core/services/admin-analytics.service';
import { TrafficSummary } from '../../../core/models/analytics.model';
import { PeriodFilterComponent } from '../shared/period-filter.component';
import { MockBadgeComponent } from '../shared/mock-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

function todayIso(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-admin-traffic',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    PeriodFilterComponent,
    MockBadgeComponent,
    LoadingSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-display">Tráfego</h1>
          <p class="text-sm text-brand-600">Acessos ao site durante o período.</p>
        </div>
        <app-period-filter [value]="period()" (valueChange)="period.set($event)" />
      </header>

      @if (summary(); as s) {
        <div class="flex flex-wrap gap-2">
          <app-mock-badge [isMock]="s.isMock" />
        </div>
        <article class="card">
          <h2 class="font-display text-lg mb-4">Acessos por dia</h2>
          <div class="h-72">
            <canvas
              baseChart
              [data]="chartData"
              [options]="chartOptions"
              [type]="'line'"
            ></canvas>
          </div>
        </article>
      } @else {
        <app-loading-skeleton [height]="280" />
      }
    </section>
  `,
})
export class AdminTrafficComponent {
  private readonly service = inject(AdminAnalyticsService);

  readonly period = signal<PeriodFilter>({ from: todayIso(29), to: todayIso() });
  readonly summary = signal<TrafficSummary | null>(null);

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } },
  };

  constructor() {
    effect(() => {
      const p = this.period();
      this.summary.set(null);
      this.service.getTraffic(p).subscribe((res) => {
        this.summary.set(res);
        this.chartData = {
          labels: res.series.map((pt) => pt.date),
          datasets: [
            {
              label: 'Visitas',
              data: res.series.map((pt) => pt.visits),
              borderColor: '#28484f',
              backgroundColor: 'rgba(40,72,79,0.15)',
              fill: true,
              tension: 0.3,
            },
            {
              label: 'Únicos',
              data: res.series.map((pt) => pt.uniqueVisitors),
              borderColor: '#b78640',
              backgroundColor: 'rgba(183,134,64,0.12)',
              fill: true,
              tension: 0.3,
            },
          ],
        };
      });
    });
  }
}
