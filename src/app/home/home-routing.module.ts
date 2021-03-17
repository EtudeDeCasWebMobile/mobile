import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';
import {LocationsComponent} from './components/locations/locations.component';
import {CollectionsComponent} from './components/collections/collections.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'locations',
        component: LocationsComponent
      }, {
        path: 'collections',
        component: CollectionsComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {
}
