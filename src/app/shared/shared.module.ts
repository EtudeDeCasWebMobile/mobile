import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LeafletModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    IonicModule,
  ],
  exports: [
    CommonModule,
    LeafletModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    IonicModule,
  ]
})
export class SharedModule {
}
