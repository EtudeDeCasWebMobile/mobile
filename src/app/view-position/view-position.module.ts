import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {ViewPositionPage} from './view-position.page';
import {ViewPositionRoutingModule} from './view-position-routing.module';


@NgModule({
  imports: [
    SharedModule,
    ViewPositionRoutingModule
  ],
  declarations: [ViewPositionPage]
})
export class ViewPositionModule {
}
