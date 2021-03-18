import {Component, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  public collections: CollectionInterface[] = [];

  constructor() {
  }

  ngOnInit() {

    this.collections = [
      {
        id: 1,
        tag: 'collection1',
        locations: [],
        owner: {
          id: 1,
          email: 'tecabek762@naymio.com'
        }
      }, {
        id: 2,
        tag: 'collection2',
        locations: [],
        owner: {
          id: 1,
          email: 'tecabek762@naymio.com'
        }
      }, {
        id: 3,
        tag: 'collection3',
        locations: [],
        owner: {
          id: 1,
          email: 'tecabek762@naymio.com'
        }
      }
    ];

  }

  /**
   * addLocation
   */
  public addCollection() {
    console.log('adding collection');
  }

}
