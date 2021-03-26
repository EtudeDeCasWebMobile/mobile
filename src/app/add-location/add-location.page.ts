/// <reference types='@runette/leaflet-fullscreen' />

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, IonInput, ModalController} from '@ionic/angular';
import {LocationsService} from '../services/locations.service';
import {icon, latLng, LeafletMouseEvent, Map, marker, tileLayer} from 'leaflet';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ngx-custom-validators';
import {SelectTagsComponent} from './select-tags/select-tags.component';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit, AfterViewInit {

  public locationForm: FormGroup;
  public layers = [];
  public map: Map;

  public options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    detectRetina: true,
    zoom: 2,
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
    private readonly locationsService: LocationsService,
    private readonly alertController: AlertController,
    private readonly modalController: ModalController,
    private readonly fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }

  public initForm() {
    this.locationForm = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      tags: this.fb.array([]),
      description: ['', Validators.required],
      image: [],
      // @ts-ignore
      latitude: [null, Validators.compose([
        Validators.required,
        CustomValidators.number
      ])],
      // @ts-ignore
      longitude: [null, Validators.compose([
        Validators.required,
        CustomValidators.number
      ])]
    });
  }


  markLocation(event: LeafletMouseEvent) {
    this.layers = [
      marker([event.latlng.lat, event.latlng.lng], {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'leaflet/marker-icon.png',
          shadowUrl: 'leaflet/marker-shadow.png'
        })
      })
    ];
    this.locationForm.patchValue({
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    });
    console.log(event.latlng);
    console.log(this.locationForm.value);
  }

  public createLocation() {
    console.log(this.locationForm.valid);
    console.log(this.locationForm.getRawValue());
  }

  public onFileChange(event, inputPic: IonInput) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      console.log(file);
      inputPic.value = file.name;
    }
  }

  public async selectTags() {
    console.log('add location to collection');
    const modal = await this.modalController.create({
      component: SelectTagsComponent,
      componentProps: {}
    });

    modal.onDidDismiss().then((data) => {
      if (!!data) {
        console.log(data);
      }
    });

    return await modal.present();
  }

  onMapReady(map: Map) {
    this.map = map;
  }


}
