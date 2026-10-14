/**
 * Dados simulados exclusivos para desenvolvimento e demonstração do painel.
 * Nunca são misturados com produção: a flag `isMock: true` acompanha cada payload.
 * Em produção, `environment.useMockAdminData = false` e os componentes consultam a API real.
 */
import {
  LocationBreakdown,
  LocationSummary,
  TrafficSummary,
  WhatsAppClicksSummary,
} from '../../../core/models/analytics.model';
import type { PeriodFilter } from '../../../core/services/admin-analytics.service';

function daysBetween(from: string, to: string): string[] {
  const start = new Date(from);
  const end = new Date(to);
  const out: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    out.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return out;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const adminMocks = {
  trafficSummary(period: PeriodFilter): TrafficSummary {
    const days = daysBetween(period.from, period.to);
    let total = 0;
    let unique = 0;
    const series = days.map((date, i) => {
      const visits = 20 + Math.floor(pseudoRandom(i + 1) * 60);
      const uniqueVisitors = Math.floor(visits * (0.65 + pseudoRandom(i + 7) * 0.2));
      total += visits;
      unique += uniqueVisitors;
      return { date, visits, uniqueVisitors };
    });
    return {
      rangeStart: period.from,
      rangeEnd: period.to,
      totalVisits: total,
      totalUniqueVisitors: unique,
      comparisonAvailable: true,
      previousPeriodVisits: Math.floor(total * 0.86),
      series,
      isMock: true,
    };
  },

  locationSummary(): LocationSummary {
    const entries: LocationBreakdown[] = [
      { city: 'Araraquara', region: 'SP', country: 'BR', visits: 184 },
      { city: 'São Carlos', region: 'SP', country: 'BR', visits: 62 },
      { city: 'Ribeirão Preto', region: 'SP', country: 'BR', visits: 48 },
      { city: 'Matão', region: 'SP', country: 'BR', visits: 23 },
      { city: 'Américo Brasiliense', region: 'SP', country: 'BR', visits: 15 },
    ];
    return { entries, isMock: true };
  },

  whatsAppSummary(period: PeriodFilter): WhatsAppClicksSummary {
    const days = daysBetween(period.from, period.to);
    const devices: Array<'mobile' | 'desktop' | 'tablet' | 'unknown'> = [
      'mobile',
      'desktop',
      'tablet',
    ];
    const paths = ['/', '/servicos', '/contato', '/localizacao'];
    let total = 0;
    const entries = days.flatMap((date, i) =>
      [0, 1].map((j) => {
        const count = 1 + Math.floor(pseudoRandom(i * 7 + j) * 6);
        total += count;
        return {
          timestamp: `${date}T${(10 + j * 4).toString().padStart(2, '0')}:00:00Z`,
          path: paths[(i + j) % paths.length],
          device: devices[(i + j) % devices.length],
          count,
        };
      }),
    );
    return {
      rangeStart: period.from,
      rangeEnd: period.to,
      total,
      entries,
      isMock: true,
    };
  },
};
