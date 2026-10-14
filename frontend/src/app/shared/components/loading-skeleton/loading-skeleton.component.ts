import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="status"
      [attr.aria-label]="label"
      class="animate-pulse rounded-xl bg-brand-100/70"
      [style.height.px]="height"
      [style.width]="width"
    ></div>
  `,
})
export class LoadingSkeletonComponent {
  @Input() height = 120;
  @Input() width = '100%';
  @Input() label = 'Carregando conteúdo';
}
