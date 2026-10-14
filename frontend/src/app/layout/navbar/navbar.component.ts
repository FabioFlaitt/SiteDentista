import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { siteConfig } from '../../core/config/site.config';
import { WhatsAppService } from '../../core/services/whatsapp.service';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-brand-100"
      role="banner"
    >
      <div class="container-page flex items-center justify-between py-4">
        <a routerLink="/" class="no-underline text-brand-900">
          <span class="font-display text-xl font-semibold tracking-tight">
            {{ siteConfig.professional.shortName }}
          </span>
          <span class="block text-[11px] uppercase tracking-widest text-brand-500">
            {{ siteConfig.professional.registration }}
          </span>
        </a>

        <nav
          class="hidden md:flex items-center gap-7 text-sm font-medium text-brand-800"
          aria-label="Navegação principal"
        >
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="text-brand-900"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
              class="no-underline hover:text-brand-900"
            >
              {{ link.label }}
            </a>
          }
          <a
            [href]="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
            (click)="onWhatsAppClick($event)"
          >
            <lucide-angular name="message-circle" [size]="16" aria-hidden="true"></lucide-angular>
            Agendar WhatsApp
          </a>
        </nav>

        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px]
                 rounded-lg text-brand-900"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="mobile-menu"
          aria-label="Abrir menu"
          (click)="toggleMenu()"
        >
          <lucide-angular [name]="menuOpen() ? 'x' : 'menu'" [size]="24"></lucide-angular>
        </button>
      </div>

      @if (menuOpen()) {
        <div id="mobile-menu" class="md:hidden border-t border-brand-100 bg-surface">
          <nav class="container-page py-4 flex flex-col gap-1" aria-label="Navegação principal">
            @for (link of links; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-brand-50 text-brand-900"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                class="block rounded-lg px-3 py-3 text-brand-800 no-underline hover:bg-brand-50"
                (click)="closeMenu()"
              >
                {{ link.label }}
              </a>
            }
            <a
              [href]="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary mt-2"
              (click)="onWhatsAppClick($event)"
            >
              <lucide-angular name="message-circle" [size]="16" aria-hidden="true"></lucide-angular>
              Agendar WhatsApp
            </a>
          </nav>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  protected readonly siteConfig = siteConfig;
  private readonly whatsapp = inject(WhatsAppService);
  private readonly router = inject(Router);

  readonly links: NavLink[] = [
    { label: 'Início', path: '/' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Localização', path: '/localizacao' },
    { label: 'Contato', path: '/contato' },
  ];

  readonly menuOpen = signal(false);
  whatsappUrl = this.whatsapp.buildUrl();

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onWhatsAppClick(event: MouseEvent): void {
    this.whatsappUrl = this.whatsapp.track(this.router.url);
    (event.currentTarget as HTMLAnchorElement).href = this.whatsappUrl;
    this.closeMenu();
  }
}
