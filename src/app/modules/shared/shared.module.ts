import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WidgetModule} from '../widget/widget.module';
import {IonicModule} from '@ionic/angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
