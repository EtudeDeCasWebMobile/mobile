import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../../services/auth.service';

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

  public async edit() {
    return await this.popoverController.dismiss('edit', 'edit');
  }

  public async delete() {
    return await this.popoverController.dismiss('delete', 'delete');
  }

}