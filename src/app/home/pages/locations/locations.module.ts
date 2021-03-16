import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';


import { LocationsPageRoutingModule } from './locations-routing.module';

import { LocationsPage } from './locations.page';

@NgModule({
  imports: [
    SharedModule,
    LocationsPageRoutingModule
  ],
  declarations: [LocationsPage]
})
export class LocationsPageModule {}
