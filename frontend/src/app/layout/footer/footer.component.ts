import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { siteConfig } from '../../core/config/site.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-brand-900 text-brand-100 mt-24" role="contentinfo">
      <div class="container-page py-14 grid gap-10 md:grid-cols-3">
        <section>
          <h3 class="font-display text-xl text-white">{{ siteConfig.professional.shortName }}</h3>
          <p class="text-sm text-brand-200 mt-1">{{ siteConfig.professional.title }}</p>
          <p class="text-sm text-brand-200">{{ siteConfig.professional.registration }}</p>
          <address class="not-italic text-sm text-brand-200 mt-4 leading-relaxed">
            {{ siteConfig.address.street }}<br />
            {{ siteConfig.address.neighborhood }}<br />
            {{ siteConfig.address.city }} - {{ siteConfig.address.state }},
            {{ siteConfig.address.postalCode }}
          </address>
        </section>

        <section>
          <h4 class="font-display text-base text-white">Navegação</h4>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a routerLink="/" class="text-brand-200 hover:text-white">Início</a></li>
            <li><a routerLink="/sobre" class="text-brand-200 hover:text-white">Sobre</a></li>
            <li>
              <a routerLink="/servicos" class="text-brand-200 hover:text-white">Serviços</a>
            </li>
            <li>
              <a routerLink="/localizacao" class="text-brand-200 hover:text-white">
                Localização
              </a>
            </li>
            <li><a routerLink="/contato" class="text-brand-200 hover:text-white">Contato</a></li>
          </ul>
        </section>

        <section>
          <h4 class="font-display text-base text-white">Contato</h4>
          <ul class="mt-4 space-y-3 text-sm">
            <li class="flex items-center gap-2">
              <lucide-angular name="message-circle" [size]="16" aria-hidden="true"></lucide-angular>
              <a
                [href]="siteConfig.contact.whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-100 hover:text-white"
              >
                {{ siteConfig.contact.whatsappDisplay }}
              </a>
            </li>
            <li class="flex items-center gap-2">
              <lucide-angular name="instagram" [size]="16" aria-hidden="true"></lucide-angular>
              <a
                [href]="siteConfig.contact.instagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-100 hover:text-white"
              >
                {{ siteConfig.contact.instagramHandle }}
              </a>
            </li>
            <li class="flex items-center gap-2">
              <lucide-angular name="link" [size]="16" aria-hidden="true"></lucide-angular>
              <a
                [href]="siteConfig.contact.linktreeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-100 hover:text-white"
              >
                Linktree
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div class="border-t border-brand-800">
        <div
          class="container-page py-5 flex flex-col md:flex-row md:items-center md:justify-between
                 gap-2 text-xs text-brand-300"
        >
          <p>&copy; {{ currentYear }} {{ siteConfig.professional.name }}. Todos os direitos reservados.</p>
          <p>Odontologia regulamentada pelo Conselho Federal de Odontologia.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly siteConfig = siteConfig;
  readonly currentYear = new Date().getFullYear();
}
