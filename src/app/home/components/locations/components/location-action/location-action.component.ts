import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-collection-action',
  templateUrl: './location-action.component.html',
  styleUrls: ['./location-action.component.scss'],
})
export class LocationActionComponent implements OnInit, OnDestroy {

  constructor(
    private readonly popoverController: PopoverController
  ) {

  }

  public user;

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  public async edit() {
    return await this.popoverController.dismiss('edit', 'edit');
  }

  public async delete() {
    return await this.popoverController.dismiss('delete', 'delete');
  }

}
