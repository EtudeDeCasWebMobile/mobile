import { Component, OnInit } from '@angular/core';
import { LocationInterface } from '../../../models/location.interface';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  public locations: LocationInterface[]=[];

  constructor() { }

  ngOnInit(){}

}
