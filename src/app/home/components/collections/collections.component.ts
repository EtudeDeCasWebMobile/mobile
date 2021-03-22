import {Component, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';
import {CollectionsService} from '../../../services/collections.service';
// @ts-ignore
import FuzzySearch from 'fuzzy-search';
import {Router} from '@angular/router';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  public collections: CollectionInterface[];
  public originalCollections: CollectionInterface[];
  public sharedCollections: CollectionInterface[];
  public originalSharedCollections: CollectionInterface[];
  public isFilterShown = false;
  public filters = [{
    title: 'Owned collections',
    checked: true
  }, {
    title: 'Shared collections',
    checked: true
  }];

  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly router: Router
  ) {
    this.collectionsService.showHideFilter.subscribe(res => {
      this.isFilterShown = res;
    });
  }

  ngOnInit() {

    this.sharedCollections = []; // wait for api implementation
    this.originalSharedCollections = []; // wait for api implementation
    this.collectionsService
      .getAllOwnedCollection()
      .subscribe((res: { collections: CollectionInterface[] }) => {
        this.collections = res.collections;
        this.originalCollections = res.collections;
      });
    this.collectionsService.search.subscribe(res => {
      this.search(res);
    });

  }

  /**
   * addLocation
   */
  public addCollection() {
    console.log('adding collection');
    this.router.navigateByUrl(`/add-collection`);
  }

  private search(res: string) {
    console.log(res);
    this.collections = this.originalCollections;
    this.sharedCollections = this.originalSharedCollections;
    const searcher = new FuzzySearch(this.originalCollections, ['locations.title', 'tag']);
    const searcherShared = new FuzzySearch(this.originalSharedCollections, ['locations.title', 'tag']);
    this.collections = searcher.search(res);
    this.sharedCollections = searcherShared.search(res);
  }

  pullToRefresh($event: any) {
    this.collectionsService
      .getAllOwnedCollection()
      .subscribe((res: { collections: CollectionInterface[] }) => {
        this.collections = res.collections;
        this.originalCollections = res.collections;
        $event.target.complete();
      });
  }

}
