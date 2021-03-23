import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EditCollectionPage} from './edit-collection.page';
import {AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: EditCollectionPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCollectionPageRoutingModule {
}
