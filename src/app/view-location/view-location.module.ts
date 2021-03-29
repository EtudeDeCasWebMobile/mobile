import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {ViewLocationPage} from './view-location.page';
import {ViewLocationRoutingModule} from './view-location-routing.module';


@NgModule({
  imports: [
    SharedModule,
    ViewLocationRoutingModule
  ],
  declarations: [ViewLocationPage]
})
export class ViewLocationModule {
}
