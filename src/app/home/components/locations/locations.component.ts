import {Component, OnInit} from '@angular/core';
import {LocationInterface} from '../../../models/location.interface';
import {LocationsService} from '../../../services/locations.service';
// @ts-ignore
import FuzzySearch from 'fuzzy-search';
import {catchError, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, Platform, PopoverController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../../services/auth.service';
import {LocationActionComponent} from './components/location-action/location-action.component';
import {Plugins} from '@capacitor/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

const {Toast, Haptics, Modals} = Plugins;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})

export class LocationsComponent implements OnInit {
  public locations: LocationInterface[] = [];
  public originalLocations: LocationInterface[] = [];
  public user;

  constructor(
    private readonly locationsService: LocationsService,
    private readonly router: Router,
    private readonly platform: Platform,
    private readonly popoverController: PopoverController,
    private readonly activatedRoute: ActivatedRoute,
    private readonly storage: Storage,
    private readonly modalController: ModalController,
    private readonly authService: AuthService
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
    this.locations = [];
    this.originalLocations = this.locations;

    this.locationsService.search.subscribe(res => {
      this.search(res);
    });
  }

  private loadData(): void {
    this.locationsService.getAllOwnLocations()
      .subscribe(res => {
        console.log(res.locations);
        this.locations = res.locations;
        this.originalLocations = res.locations;
      });
  }

  /**
   * addLocation
   */
  public addLocation() {
    this.router.navigateByUrl('/add-location');
  }

  private search(res: string) {
    console.log(res);
    this.locations = this.originalLocations;
    const searcher = new FuzzySearch(this.originalLocations, ['title','tags']);
    this.locations = searcher.search(res);
  }

  onImgError($event) {
    $event.target.src = '/assets/images/no-image.webp';
  }

  pullToRefresh($event: any) {
    this.loadData();
    $event.target.complete();

  }

  public async showPopup(event, location: any) {
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
    } else if (data === 'edit') {
      console.log('edit');
      this.router.navigate([`/edit-location/${location.id}`], {
        state: location
      });
    }
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
      this.locationsService.deleteLocations(location.id)
        .pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse && err.status === 403) {
              Toast.show({
                position: 'bottom',
                text: `Only owner of the location can delete it`
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
            text: `${location.title} have been successfully deleted`,
            duration: 'long',
            position: 'bottom'
          });

        });
    }
  }

  public viewLocation(location: any) {
    this.router.navigate([`/edit-location/${location.id}`], {
      state: location
    });
  }

}
