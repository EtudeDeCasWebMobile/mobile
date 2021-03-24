import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectionsService} from '../services/collections.service';
import {catchError, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Plugins} from '@capacitor/core';
import {CollectionInterface} from '../models/collection.interface';
import {AlertController} from '@ionic/angular';

const {Toast, Modals, Clipboard} = Plugins;

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
    private readonly collectionsService: CollectionsService,
    private readonly alertController: AlertController
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

  public async deleteCollection() {
    const confirmRet = await Modals.confirm({
      title: 'Confirmation',
      message: `Are you sure you want to delete '${this.collection?.tag}'`,
      cancelButtonTitle: `Cancel`,
      okButtonTitle: `Delete`
    });
    if (confirmRet.value) {
      this.collectionsService.deleteCollection(this.collection?.id)
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
          Toast.show({
            text: `${this.collection?.tag} have been successfully deleted`,
            duration: 'long',
            position: 'bottom'
          });

          this.router.navigateByUrl(`/home/collections`);

        });
    }

  }

  public async shareCollection() {
    this.collectionsService.shareCollection(this.collection.id)
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            Toast.show({
              position: 'bottom',
              duration: 'long',
              text: `Only collection owner can request collection shareable link`
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
      .subscribe(async (res: { token: string, link: string }) => {

        console.log(`${res.link}?token=${res.token}`);

        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Shared link',
          inputs: [
            {
              name: 'token',
              type: 'text',
              id: 'token',
              value: `${res.link}?token=${res.token}`,
              attributes: {readonly: true}
            }
          ],
          buttons: [
            {
              text: 'Copy',
              handler: () => {
                Clipboard.write({string: `${res.link}?token=${res.token}`});
                Toast.show({
                  duration: 'short',
                  position: 'bottom',
                  text: 'Link have been copied'
                });
              }
            }
          ]
        });

        await alert.present();

      });

  }


}
