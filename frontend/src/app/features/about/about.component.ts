import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutSectionComponent } from '../home/sections/about/about-section.component';
import { DifferentialsSectionComponent } from '../home/sections/differentials/differentials-section.component';
import { ClinicSectionComponent } from '../home/sections/clinic/clinic-section.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [AboutSectionComponent, DifferentialsSectionComponent, ClinicSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-about-section />
    <app-differentials-section />
    <app-clinic-section />
  `,
})
export class AboutComponent {}
