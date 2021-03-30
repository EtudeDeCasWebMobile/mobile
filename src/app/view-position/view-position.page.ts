import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {icon, latLng, LeafletMouseEvent, Map, marker, tileLayer} from 'leaflet';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationsService} from '../services/locations.service';
import {AlertController, IonInput, ModalController} from '@ionic/angular';
import {CustomValidators} from 'ngx-custom-validators';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Toast} from '@capacitor/core';
import {throwError} from 'rxjs';
import {SelectTagsComponent} from '../add-location/select-tags/select-tags.component';

@Component({
  selector: 'app-view-position',
  templateUrl: './view-position.page.html',
  styleUrls: ['./view-position.page.scss'],
})
export class ViewPositionPage implements OnInit, AfterViewInit {

  public user;
  public layers = [];
  public map: Map;

  public options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    detectRetina: true,
    zoom: 1,
    center: latLng([46.879966, -121.726909])
  };

  public fullscreenOptions: { [key: string]: any } = {
    position: 'topleft',
    title: 'View Fullscreen',
    titleCancel: 'Exit Fullscreen',
  };

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertController: AlertController,
    private readonly modalController: ModalController,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      this.user = this.router.getCurrentNavigation().extras.state;
      if (!this.user) {
        this.router.navigateByUrl('/home/locations');
      }

      this.layers = [
        marker([this?.user?.latitude, this?.user?.longitude], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        })
      ];

      this.options.center = latLng([this?.user?.latitude, this?.user?.longitude]);
      this.options.zoom = 12;
    });
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }

  onMapReady(map: Map) {
    this.map = map;
  }


}
