import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';
import {LocationsComponent} from './components/locations/locations.component';
import {CollectionsComponent} from './components/collections/collections.component';
import {AuthGuard} from '../guards/auth.guard';
import {AnonymousGuard} from '../guards/anonymous.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'locations',
        component: LocationsComponent,
        canActivate: [AnonymousGuard]
      }, {
        path: 'collections',
        component: CollectionsComponent
      }, {
        path: '**',
        redirectTo: 'locations',
        pathMatch: 'full'
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
