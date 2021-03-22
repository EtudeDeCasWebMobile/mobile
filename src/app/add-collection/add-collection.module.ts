import {NgModule} from '@angular/core';

import {AddCollectionPageRoutingModule} from './add-collection-routing.module';

import {AddCollectionPage} from './add-collection.page';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AddCollectionPageRoutingModule
  ],
  declarations: [AddCollectionPage]
})
export class AddCollectionPageModule {
}
