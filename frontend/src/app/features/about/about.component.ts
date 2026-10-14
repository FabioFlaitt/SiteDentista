import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutSectionComponent } from '../home/sections/about/about-section.component';
import { DifferentialsSectionComponent } from '../home/sections/differentials/differentials-section.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [AboutSectionComponent, DifferentialsSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-about-section />
    <app-differentials-section />
  `,
})
export class AboutComponent {}
