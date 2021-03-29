import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectionsService} from '../services/collections.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Plugins} from '@capacitor/core';
import {CollectionInterface} from '../models/collection.interface';
import {AlertController, ModalController, Platform, PopoverController} from '@ionic/angular';
import {AddLocationComponent} from './component/add-location/add-location.component';
import {LocationActionComponent} from './component/location-action/location-action.component';
import {Storage} from '@ionic/storage';
import {AuthService} from '../services/auth.service';
import {LocationsService} from '../services/locations.service';
import {FileSaverService} from 'ngx-filesaver';

const {Toast, Modals, Clipboard, Haptics, Filesystem} = Plugins;

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.page.html',
  styleUrls: ['./edit-collection.page.scss'],
})
export class EditCollectionPage implements OnInit {
  public collection: CollectionInterface;
  public isShared = false;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly collectionsService: CollectionsService,
    private readonly alertController: AlertController,
    private readonly modalController: ModalController,
    private readonly platform: Platform,
    private readonly popoverController: PopoverController,
    private readonly storage: Storage,
    private readonly authService: AuthService,
    private readonly locationsService: LocationsService,
    private readonly fileSaverService: FileSaverService
  ) {
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(ignored => {
      this.isShared = ignored.shared;
      // @ts-ignore
      this.collection = this.router.getCurrentNavigation().extras.state;
      if (!this.collection) {
        const id = this.activatedRoute.snapshot.params.id;
        this.collectionsService.findCollection(id)
          .subscribe((r: any) => {
            this.collection = r;
          });
        // this.router.navigateByUrl('/home/collections');
      }
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


  public async addLocationToCollection() {
    console.log('add location to collection');
    const modal = await this.modalController.create({
      component: AddLocationComponent,
      componentProps: {
        collection: this.collection
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (!!data?.data?.locations) {
        this.collection.locations = data?.data?.locations;
      }
    });
    return await modal.present();
  }


  public async showPopup($event, location: any) {
    const popover = await this.popoverController.create({
      component: LocationActionComponent,
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
      await this.delete(location);
    } else if (data === 'view') {
      console.log('view');
      this.router.navigate([`/view-location/${location.id}`], {
        state: location
      });
    }
  }

  onImgError($event) {
    $event.target.src = '/assets/images/no-image.webp';
  }

  private async delete(location: any) {
    const confirmRet = await Modals.confirm({
      title: 'Confirmation',
      message: `Are you sure you want to delete '${location.title}'`,
      cancelButtonTitle: `Cancel`,
      okButtonTitle: `Delete`
    });
    if (confirmRet.value) {
      console.log('delete');
      this.locationsService.deleteLocationFromCollection(location.id, this.collection.tag)
        .pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse && err.status === 403) {
              Toast.show({
                position: 'bottom',
                text: `Only owner of the location can remove it`
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

          this.collection.locations = this.collection.locations.filter(res => res.id !== location.id);

          Toast.show({
            text: `${location.title} have been successfully deleted`,
            duration: 'long',
            position: 'bottom'
          });

        });
    }
  }

  public viewLocation(location: any) {
    console.log('view');
    this.router.navigate([`/view-location/${location.id}`], {
      state: location
    });
  }


  public async exportCollection() {
    const geojson = {
      type: `FeatureCollection`,
      features: []
    };
    this.collection.locations.map((loc: any) => {
      const newFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          // @ts-ignore
          coordinates: `${parseFloat(loc.latitude)}, ${parseFloat(loc.longitude)}`,
          properties: {
            title: loc.title,
            description: loc.description
          }
        }
      };
      geojson.features.push(newFeature);

    });
    const geoJsonString = JSON.stringify(geojson);
    try {
      /*      if (this.platform.is('capacitor')) {
              const result = await Filesystem.writeFile({
                data: geoJsonString,
                encoding: FilesystemEncoding.UTF8,
                recursive: true,
                directory: FilesystemDirectory.Documents,
                path: `${this.collection.tag}.json`
              });
              console.log('Wrote file', result);
            } else {*/
      this.fileSaverService.saveText(geoJsonString, `${this.collection.tag}.json`);
      //   }

    } catch (e) {
      Toast.show({
        text: `Unable to write file`,
        position: 'bottom',
        duration: 'long'
      });
    }
  }

}
