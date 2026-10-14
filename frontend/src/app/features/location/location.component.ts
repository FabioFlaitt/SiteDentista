import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocationSectionComponent } from '../home/sections/location/location-section.component';

@Component({
  selector: 'app-location-page',
  standalone: true,
  imports: [LocationSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-location-section />`,
})
export class LocationPageComponent {}
