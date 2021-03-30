import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewPositionPage} from './view-position.page';


const routes: Routes = [
  {
    path: '',
    component: ViewPositionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPositionRoutingModule {
}
