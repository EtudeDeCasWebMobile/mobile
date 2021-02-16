import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './jwt.interceptor';
import {JwtHelperService} from '@auth0/angular-jwt';
import {SharedModule} from '../modules/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [SharedModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }, {
      provide: JwtHelperService,
      useValue: new JwtHelperService()
    }]
})
export class CoreModule {
}
