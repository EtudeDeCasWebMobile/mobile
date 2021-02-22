import {NgModule} from '@angular/core';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import {LoginComponent} from './components/login/login.component';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    FlexLayoutModule
  ]
})
export class AuthModule {
}
