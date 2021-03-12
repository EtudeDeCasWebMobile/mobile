import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'

import { HomePage } from './home.page';
import { from } from 'rxjs';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'locations',
        loadChildren: () => import('./pages/locations/locations.module').then(m => m.LocationsPageModule)
      },
      {
        path: 'collections',
        loadChildren: () => import('./pages/collections/collections.module').then(m => m.CollectionsPageModule)
      }
    ]
  },
  {
    path: "",
    redirectTo: "locations",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
