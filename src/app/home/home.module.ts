import {NgModule} from '@angular/core';

import {HomePageRoutingModule} from './home-routing.module';

import {HomePage} from './home.page';
import {SharedModule} from '../shared/shared.module';
import {CollectionsComponent} from './components/collections/collections.component';
import {LocationsComponent} from './components/locations/locations.component';
import {CollectionActionComponent} from './components/collections/components/collection-action/collection-action.component';

@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    CollectionsComponent,
    LocationsComponent,
    CollectionActionComponent
  ]
})
export class HomePageModule {
}
