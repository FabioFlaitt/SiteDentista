import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';

interface ClinicPhoto {
  src: string;
  alt: string;
  caption: string;
  wide?: boolean;
}

@Component({
  selector: 'app-clinic-section',
  standalone: true,
  imports: [CommonModule, SectionTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="clinic-title">
      <div class="container-page">
        <app-section-title
          eyebrow="O consultório"
          title="Um espaço acolhedor em Araraquara"
          subtitle="Ambiente planejado para oferecer conforto, higiene e tranquilidade durante o atendimento."
          center
        />

        <div class="grid gap-4 md:gap-5 md:grid-cols-6 md:grid-rows-2">
          @for (photo of photos; track photo.src; let i = $index) {
            <figure
              class="relative rounded-2xl overflow-hidden shadow-card bg-brand-50 group"
              [class.md:col-span-4]="photo.wide"
              [class.md:col-span-2]="!photo.wide"
              [class.md:row-span-2]="i === 3"
            >
              <img
                [src]="photo.src"
                [alt]="photo.alt"
                class="w-full h-full object-cover aspect-[4/3] transition-transform duration-300
                       group-hover:scale-105"
                loading="lazy"
              />
              <figcaption
                class="absolute bottom-0 left-0 right-0 p-3
                       bg-gradient-to-t from-brand-900/75 to-transparent
                       text-white text-xs md:text-sm"
              >
                {{ photo.caption }}
              </figcaption>
            </figure>
          }
        </div>

        <p class="mt-8 text-center text-xs text-brand-500 max-w-xl mx-auto">
          Imagens reais do consultório. Qualquer procedimento é precedido de avaliação clínica
          individualizada.
        </p>
      </div>
    </section>
  `,
})
export class ClinicSectionComponent {
  readonly photos: ClinicPhoto[] = [
    {
      src: '/images/consultorio-sala.jpg',
      alt: 'Sala principal do consultório odontológico com cadeira, equipamentos e bancada',
      caption: 'Sala de atendimento',
      wide: true,
    },
    {
      src: '/images/consultorio-recepcao.jpg',
      alt: 'Vista do consultório mostrando mesa de atendimento ao fundo e cadeira odontológica',
      caption: 'Ambiente integrado',
    },
    {
      src: '/images/consultorio-mesa.jpg',
      alt: 'Mesa de consulta com cadeiras para o paciente e acompanhante',
      caption: 'Espaço de conversa com o paciente',
    },
    {
      src: '/images/dra-bruna-atendimento.jpg',
      alt: 'Dra. Bruna Molina paramentada realizando atendimento odontológico em paciente',
      caption: 'Atendimento com biossegurança',
    },
  ];
}
