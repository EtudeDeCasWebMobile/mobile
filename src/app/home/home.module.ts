import {NgModule} from '@angular/core';

import {HomePageRoutingModule} from './home-routing.module';

import {HomePage} from './home.page';
import {SharedModule} from '../shared/shared.module';
import {CollectionsComponent} from './components/collections/collections.component';
import {LocationsComponent} from './components/locations/locations.component';
import {CollectionActionComponent} from './components/collections/components/collection-action/collection-action.component';
import {LocationActionComponent} from './components/locations/components/location-action/location-action.component';

@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    CollectionsComponent,
    LocationsComponent,
    CollectionActionComponent,
    LocationActionComponent
  ]
})
export class HomePageModule {
}
