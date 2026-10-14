import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServicesSectionComponent } from '../home/sections/services/services-section.component';
import { ContactSectionComponent } from '../home/sections/contact/contact-section.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [ServicesSectionComponent, ContactSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-services-section />
    <app-contact-section />
  `,
})
export class ServicesPageComponent {}
