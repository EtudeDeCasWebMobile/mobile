import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-collection-action',
  templateUrl: './collection-action.component.html',
  styleUrls: ['./collection-action.component.scss'],
})
export class CollectionActionComponent implements OnInit {

  constructor(private readonly popoverController: PopoverController) { }

  ngOnInit() {}

  public async edit() {
    return await this.popoverController.dismiss('edit', 'edit');
  }

  public async delete() {
    return await this.popoverController.dismiss('delete', 'delete');
  }

}
