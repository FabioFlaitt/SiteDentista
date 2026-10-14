import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactSectionComponent } from '../home/sections/contact/contact-section.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ContactSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-contact-section />`,
})
export class ContactPageComponent {}
