import {Component, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';
import {CollectionsService} from '../../../services/collections.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  public collections: CollectionInterface[];
  public sharedCollections: CollectionInterface[];
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

    this.sharedCollections = []; // wait for api implementation
    this.collectionsService
      .getAllOwnedCollection()
      .subscribe((res: { collections: CollectionInterface[] }) => {
        this.collections = res.collections;
      });


  }

  /**
   * addLocation
   */
  public addCollection() {
    console.log('adding collection');
  }

}
