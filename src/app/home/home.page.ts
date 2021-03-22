import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CollectionsService} from '../services/collections.service';
import {LocationsService} from '../services/locations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public searchValue: string;
  public isLocation: boolean;
  public isCollection: boolean;
  public isfilterShown = false;

  constructor(
    private readonly router: Router,
    private readonly collectionsService: CollectionsService,
    private readonly locationsService: LocationsService
  ) {

    if (router.url.trim().includes('/home/collections')) {
      this.isCollection = true;
      this.isLocation = false;
    } else if (router.url.trim().includes('/home/locations')) {
      this.isCollection = false;
      this.isLocation = true;
    }
  }

  ngOnInit() {
  }

  searchLocationOrCollection() {
    if (this.isCollection) {
      this.collectionsService.search.next(this.searchValue);
    } else if (this.isLocation) {
      this.locationsService.search.next(this.searchValue);
    }
  }

  public showFilter() {
    this.isfilterShown = !this.isfilterShown;
    this.collectionsService.showHideFilter.next(this.isfilterShown);
  }

}
