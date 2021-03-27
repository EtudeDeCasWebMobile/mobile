import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {IonicStorageModule} from '@ionic/storage';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {CustomFormsModule} from 'ngx-custom-validators';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './services/jwt.interceptor';
import {JwtHelperService} from '@auth0/angular-jwt';

import {LOADING_BAR_CONFIG, LoadingBarModule} from '@ngx-loading-bar/core';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {SharedModule} from './shared/shared.module';
import {NgxLeafletFullscreenModule} from '@runette/ngx-leaflet-fullscreen';

export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    // @ts-ignore
    return new Hammer(element, {
      touchAction: 'pan-y',
    });
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    LeafletModule,
    NgxLeafletFullscreenModule,
    SharedModule,
    CustomFormsModule,
    HttpClientModule,
    LoadingBarModule,
    LoadingBarHttpClientModule,
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: JwtHelperService, useValue: new JwtHelperService()},
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
    {provide: LOADING_BAR_CONFIG, useValue: {latencyThreshold: 300}}

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],

})

export class AppModule {
}
