import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ServiceDefinition } from '../../../core/config/site.config';
import { WhatsAppService } from '../../../core/services/whatsapp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card flex flex-col gap-4 h-full transition-shadow hover:shadow-soft focus-within:shadow-soft"
    >
      <div
        class="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center"
        aria-hidden="true"
      >
        <lucide-angular [name]="service.icon" [size]="22"></lucide-angular>
      </div>
      <h3 class="font-display">{{ service.title }}</h3>
      <p class="text-sm text-brand-700 flex-1">{{ service.description }}</p>
      @if (!service.confirmed) {
        <p class="text-[11px] uppercase tracking-wide text-accent-700/80">
          Informações sob consulta
        </p>
      }
      <button
        type="button"
        class="btn-secondary mt-auto self-start"
        (click)="requestInfo()"
      >
        Solicitar informações
      </button>
    </article>
  `,
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: ServiceDefinition;

  private readonly whatsapp = inject(WhatsAppService);
  private readonly router = inject(Router);

  requestInfo(): void {
    const message = `Olá, Dra. Bruna! Gostaria de informações sobre: ${this.service.title}.`;
    const url = this.whatsapp.track(this.router.url, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
