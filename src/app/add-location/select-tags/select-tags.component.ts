import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.scss'],
})
export class SelectTagsComponent implements OnInit {

  constructor(
    private readonly modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  public saveTags() {
    console.log('save');
    this.modalController.dismiss({
      saved: true
    }, 'save');
  }

  public cancel() {
    console.log('cancel');
    this.modalController.dismiss({
      dismissed: true
    }, 'dismiss');
  }

}
