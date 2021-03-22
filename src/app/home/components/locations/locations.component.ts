import {Component, OnInit} from '@angular/core';
import {LocationInterface} from '../../../models/location.interface';
import {LocationsService} from '../../../services/locations.service';
// @ts-ignore
import FuzzySearch from 'fuzzy-search';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})

export class LocationsComponent implements OnInit {
  public locations: LocationInterface[] = [];
  public originalLocations: LocationInterface[] = [];

  constructor(
    private readonly locationsService: LocationsService
  ) {
  }

  ngOnInit() {
    this.locations = [
      {
        image: '',
        title: 'titre1',
        description: 'description1',
        coordinate: {
          lat: 0, lon: 0
        },
        tags: ['']
      },
      {
        image: '',
        title: 'titre2',
        description: 'description2',
        coordinate: {
          lat: 0, lon: 0
        },
        tags: ['']
      },
      {
        image: '',
        title: 'titre3',
        description: 'description3',
        coordinate: {
          lat: 0, lon: 0
        },
        tags: ['']
      },
      {
        image: '',
        title: 'titre4',
        description: 'description4',
        coordinate: {
          lat: 0, lon: 0
        },
        tags: ['']
      },
      {
        image: '',
        title: 'titre5',
        description: 'description5',
        coordinate: {
          lat: 0, lon: 0
        },
        tags: ['']
      }
    ];
    this.originalLocations = this.locations;

    this.locationsService.search.subscribe(res => {
      this.search(res);
    });
  }

  /**
   * addLocation
   */
  public addLocation() {
    console.log('adding location');

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
}
