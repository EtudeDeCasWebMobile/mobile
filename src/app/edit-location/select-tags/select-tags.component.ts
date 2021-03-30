import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CollectionsService} from '../../services/collections.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.scss'],
})
export class SelectTagsComponent implements OnInit, OnDestroy {

  constructor(
    private readonly modalController: ModalController,
    private readonly collectionService: CollectionsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  @Input() location;

  public collections: any[] = [];
  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        switchMap(res => {
          return this.collectionService.getAllOwnedCollection();
        }),
        map((res: any) => {
          res.checked = false;
          return res;
        })
      )
      .subscribe((res: any) => {
        console.log(this.location);
        this.collections = res.collections;
        // console.log(this.collections);
      });
  }

  public saveTags() {
    console.log('save');
    const collections = this.collections.filter(res => !!res?.checked);
    this.modalController.dismiss({
      saved: true,
      collections
    }, 'save');
    console.log(collections);
  }

  public cancel() {
    console.log('cancel');
    this.modalController.dismiss({}, 'dismiss');
  }

}
