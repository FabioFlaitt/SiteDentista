import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mock-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isMock) {
      <span
        class="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-50
               px-3 py-1 text-xs font-semibold text-accent-800"
        role="status"
      >
        Dados de demonstração
      </span>
    }
  `,
})
export class MockBadgeComponent {
  @Input({ required: true }) isMock = false;
}
