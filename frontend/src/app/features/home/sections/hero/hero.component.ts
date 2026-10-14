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
          class="relative aspect-[4/5] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-card
                 bg-brand-50"
        >
          <img
            src="/images/dra-bruna-portrait.jpg"
            alt="Dra. Bruna Molina, cirurgiã-dentista CRO-SP 145594, no consultório em Araraquara/SP"
            class="w-full h-full object-cover"
            width="960"
            height="1280"
            fetchpriority="high"
          />
          <div
            class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-brand-900/80 to-transparent"
          >
            <p class="text-white text-sm font-medium">{{ siteConfig.professional.name }}</p>
            <p class="text-white/80 text-xs">
              {{ siteConfig.professional.title }} · {{ siteConfig.professional.registration }}
            </p>
          </div>
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
