import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { siteConfig } from '../../../../core/config/site.config';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section pt-10 md:pt-16" aria-labelledby="hero-title">
      <div class="container-page grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span class="eyebrow">{{ siteConfig.professional.registration }}</span>
          <h1 id="hero-title" class="mt-4">
            Cuidado odontológico com atenção à
            <span class="text-brand-700">estética, saúde e funcionalidade</span>
            do sorriso.
          </h1>
          <p class="mt-5 text-base md:text-lg text-brand-700 max-w-xl">
            Conheça a {{ siteConfig.professional.shortName }} e entre em contato para obter
            informações sobre atendimento odontológico em Araraquara/SP.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              [href]="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
              (click)="onWhatsAppClick($event)"
            >
              <lucide-angular name="message-circle" [size]="18" aria-hidden="true"></lucide-angular>
              Agendar pelo WhatsApp
            </a>
            <a routerLink="/servicos" class="btn-secondary">
              <lucide-angular name="arrow-right" [size]="18" aria-hidden="true"></lucide-angular>
              Conheça os serviços
            </a>
          </div>

          <ul
            class="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-brand-600 max-w-md"
            aria-label="Compromissos profissionais"
          >
            <li class="flex items-center gap-2">
              <lucide-angular name="shield-check" [size]="16" aria-hidden="true"></lucide-angular>
              Ética profissional
            </li>
            <li class="flex items-center gap-2">
              <lucide-angular name="heart-handshake" [size]="16" aria-hidden="true"></lucide-angular>
              Atendimento acolhedor
            </li>
            <li class="flex items-center gap-2">
              <lucide-angular name="map-pin" [size]="16" aria-hidden="true"></lucide-angular>
              Araraquara / SP
            </li>
          </ul>
        </div>

        <figure
          class="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden
                 bg-gradient-to-br from-brand-100 via-surface to-accent-100 shadow-card"
        >
          <!--
            TODO: substituir pelo retrato profissional autorizado da Dra. Bruna.
            Placeholder evita invenção de uma imagem pessoal.
          -->
          <div
            class="absolute inset-0 flex items-end justify-center p-6 text-brand-700"
            aria-hidden="true"
          >
            <svg viewBox="0 0 160 160" class="w-40 h-40 opacity-80" fill="currentColor">
              <path
                d="M80 10c22 0 40 18 40 40 0 15-8 28-20 35v15h20c15 0 25 10 25 25v25H15v-25c0-15 10-25 25-25h20v-15C48 78 40 65 40 50c0-22 18-40 40-40z"
              />
            </svg>
          </div>
          <figcaption class="sr-only">
            Imagem ilustrativa — substituir por fotografia profissional autorizada.
          </figcaption>
        </figure>
      </div>
    </section>
  `,
})
export class HeroComponent {
  protected readonly siteConfig = siteConfig;
  private readonly whatsapp = inject(WhatsAppService);
  private readonly router = inject(Router);
  whatsappUrl = this.whatsapp.buildUrl();

  onWhatsAppClick(event: MouseEvent): void {
    this.whatsappUrl = this.whatsapp.track(this.router.url);
    (event.currentTarget as HTMLAnchorElement).href = this.whatsappUrl;
  }
}
