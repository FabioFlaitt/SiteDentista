import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';

interface Differential {
  icon: string;
  title: string;
  description: string;
  // true somente após confirmação pela profissional
  confirmed: boolean;
}

@Component({
  selector: 'app-differentials-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SectionTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section bg-surface-muted" aria-labelledby="differentials-title">
      <div class="container-page">
        <app-section-title
          eyebrow="Nosso compromisso"
          title="Pilares do atendimento"
          subtitle="Valores que orientam a prática clínica — campos adicionais podem ser incluídos após confirmação."
          center
        />

        <div class="grid gap-6 md:grid-cols-3">
          @for (item of items; track item.title) {
            <article
              class="card border-brand-100 flex flex-col gap-3"
              [class.opacity-70]="!item.confirmed"
            >
              <div
                class="w-11 h-11 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center"
                aria-hidden="true"
              >
                <lucide-angular [name]="item.icon" [size]="20"></lucide-angular>
              </div>
              <h3 class="font-display text-lg">{{ item.title }}</h3>
              <p class="text-sm text-brand-700">{{ item.description }}</p>
              @if (!item.confirmed) {
                <p class="text-[11px] uppercase tracking-wide text-accent-700/80">
                  A confirmar
                </p>
              }
            </article>
          }
        </div>

        <!--
          Avaliações de pacientes, número de atendimentos, premiações e tempo de experiência
          não são apresentados até que haja confirmação documentada pela profissional.
        -->
        <p class="mt-10 text-center text-xs text-brand-500 max-w-xl mx-auto">
          Avaliações, estatísticas e premiações só serão exibidas após confirmação formal
          e com evidência documental.
        </p>
      </div>
    </section>
  `,
})
export class DifferentialsSectionComponent {
  readonly items: Differential[] = [
    {
      icon: 'heart-handshake',
      title: 'Atendimento acolhedor',
      description: 'Escuta ativa, respeito ao ritmo do paciente e explicações claras.',
      confirmed: true,
    },
    {
      icon: 'book-open',
      title: 'Condutas baseadas em evidências',
      description:
        'Decisões clínicas apoiadas em protocolos atuais e literatura científica reconhecida.',
      confirmed: true,
    },
    {
      icon: 'shield-check',
      title: 'Ética e transparência',
      description:
        'Prática em conformidade com o CFO/CRO-SP, sem promessas de resultado garantido.',
      confirmed: true,
    },
  ];
}
