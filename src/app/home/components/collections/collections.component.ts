import {Component, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';
import {CollectionsService} from '../../../services/collections.service';
// @ts-ignore
import FuzzySearch from 'fuzzy-search';
import {Router} from '@angular/router';
import {Platform, PopoverController} from '@ionic/angular';
import {CollectionActionComponent} from './components/collection-action/collection-action.component';
import {Plugins} from '@capacitor/core';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


const {Haptics, Toast, Modals} = Plugins;

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
    private readonly router: Router,
    private readonly platform: Platform,
    private readonly popoverController: PopoverController
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

  async showPopup(event, collection: any) {
    const popover = await this.popoverController.create({
      component: CollectionActionComponent,
      event
    });
    if (this.platform.is('capacitor')) {
      Haptics.vibrate();
    } else {
      await navigator.vibrate(150);
    }
    await popover.present();
    const {data} = await popover.onDidDismiss();
    if (data === `delete`) {
      await this.delete(collection);
    } else if (data === 'edit') {
      console.log('edit');
      await this.router.navigateByUrl(`/edit-collection/${collection.id}`);
    }
  }


  private async delete(collection) {
    const confirmRet = await Modals.confirm({
      title: 'Confirmation',
      message: `Are you sure you want to delete '${collection.tag}'`,
      cancelButtonTitle: `Cancel`,
      okButtonTitle: `Delete`
    });
    if (confirmRet.value) {
      this.collectionsService.deleteCollection(collection.id)
        .pipe(
          catchError((err) => {
            Toast.show({
              position: 'bottom',
              text: `An error occured, try again`
            });
            return throwError(err);
          })
        )
        .subscribe(result => {
          console.log(result);
          this.collectionsService
            .getAllOwnedCollection()
            .subscribe((res: { collections: CollectionInterface[] }) => {
              this.collections = res.collections;
              this.originalCollections = res.collections;
            });

          Toast.show({
            text: `${collection.tag} have been successfully deleted`,
            duration: 'long',
            position: 'bottom'
          });

        });
    }
  }

}
