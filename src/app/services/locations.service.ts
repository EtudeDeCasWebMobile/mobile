import {Injectable} from '@angular/core';
import {from, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../environments';
import {LocationInterface} from '../models/location.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  public search = new Subject<string>();


  constructor(
    private readonly httpClient: HttpClient,
    private readonly storage: Storage
  ) {
  }

  public getAllOwnLocations(): Observable<{ locations: LocationInterface[] }> {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.get<{ locations: LocationInterface[] }>(`${environment.url}${url}/me/locations`);
        })
      );
  }

}
