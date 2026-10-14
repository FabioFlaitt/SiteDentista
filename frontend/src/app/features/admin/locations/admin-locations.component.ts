import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {
  AdminAnalyticsService,
  PeriodFilter,
} from '../../../core/services/admin-analytics.service';
import { LocationSummary } from '../../../core/models/analytics.model';
import { PeriodFilterComponent } from '../shared/period-filter.component';
import { MockBadgeComponent } from '../shared/mock-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

function todayIso(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-admin-locations',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    PeriodFilterComponent,
    MockBadgeComponent,
    LoadingSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-display">Origem geográfica</h1>
          <p class="text-sm text-brand-600">
            Dados agregados aproximados — depende da ferramenta de analytics configurada.
          </p>
        </div>
        <app-period-filter [value]="period()" (valueChange)="period.set($event)" />
      </header>

      @if (summary(); as s) {
        <div class="flex flex-wrap gap-2">
          <app-mock-badge [isMock]="s.isMock" />
        </div>

        @if (s.entries.length === 0) {
          <article class="card">
            <p class="text-sm text-brand-500">Dados indisponíveis para o período.</p>
          </article>
        } @else {
          <div class="grid gap-6 lg:grid-cols-5 items-start">
            <article class="card lg:col-span-2">
              <h2 class="font-display text-lg mb-3">Distribuição</h2>
              <div class="h-64">
                <canvas
                  baseChart
                  [type]="'doughnut'"
                  [data]="chartData"
                  [options]="chartOptions"
                ></canvas>
              </div>
            </article>
            <article class="card lg:col-span-3">
              <h2 class="font-display text-lg mb-3">Cidades</h2>
              <table class="w-full text-sm">
                <thead class="text-left text-brand-500">
                  <tr>
                    <th scope="col" class="py-2">Cidade</th>
                    <th scope="col" class="py-2">UF</th>
                    <th scope="col" class="py-2 text-right">Visitas</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brand-100">
                  @for (loc of s.entries; track loc.city) {
                    <tr>
                      <td class="py-2">{{ loc.city }}</td>
                      <td class="py-2">{{ loc.region }}</td>
                      <td class="py-2 text-right font-semibold">{{ loc.visits }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </article>
          </div>
        }
      } @else {
        <app-loading-skeleton [height]="260" />
      }
    </section>
  `,
})
export class AdminLocationsComponent {
  private readonly service = inject(AdminAnalyticsService);

  readonly period = signal<PeriodFilter>({ from: todayIso(29), to: todayIso() });
  readonly summary = signal<LocationSummary | null>(null);

  chartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor() {
    effect(() => {
      const p = this.period();
      this.summary.set(null);
      this.service.getLocations(p).subscribe((res) => {
        this.summary.set(res);
        this.chartData = {
          labels: res.entries.map((e) => e.city),
          datasets: [
            {
              data: res.entries.map((e) => e.visits),
              backgroundColor: [
                '#28484f',
                '#3f7079',
                '#5f8f9a',
                '#95b9c1',
                '#c69d55',
                '#d6b878',
              ],
            },
          ],
        };
      });
    });
  }
}
