import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { siteConfig } from '../../../../core/config/site.config';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';

@Component({
  selector: 'app-location-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SectionTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="localizacao" class="section" aria-labelledby="location-title">
      <div class="container-page grid gap-10 md:grid-cols-2 items-stretch">
        <div>
          <app-section-title
            eyebrow="Localização"
            title="Onde encontrar"
            subtitle="Consulte o endereço, abra a rota no Google Maps e veja os horários de funcionamento."
          />

          <address class="not-italic text-brand-700 leading-relaxed">
            {{ siteConfig.address.street }}<br />
            {{ siteConfig.address.neighborhood }}<br />
            {{ siteConfig.address.city }} - {{ siteConfig.address.state }},
            {{ siteConfig.address.postalCode }}
          </address>

          <a
            [href]="siteConfig.address.mapsRouteUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary mt-6"
          >
            <lucide-angular name="navigation" [size]="18" aria-hidden="true"></lucide-angular>
            Abrir rota no Google Maps
          </a>

          <section class="mt-10">
            <h3 class="font-display text-lg">Horários</h3>
            <ul class="mt-3 space-y-2 text-sm text-brand-700">
              @for (slot of siteConfig.businessHours; track slot.day) {
                <li class="flex items-center justify-between gap-4">
                  <span>{{ slot.day }}</span>
                  @if (slot.confirmed) {
                    <span>{{ slot.open }} — {{ slot.close }}</span>
                  } @else {
                    <span class="text-brand-500 italic">A confirmar</span>
                  }
                </li>
              }
            </ul>
            <p class="mt-4 text-xs text-brand-500">
              Informações sobre estacionamento e acessibilidade serão exibidas após confirmação.
            </p>
          </section>
        </div>

        <div class="rounded-2xl overflow-hidden shadow-card border border-brand-100 min-h-[320px]">
          <iframe
            title="Mapa da localização do consultório"
            [src]="mapUrl"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full h-full min-h-[320px] border-0"
          ></iframe>
        </div>
      </div>
    </section>
  `,
})
export class LocationSectionComponent {
  protected readonly siteConfig = siteConfig;
  private readonly sanitizer = inject(DomSanitizer);
  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    siteConfig.address.mapsEmbedUrl,
  );
}
