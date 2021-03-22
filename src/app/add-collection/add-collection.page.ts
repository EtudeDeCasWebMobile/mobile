import {Component, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {CollectionsService} from '../services/collections.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';

const {Toast, Modals} = Plugins;

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.page.html',
  styleUrls: ['./add-collection.page.scss'],
})
export class AddCollectionPage implements OnInit {

  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
  }

  public async createCollection() {

    // @ts-ignore
    const {value, cancelled} = await Modals.prompt({
      okButtonTitle: 'Save',
      title: `Create collection`,
      cancelButtonTitle: `Cancel`,
      inputPlaceholder: `Tag`
    });
    if (value?.trim()?.length > 0 && !cancelled) {
      // create the collection
      this.collectionsService.createCollection(value.trim())
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
        .subscribe(res => {
          Toast.show({
            position: 'bottom',
            text: `Collection created`
          });
         // this.router.navigateByUrl(`/home/collections`);
        });

    }

  }

}
