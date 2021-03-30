import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {AuthService} from '../../../../../services/auth.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-collection-action',
  templateUrl: './collection-action.component.html',
  styleUrls: ['./collection-action.component.scss'],
})
export class CollectionActionComponent implements OnInit, OnDestroy {

  public user;


  constructor(
    private readonly popoverController: PopoverController,
    private readonly authService: AuthService
  ) {

  }


  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.authService.getCurrentUser()
      .subscribe(res => {
        this.user = res;
      });
  }

  public async edit() {
    return await this.popoverController.dismiss('edit', 'edit');
  }

  public async delete() {
    return await this.popoverController.dismiss('delete', 'delete');
  }

}
