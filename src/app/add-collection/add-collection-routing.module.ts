import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCollectionPage } from './add-collection.page';
import {AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AddCollectionPage,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCollectionPageRoutingModule {}
