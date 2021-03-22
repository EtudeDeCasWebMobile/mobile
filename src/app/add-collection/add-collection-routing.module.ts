import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCollectionPage } from './add-collection.page';

const routes: Routes = [
  {
    path: '',
    component: AddCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCollectionPageRoutingModule {}
