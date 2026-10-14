export type AnalyticsEventType =
  | 'whatsapp_click'
  | 'page_view'
  | 'service_inquiry'
  | 'maps_click';

export interface AnalyticsEventPayload {
  type: AnalyticsEventType;
  path: string;
  referrer?: string;
  device?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  metadata?: Record<string, string>;
}

export interface TrafficPoint {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface TrafficSummary {
  rangeStart: string;
  rangeEnd: string;
  totalVisits: number;
  totalUniqueVisitors: number;
  comparisonAvailable: boolean;
  previousPeriodVisits?: number;
  series: TrafficPoint[];
  isMock: boolean;
}

export interface LocationBreakdown {
  city: string;
  region: string;
  country: string;
  visits: number;
}

export interface LocationSummary {
  entries: LocationBreakdown[];
  isMock: boolean;
}

export interface WhatsAppClickEntry {
  timestamp: string;
  path: string;
  device: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  count: number;
}

export interface WhatsAppClicksSummary {
  rangeStart: string;
  rangeEnd: string;
  total: number;
  entries: WhatsAppClickEntry[];
  isMock: boolean;
}
