import {NgModule} from '@angular/core';

import {AddLocationPageRoutingModule} from './add-location-routing.module';

import {AddLocationPage} from './add-location.page';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AddLocationPageRoutingModule
  ],
  declarations: [AddLocationPage]
})
export class AddLocationPageModule {
}
