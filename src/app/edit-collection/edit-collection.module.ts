import {NgModule} from '@angular/core';

import {EditCollectionPageRoutingModule} from './edit-collection-routing.module';

import {EditCollectionPage} from './edit-collection.page';
import {SharedModule} from '../shared/shared.module';
import {AddLocationComponent} from './component/add-location/add-location.component';

@NgModule({
  imports: [
    SharedModule,
    EditCollectionPageRoutingModule
  ],
  declarations: [
    EditCollectionPage,
    AddLocationComponent
  ]
})
export class EditCollectionPageModule {
}
