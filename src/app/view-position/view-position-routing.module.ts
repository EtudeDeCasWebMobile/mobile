import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewPositionPage} from './view-position.page';
import {AuthGuard} from '../guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: ViewPositionPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPositionRoutingModule {
}
