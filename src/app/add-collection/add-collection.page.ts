import {Component, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {CollectionsService} from '../services/collections.service';
import {catchError, mergeMap, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {from, of, throwError} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Geojson} from 'geojson-parser-js';
import {AuthService} from '../services/auth.service';
import {LocationsService} from '../services/locations.service';


const {Toast, Modals} = Plugins;

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.page.html',
  styleUrls: ['./add-collection.page.scss'],
})
export class AddCollectionPage implements OnInit {

  public user;

  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly locationsService: LocationsService
  ) {
    this.activatedRoute.queryParams
      .pipe(
        switchMap(res => this.authService.getCurrentUser())
      ).subscribe(res => {
      this.user = res;
    });
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

  public async addCollectionUrl() {
    // @ts-ignore
    const {value, cancelled} = await Modals.prompt({
      okButtonTitle: 'Save',
      title: `Add collection url`,
      cancelButtonTitle: `Cancel`,
      inputPlaceholder: `Tag`
    });
    if (value?.trim()?.length > 0 && !cancelled) {
      // create the collection
      from(this.storage.get('user'))
        .pipe(
          switchMap((res) => {
            this.user = res;
            return from(this.storage.get('urls'));
          }),
          switchMap((res) => {
            let oldVal = [];
            if (!!res) {
              oldVal = res;
            } else {
              oldVal.push({
                id: this.user.id,
                urls: []
              });
            }
            if (!(oldVal.find(elm => elm.id === this.user.id))) {
              oldVal.push({
                id: this.user.id,
                urls: []
              });
            }


            oldVal = oldVal.map(elm => {
              if (elm.id === this.user.id) {
                elm.urls.push(value);
              }
              return elm;
            });

            return from(this.storage.set('urls', oldVal));
          })
        ).subscribe(res => {
        console.log(res);
        Toast.show({
          text: `Link successfully added`,
          position: 'bottom',
          duration: 'long'
        });
      });

    }

  }

  public onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      const tag = file.name.replace('.geojson', '');
      console.log(tag);
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (!Geojson.isValid(data as string)) {
          Toast.show({
            duration: 'long',
            position: 'bottom',
            text: `Invalid geojson file`
          });
        } else {
          const geojson = Geojson.parse(data as string);
          console.log(geojson);
          this.collectionsService.createCollection(tag)
            .pipe(
              catchError((err) => {
                if (err instanceof HttpErrorResponse && err.status === 409) {
                  return of(null);
                }
                return throwError(err);
              }),
              switchMap(res => {
                const reqArr = [];
                geojson.geometries.map(q => {
                  reqArr.push({
                    title: q.featureProperties.find(a => a.key === 'title').value,
                    // @ts-ignore
                    latitude: q.coordinate.lat,
                    // @ts-ignore
                    longitude: q.coordinate.lng,
                    description: q.featureProperties.find(a => a.key === 'description').value,
                    image: q.featureProperties.find(a => a.key === 'image').value,
                    tags: [tag]
                  });
                });
                console.log(res);
                return reqArr;
              }),
              mergeMap((res: any) => {
                return this.locationsService.createOwnLocations(res)
                  .pipe(
                    catchError(e => {
                      if (e instanceof HttpErrorResponse && e.status === 409) {
                        const id = e.error.message.match(/id=(\d+)/i)[0].split('=')[1] as unknown as number;
                        return this.locationsService.addTagToLocation(id, tag);
                      }
                      return of(null);
                    })
                  );
              })
            )
            .subscribe(res => {
              Toast.show({
                duration: 'long',
                position: 'bottom',
                text: `Import successfully finished`
              });
              console.log(res);
            });
        }

      };
      reader.readAsText(file, 'UTF-8');
    }
  }


}
