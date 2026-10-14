import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="mb-10 md:mb-14" [class.text-center]="center">
      @if (eyebrow) {
        <span class="eyebrow">{{ eyebrow }}</span>
      }
      <h2 class="mt-3">{{ title }}</h2>
      @if (subtitle) {
        <p class="mt-4 text-brand-700 text-base md:text-lg max-w-2xl"
           [class.mx-auto]="center">
          {{ subtitle }}
        </p>
      }
    </header>
  `,
})
export class SectionTitleComponent {
  @Input({ required: true }) title!: string;
  @Input() eyebrow?: string;
  @Input() subtitle?: string;
  @Input({ transform: booleanAttribute }) center = false;
}
