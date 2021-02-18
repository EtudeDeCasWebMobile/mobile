import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {GuestGuard} from '../../guards/guest.guard';

const routes: Routes = [{
  path: '',
  canActivateChild: [GuestGuard],
  children: [
    {path: 'login', component: LoginComponent},
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
