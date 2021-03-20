import {Component, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';
import {CollectionsService} from '../../../services/collections.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  public collections: CollectionInterface[] = [];
  public isFilterShown = false;
  public filters = [{
    title: 'Owned collections',
    checked: true
  }, {
    title: 'Shared collections',
    checked: true
  }];

  constructor(
    private readonly collectionsService: CollectionsService
  ) {
    this.collectionsService.showHideFilter.subscribe(res => {
      this.isFilterShown = res;
    });
  }

  ngOnInit() {

    this.collectionsService.getAllOwnedCollection().subscribe(console.log);

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
