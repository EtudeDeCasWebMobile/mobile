import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import {ReactiveFormsModule} from '@angular/forms';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    LeafletModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    IonicStorageModule,
    ReactiveFormsModule,
    LeafletModule,
    RouterModule
  ]
})
export class SharedModule {
}
