import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AddLocationPage} from './add-location.page';
import {AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AddLocationPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLocationPageRoutingModule {
}
