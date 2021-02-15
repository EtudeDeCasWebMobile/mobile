import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot()
  ],
  exports: [
    CommonModule,
    IonicModule,
    IonicStorageModule
  ]
})
export class SharedModule { }
