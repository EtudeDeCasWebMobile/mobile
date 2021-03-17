import {Component, OnInit} from '@angular/core';
import {LocationInterface} from '../../../models/location.interface';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})

export class LocationsComponent implements OnInit {
  public locations: LocationInterface[] = [];

  constructor() {
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
        title: 'titre1',
        description: 'description1',
        coordinate: {
          lat: 0, lon: 0
        },
        tags: ['']
      },
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
        title: 'titre1',
        description: 'description1',
        coordinate: {
          lat: 0, lon: 0
        },
        tags: ['']
      }
    ];
  }

  /**
   * addLocation
   */
  public addLocation() {
    console.log('adding location');

  }

}
