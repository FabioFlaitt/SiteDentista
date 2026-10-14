import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { siteConfig } from '../../../../core/config/site.config';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, SectionTitleComponent, ServiceCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="servicos" class="section" aria-labelledby="services-title">
      <div class="container-page">
        <app-section-title
          eyebrow="Serviços"
          title="Procedimentos odontológicos"
          subtitle="Lista inicial — a confirmação dos serviços oferecidos é feita após avaliação individualizada."
          center
        />
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          @for (service of services; track service.id) {
            <app-service-card [service]="service" />
          }
        </div>
        <p class="mt-10 text-center text-xs text-brand-500 max-w-xl mx-auto">
          Os serviços são apresentados a título informativo. Esta página não substitui consulta
          profissional nem veicula promessas de resultado.
        </p>
      </div>
    </section>
  `,
})
export class ServicesSectionComponent {
  readonly services = siteConfig.services;
}
