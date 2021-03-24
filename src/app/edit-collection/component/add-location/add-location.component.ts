import {Component, Input, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {

  @Input() collection: CollectionInterface;

  constructor(
    private readonly modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  public saveCollection() {
    console.log('save');
  }

  public cancel() {
    console.log('cancel');
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
