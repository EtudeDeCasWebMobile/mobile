import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { LocationsPage } from './locations.page';

const routes: Routes = [
  {
    path: '',
    component: LocationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class LocationsPageRoutingModule {}
