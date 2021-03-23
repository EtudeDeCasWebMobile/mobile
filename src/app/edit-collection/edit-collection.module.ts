import {NgModule} from '@angular/core';

import {EditCollectionPageRoutingModule} from './edit-collection-routing.module';

import {EditCollectionPage} from './edit-collection.page';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EditCollectionPageRoutingModule
  ],
  declarations: [EditCollectionPage]
})
export class EditCollectionPageModule {
}
