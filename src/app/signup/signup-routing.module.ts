import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SignupPage} from './signup.page';
import {GuestGuard} from '../guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    component: SignupPage,
    canActivate: [GuestGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {
}
