import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodFilter } from '../../../core/services/admin-analytics.service';

@Component({
  selector: 'app-period-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="flex flex-col sm:flex-row sm:items-end gap-3 bg-white border border-brand-100 rounded-xl p-4"
      (ngSubmit)="apply()"
    >
      <label class="text-sm text-brand-700">
        De
        <input
          type="date"
          class="block mt-1 rounded-lg border border-brand-200 px-3 py-2 text-sm"
          [(ngModel)]="localFrom"
          name="from"
          [max]="localTo"
        />
      </label>
      <label class="text-sm text-brand-700">
        Até
        <input
          type="date"
          class="block mt-1 rounded-lg border border-brand-200 px-3 py-2 text-sm"
          [(ngModel)]="localTo"
          name="to"
          [min]="localFrom"
        />
      </label>
      <button type="submit" class="btn-primary">Aplicar</button>
    </form>
  `,
})
export class PeriodFilterComponent {
  @Input() set value(v: PeriodFilter) {
    this.localFrom = v.from;
    this.localTo = v.to;
  }
  @Output() valueChange = new EventEmitter<PeriodFilter>();

  localFrom = '';
  localTo = '';

  apply(): void {
    if (!this.localFrom || !this.localTo) return;
    this.valueChange.emit({ from: this.localFrom, to: this.localTo });
  }
}
