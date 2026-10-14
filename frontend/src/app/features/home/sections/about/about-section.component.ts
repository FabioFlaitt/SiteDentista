import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { siteConfig } from '../../../../core/config/site.config';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SectionTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="sobre" class="section bg-surface-muted" aria-labelledby="about-title">
      <div class="container-page grid md:grid-cols-5 gap-10 items-start">
        <figure class="md:col-span-2 aspect-[4/5] rounded-2xl overflow-hidden shadow-card bg-brand-50">
          <img
            src="/images/dra-bruna-sorriso.jpg"
            alt="Retrato da Dra. Bruna Molina sorrindo, vestindo jaleco preto, no consultório"
            class="w-full h-full object-cover"
            width="960"
            height="1280"
            loading="lazy"
          />
          <figcaption class="sr-only">
            {{ siteConfig.professional.name }} —
            {{ siteConfig.professional.title }}.
          </figcaption>
        </figure>

        <div class="md:col-span-3">
          <app-section-title
            eyebrow="Sobre"
            title="Conheça a Dra. Bruna Molina"
            [subtitle]="siteConfig.professional.title + ' — ' + siteConfig.professional.registration"
          />

          <!-- TODO: validar biografia definitiva com a profissional. -->
          <p class="text-brand-700 leading-relaxed">
            {{ siteConfig.professional.bioPlaceholder }}
          </p>

          <p class="mt-4 text-sm text-brand-500">
            Este espaço receberá o texto biográfico definitivo e as formações da profissional após
            confirmação.
          </p>

          <div class="mt-8">
            <a
              [href]="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
              (click)="onWhatsAppClick($event)"
            >
              <lucide-angular name="message-circle" [size]="18" aria-hidden="true"></lucide-angular>
              Falar com a Dra. Bruna
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutSectionComponent {
  protected readonly siteConfig = siteConfig;
  private readonly whatsapp = inject(WhatsAppService);
  private readonly router = inject(Router);
  whatsappUrl = this.whatsapp.buildUrl();

  onWhatsAppClick(event: MouseEvent): void {
    this.whatsappUrl = this.whatsapp.track(this.router.url);
    (event.currentTarget as HTMLAnchorElement).href = this.whatsappUrl;
  }
}
