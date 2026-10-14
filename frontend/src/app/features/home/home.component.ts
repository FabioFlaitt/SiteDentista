import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutSectionComponent } from './sections/about/about-section.component';
import { ServicesSectionComponent } from './sections/services/services-section.component';
import { DifferentialsSectionComponent } from './sections/differentials/differentials-section.component';
import { ClinicSectionComponent } from './sections/clinic/clinic-section.component';
import { LocationSectionComponent } from './sections/location/location-section.component';
import { ContactSectionComponent } from './sections/contact/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutSectionComponent,
    ServicesSectionComponent,
    DifferentialsSectionComponent,
    ClinicSectionComponent,
    LocationSectionComponent,
    ContactSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-about-section />
    <app-services-section />
    <app-differentials-section />
    <app-clinic-section />
    <app-location-section />
    <app-contact-section />
  `,
})
export class HomeComponent {}
