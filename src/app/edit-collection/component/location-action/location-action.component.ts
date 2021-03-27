import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-collection-action',
  templateUrl: './location-action.component.html',
  styleUrls: ['./location-action.component.scss'],
})
export class LocationActionComponent implements OnInit {

  public user;

  constructor(
    private readonly popoverController: PopoverController
  ) {

  }

  ngOnInit() {
  }

  public async view() {
    return await this.popoverController.dismiss('view', 'view');
  }

  public async delete() {
    return await this.popoverController.dismiss('delete', 'delete');
  }

}
