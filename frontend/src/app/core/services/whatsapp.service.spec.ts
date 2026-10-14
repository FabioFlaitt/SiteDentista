import { TestBed } from '@angular/core/testing';
import { WhatsAppService } from './whatsapp.service';
import { AnalyticsService } from './analytics.service';
import { siteConfig } from '../config/site.config';

class AnalyticsStub {
  calls: unknown[] = [];
  trackEvent(payload: unknown): void {
    this.calls.push(payload);
  }
}

describe('WhatsAppService', () => {
  let service: WhatsAppService;
  let analytics: AnalyticsStub;

  beforeEach(() => {
    analytics = new AnalyticsStub();
    TestBed.configureTestingModule({
      providers: [WhatsAppService, { provide: AnalyticsService, useValue: analytics }],
    });
    service = TestBed.inject(WhatsAppService);
  });

  it('builds a WhatsApp URL with the configured default message', () => {
    const url = service.buildUrl();
    expect(url.startsWith(siteConfig.contact.whatsappUrl)).toBeTrue();
    expect(url).toContain(encodeURIComponent(siteConfig.contact.whatsappMessage));
  });

  it('deduplicates very fast repeated clicks', () => {
    service.track('/');
    service.track('/');
    expect(analytics.calls.length).toBe(1);
  });
});
