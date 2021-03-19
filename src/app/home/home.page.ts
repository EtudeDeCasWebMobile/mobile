import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CollectionsService} from '../services/collections.service';

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
    private readonly collectionsService: CollectionsService
  ) {

    if (router.url.trim().includes('/home/collections')) {
      this.isCollection = true;
      this.isLocation = false;
    }
  }

  ngOnInit() {
  }

  searchLocationOrCollection() {
    console.log(this.searchValue);
  }

  public showFilter() {
    this.isfilterShown = !this.isfilterShown;
    this.collectionsService.showHideFilter.next(this.isfilterShown);
  }

}
