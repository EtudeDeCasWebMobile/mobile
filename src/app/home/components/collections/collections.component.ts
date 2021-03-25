import {Component, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';
import {CollectionsService} from '../../../services/collections.service';
// @ts-ignore
import FuzzySearch from 'fuzzy-search';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ModalController, Platform, PopoverController} from '@ionic/angular';
import {CollectionActionComponent} from './components/collection-action/collection-action.component';
import {Plugins} from '@capacitor/core';
import {catchError, map, switchMap} from 'rxjs/operators';
import {forkJoin, from, of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../../services/auth.service';


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
  public user;
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
    private readonly popoverController: PopoverController,
    private readonly activatedRoute: ActivatedRoute,
    private readonly storage: Storage,
    private readonly modalController: ModalController,
    private readonly authService: AuthService
  ) {

    this.collectionsService.showHideFilter.subscribe(res => {
      this.isFilterShown = res;
    });

    this.activatedRoute.queryParams
      .pipe(
        switchMap(res => this.authService.getCurrentUser())
      ).subscribe(res => {
      this.user = res;
    });

  }

  ngOnInit() {

    this.sharedCollections = []; // wait for api implementation
    this.originalSharedCollections = []; // wait for api implementation
    this.activatedRoute.queryParams
      .pipe(
        switchMap(res => this.authService.getCurrentUser())
      ).subscribe(res => {
      this.user = res;
      // tslint:disable-next-line:triple-equals
      if (res?.id == 0) {
        this.filters[0].checked = false;
        this.filters[1].checked = true;
        this.isFilterShown = false;
      } else {
        this.filters[0].checked = true;
        this.filters[1].checked = true;
      }
    });


    this.loadData();
    this.collectionsService.search.subscribe(res => {
      this.search(res);
    });

    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.loadData();
    });


  }

  public loadData() {
    from(this.storage.get('user'))
      .pipe(
        switchMap(user => {
          this.user = user;
          // tslint:disable-next-line:triple-equals
          if (user.id == 0) {
            this.collections = [];
            this.originalCollections = [];
            return of([]);
          } else {
            return this.collectionsService
              .getAllOwnedCollection();
          }
        })
      )
      .subscribe((res: { collections: CollectionInterface[] }) => {
        this.collections = res.collections;
        this.originalCollections = res.collections;
      });


    from(this.storage.get('user'))
      .pipe(
        switchMap(user => {
          this.user = user;
          console.log(this.user);
          return from(this.storage.get('urls'));
        }),
        map((res) => {
          let temp;
          res.map((val) => {
            if (val.id === this.user.id) {
              temp = val;
            }
          });
          console.log(temp);


          return temp;
        }),
        switchMap(res => {
          const arr = [];
          res.urls.map(r => {
            arr.push(
              this.collectionsService.findSharedCollection(r)
                .pipe(catchError(err => of(undefined)))
            );
          });
          return forkJoin(arr);
        }),
        // @ts-ignore
      ).subscribe((res: CollectionInterface[]) => {
      res = res.filter(e => !!e);
      this.sharedCollections = res;
      this.originalSharedCollections = res;
      console.log(this.sharedCollections);
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
    this.loadData();
    $event.target.complete();
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
            if (err instanceof HttpErrorResponse && err.status === 403) {
              Toast.show({
                position: 'bottom',
                text: `Only the owner of the collection can delete it`
              });
            } else {
              Toast.show({
                position: 'bottom',
                text: `An error occured, try again`
              });
            }
            return throwError(err);
          })
        )
        .subscribe(result => {
          console.log(result);
          this.loadData();

          Toast.show({
            text: `${collection.tag} have been successfully deleted`,
            duration: 'long',
            position: 'bottom'
          });

        });
    }
  }

  public viewCollection(collection, shared = false) {
    if (shared) {
      this.router.navigate([`/edit-collection/${collection.id}`], {
        state: collection,
        queryParams: {shared: true}
      });
    } else {
      this.router.navigate([`/edit-collection/${collection.id}`], {
        state: collection
      });
    }
  }

}
