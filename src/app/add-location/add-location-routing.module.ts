import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AddLocationPage} from './add-location.page';
import {AuthGuard} from '../guards/auth.guard';
import {AnonymousGuard} from '../guards/anonymous.guard';

const routes: Routes = [
  {
    path: '',
    component: AddLocationPage,
    canActivate: [AuthGuard,AnonymousGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLocationPageRoutingModule {
}
