import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditLocationPageRoutingModule} from './edit-location-routing.module';

import {EditLocationPage} from './edit-location.page';
import {SelectTagsComponent} from './select-tags/select-tags.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EditLocationPageRoutingModule
  ],
  declarations: [EditLocationPage, SelectTagsComponent]
})
export class EditLocationPageModule {
}
