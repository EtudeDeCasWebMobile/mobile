import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectionsService} from '../services/collections.service';
import {catchError, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Plugins} from '@capacitor/core';
import {CollectionInterface} from '../models/collection.interface';

const {Toast, Modals} = Plugins;

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.page.html',
  styleUrls: ['./edit-collection.page.scss'],
})
export class EditCollectionPage implements OnInit {
  private collection: CollectionInterface;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly collectionsService: CollectionsService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(data => {
          return this.collectionsService.findCollection(data.id);
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 409) {
              Toast.show({
                position: 'bottom',
                duration: 'long',
                text: `Collection with the same name already exist`
              });
            } else {
              Toast.show({
                position: 'bottom',
                text: `An error occured, try again`
              });
            }
          } else {
            Toast.show({
              position: 'bottom',
              text: `Unable to connect to server`
            });
          }
          return throwError(err);
        })
      )
      .subscribe((res: CollectionInterface) => {
        console.log(res);
        this.collection = res;
      });
  }

  public async editCollectionTitle() {
    // @ts-ignore
    const {value, cancelled} = await Modals.prompt({
      okButtonTitle: 'Save',
      title: `Edit collection`,
      cancelButtonTitle: `Cancel`,
      inputPlaceholder: `Tag`,
      inputText: this.collection?.tag
    });
    if (value?.trim()?.length > 0 && !cancelled) {
      // create the collection
      this.collectionsService.updateCollection(this.collection.id, value.trim())
        .pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 409) {
                Toast.show({
                  position: 'bottom',
                  duration: 'long',
                  text: `Collection with the same name already exist`
                });
              } else {
                Toast.show({
                  position: 'bottom',
                  text: `An error occured, try again`
                });
              }
            } else {
              Toast.show({
                position: 'bottom',
                text: `Unable to connect to server`
              });
            }
            return throwError(err);
          })
        )
        .subscribe((res: CollectionInterface) => {
          Toast.show({
            position: 'bottom',
            text: `Collection updated`
          });
          console.log(res);
          this.collection = res;
        });

    }
  }

}
