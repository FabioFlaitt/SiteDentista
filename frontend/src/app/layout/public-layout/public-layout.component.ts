import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { WhatsAppFabComponent } from '../../shared/components/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsAppFabComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
             focus:bg-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-card"
    >
      Pular para o conteúdo
    </a>
    <app-navbar />
    <main id="main-content" role="main">
      <router-outlet />
    </main>
    <app-footer />
    <app-whatsapp-fab />
  `,
})
export class PublicLayoutComponent {}
