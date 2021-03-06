import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
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
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.page.html',
  styleUrls: ['./edit-location.page.scss'],
})
export class EditLocationPage implements OnInit, AfterViewInit, OnDestroy {

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


  get tags(): FormArray {
    return this.locationForm.get('tags') as FormArray;
  }

  public locationForm: FormGroup;
  public location;
  public layers = [];
  public map: Map;
  public collectionsStrings: string;

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
  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      this.location = this.router.getCurrentNavigation().extras.state;
      console.log(this.location);
      if (!this.location) {
        this.router.navigateByUrl('/home/locations');
      }
      this.locationForm.patchValue({
        title: this.location?.title,
        tags: this.location?.tags,
        description: this.location?.description,
        image: this.location?.image || '',
        latitude: this.location?.latitude,
        longitude: this.location?.longitude
      });

      this.layers = [
        marker([this.location?.latitude, this.location?.longitude], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        })
      ];

      this.options.center = latLng([this.location?.latitude, this.location?.longitude]);
      this.options.zoom = 12;
    });
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
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
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
    if (this.locationForm.valid) {
      const values = this.locationForm.value;
      console.log(values);
      this.locationsService.updateLocations(this.location.id, values)
        .pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse && err.status === 409) {
              Toast.show({
                position: 'bottom',
                text: `Location already exist`
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
        .subscribe(res => {
          Toast.show({
            duration: 'long',
            position: 'bottom',
            text: `Location successfully created`
          });
          this.router.navigateByUrl(`/home/locations`);
        });
    }
  }

  public onFileChange(event, inputPic: IonInput) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      console.log(file);
      inputPic.value = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        console.log(data);
        this.locationForm.patchValue({
          image: data
        });
      };
      reader.readAsDataURL(file);
    }
  }

  public async selectTags() {
    console.log('add location to collection');
    const modal = await this.modalController.create({
      component: SelectTagsComponent,
      componentProps: {location: this.location}
    });

    modal.onDidDismiss().then((data: any) => {
      if (!!data.data) {
        this.collectionsStrings = '';
        const collectionsString = data?.data?.collections?.map(res => res.tag);
        collectionsString?.map(res => {
          if (this.collectionsStrings?.length > 0) {
            this.collectionsStrings = this.collectionsStrings + `, ` + res;
          } else {
            this.collectionsStrings = this.collectionsStrings + res;
          }
          this.tags.push(new FormControl(res));
        });
        console.log(collectionsString);
      }
    });

    return await modal.present();
  }

  onMapReady(map: Map) {
    this.map = map;
  }


}
