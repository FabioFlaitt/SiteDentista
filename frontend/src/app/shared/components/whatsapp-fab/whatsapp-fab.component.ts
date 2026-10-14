import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { WhatsAppService } from '../../../core/services/whatsapp.service';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [href]="url"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Dra. Bruna pelo WhatsApp"
      class="fixed z-40 bottom-5 right-5 md:bottom-8 md:right-8 inline-flex items-center gap-2
             rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
             px-5 py-3 shadow-lg min-h-[52px] no-underline
             focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      (click)="onClick($event)"
    >
      <lucide-angular name="message-circle" [size]="20" aria-hidden="true"></lucide-angular>
      <span class="hidden sm:inline">Fale no WhatsApp</span>
    </a>
  `,
})
export class WhatsAppFabComponent {
  private readonly whatsapp = inject(WhatsAppService);
  private readonly router = inject(Router);

  url = this.whatsapp.buildUrl();

  onClick(event: MouseEvent): void {
    // Rebuilds the URL and records the event; the browser then follows the href.
    this.url = this.whatsapp.track(this.router.url);
    (event.currentTarget as HTMLAnchorElement).href = this.url;
  }
}
