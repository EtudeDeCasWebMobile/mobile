import {Component, OnInit} from '@angular/core';
import {LocationInterface} from '../../../models/location.interface';
import {LocationsService} from '../../../services/locations.service';
// @ts-ignore
import FuzzySearch from 'fuzzy-search';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, Platform, PopoverController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../../services/auth.service';


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
    const searcher = new FuzzySearch(this.originalLocations, ['title', 'tags']);
    this.locations = searcher.search(res);
  }

  onImgError($event) {
    $event.target.src = '/assets/images/no-image.webp';
  }

  pullToRefresh($event: any) {
    this.loadData();
    $event.target.complete();

  }

}
