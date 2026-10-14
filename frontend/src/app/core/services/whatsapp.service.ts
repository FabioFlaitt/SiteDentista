import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { siteConfig } from '../config/site.config';
import { AnalyticsService } from './analytics.service';

/**
 * Build and open WhatsApp links with pre-filled message, and record a conversion event.
 */
@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  private readonly doc = inject(DOCUMENT);
  private readonly analytics = inject(AnalyticsService);
  private lastClickAt = 0;
  private readonly dedupeWindowMs = 1500;

  buildUrl(customMessage?: string): string {
    const message = customMessage ?? siteConfig.contact.whatsappMessage;
    const encoded = encodeURIComponent(message);
    return `${siteConfig.contact.whatsappUrl}?text=${encoded}`;
  }

  /**
   * Called by any WhatsApp CTA. Deduplicates very fast repeated clicks (double-tap).
   */
  track(sourcePath: string, customMessage?: string): string {
    const now = Date.now();
    if (now - this.lastClickAt > this.dedupeWindowMs) {
      this.analytics.trackEvent({
        type: 'whatsapp_click',
        path: sourcePath,
        device: this.detectDevice(),
      });
      this.lastClickAt = now;
    }
    return this.buildUrl(customMessage);
  }

  private detectDevice(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
    const win = this.doc.defaultView;
    if (!win) return 'unknown';
    const ua = win.navigator.userAgent;
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
    return 'desktop';
  }
}
