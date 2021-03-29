import {Component, Input, OnInit} from '@angular/core';
import {CollectionInterface} from '../../../models/collection.interface';
import {ModalController, Platform, PopoverController} from '@ionic/angular';
import {LocationInterface} from '../../../models/location.interface';
import {LocationsService} from '../../../services/locations.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../../services/auth.service';
import {catchError, switchMap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Plugins} from '@capacitor/core';

const {Toast} = Plugins;

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {

  @Input() collection: CollectionInterface;
  public locations: LocationInterface[] = [];
  public user;

  constructor(
    private readonly locationsService: LocationsService,
    private readonly router: Router,
    private readonly platform: Platform,
    private readonly popoverController: PopoverController,
    private readonly activatedRoute: ActivatedRoute,
    private readonly storage: Storage,
    private readonly authService: AuthService,
    private readonly modalController: ModalController
  ) {
    this.activatedRoute.queryParams
      .pipe(
        switchMap(res => this.authService.getCurrentUser())
      )
      .subscribe(res => {
        this.user = res;
        this.loadData();
      });
  }

  ngOnInit() {
  }

  private loadData(): void {
    this.locationsService.getAllOwnLocations()
      .subscribe(res => {
        this.collection.locations.map(l => {
          res.locations = res.locations.map(loc => {
            if (l.id === loc.id) {
              // @ts-ignore
              loc.checked = true;
            }
            return loc;
          });
        });

        console.log(res.locations);
        this.locations = res.locations;
      });
  }

  onImgError($event) {
    $event.target.src = '/assets/images/no-image.webp';
  }

  pullToRefresh($event: any) {
    this.loadData();
    $event.target.complete();

  }


  public saveCollection() {
    // @ts-ignore
    const locations = this.locations.filter(res => !!res?.checked);

    this.modalController.dismiss({
      saved: true,
      locations
    }, 'save');
    console.log(locations);
  }

  markUnmarkChecked(location: any) {
    location.checked = !(location.checked);
    if (location.checked) {
      this.locationsService.addTagToLocation(location.id, this.collection.tag)
        .pipe(
          catchError(err => {
            Toast.show({
              position: 'bottom',
              text: `An error occured, try again`
            });
            return throwError(err);
          })
        )
        .subscribe(res => {
          console.log(res);
        });
    } else {
      this.locationsService.deleteLocationFromCollection(location.id, this.collection.tag)
        .pipe(
          catchError(err => {
            Toast.show({
              position: 'bottom',
              text: `An error occured, try again`
            });
            return throwError(err);
          })
        )
        .subscribe(res => {
          console.log(res);
        });

    }
  }

}
