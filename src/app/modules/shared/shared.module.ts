import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LeafletModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    LeafletModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule {
}
