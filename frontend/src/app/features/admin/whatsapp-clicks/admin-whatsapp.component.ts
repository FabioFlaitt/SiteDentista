import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AdminAnalyticsService,
  PeriodFilter,
} from '../../../core/services/admin-analytics.service';
import { WhatsAppClicksSummary } from '../../../core/models/analytics.model';
import { PeriodFilterComponent } from '../shared/period-filter.component';
import { MockBadgeComponent } from '../shared/mock-badge.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

function todayIso(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-admin-whatsapp',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    PeriodFilterComponent,
    MockBadgeComponent,
    LoadingSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-display">Cliques no WhatsApp</h1>
          <p class="text-sm text-brand-600">
            Cada clique representa uma intenção de contato, não um agendamento confirmado.
          </p>
        </div>
        <app-period-filter [value]="period()" (valueChange)="period.set($event)" />
      </header>

      @if (summary(); as s) {
        <div class="flex flex-wrap gap-2">
          <app-mock-badge [isMock]="s.isMock" />
        </div>

        <article class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-display text-lg">Total no período</h2>
            <span class="text-3xl font-display">{{ s.total }}</span>
          </div>

          @if (s.entries.length === 0) {
            <p class="text-sm text-brand-500">Nenhum clique registrado.</p>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="text-left text-brand-500">
                  <tr>
                    <th scope="col" class="py-2">Data/hora</th>
                    <th scope="col" class="py-2">Página</th>
                    <th scope="col" class="py-2">Dispositivo</th>
                    <th scope="col" class="py-2 text-right">Cliques</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brand-100">
                  @for (entry of s.entries; track entry.timestamp + entry.path) {
                    <tr>
                      <td class="py-2">
                        {{ entry.timestamp | date: 'short':'UTC':'pt-BR' }}
                      </td>
                      <td class="py-2 text-brand-700">{{ entry.path }}</td>
                      <td class="py-2 capitalize">{{ entry.device }}</td>
                      <td class="py-2 text-right font-semibold">{{ entry.count }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </article>
      } @else {
        <app-loading-skeleton [height]="280" />
      }
    </section>
  `,
})
export class AdminWhatsAppComponent {
  private readonly service = inject(AdminAnalyticsService);

  readonly period = signal<PeriodFilter>({ from: todayIso(29), to: todayIso() });
  readonly summary = signal<WhatsAppClicksSummary | null>(null);

  constructor() {
    effect(() => {
      const p = this.period();
      this.summary.set(null);
      this.service.getWhatsAppClicks(p).subscribe((res) => this.summary.set(res));
    });
  }
}
