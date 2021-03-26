import {NgModule} from '@angular/core';

import {AddLocationPageRoutingModule} from './add-location-routing.module';

import {AddLocationPage} from './add-location.page';
import {SharedModule} from '../shared/shared.module';
import {SelectTagsComponent} from './select-tags/select-tags.component';

@NgModule({
  imports: [
    SharedModule,
    AddLocationPageRoutingModule
  ],
  declarations: [AddLocationPage, SelectTagsComponent]
})
export class AddLocationPageModule {
}
