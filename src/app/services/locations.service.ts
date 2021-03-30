import {Injectable, OnDestroy} from '@angular/core';
import {from, Observable, Subject} from 'rxjs';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../environments';
import {LocationInterface} from '../models/location.interface';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Injectable({
  providedIn: 'root'
})
export class LocationsService implements OnDestroy {


  constructor(
    private readonly httpClient: HttpClient,
    private readonly storage: Storage
  ) {
  }

  public search = new Subject<string>();

  ngOnDestroy(): void {
  }

  public getAllOwnLocations(): Observable<{ locations: LocationInterface[] }> {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.get<{ locations: LocationInterface[] }>(`${environment.url}${url}/me/locations`);
        })
      );
  }

  public createOwnLocations(location: Partial<LocationInterface>) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.post(`${environment.url}${url}/me/locations`, location);
        })
      );
  }

  public deleteLocations(id: number) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.delete(`${environment.url}${url}/locations/${id}`);
        })
      );
  }

  public deleteLocationFromCollection(id: number, tag: string) {

    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          const req = new HttpRequest('DELETE', `${environment.url}${url}/locations/${id}/collections`);
          const newReq = req.clone({body: {tag}});
          return this.httpClient.request(newReq);
        })
      );
  }

  public getUserCurrentPosition(link: string) {
    return this.httpClient.get(`${environment.url}${link}`);
  }

  public updateLocations(id: number, location: Partial<LocationInterface>) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.put(`${environment.url}${url}/locations/${id}`, location);
        })
      );
  }

  public addTagToLocation(id: number, tag: string) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.post(`${environment.url}${url}/locations/${id}/collections`, {tag});
        })
      );
  }

  public updatePosition(id: number, position: { longitude: number, latitude: number }) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.put(`${environment.url}${url}/users/${id}/position`, position);
        })
      );
  }

  public sharePosition(id: number) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.post(`${environment.url}${url}/users/${id}/position/share`, {});
        })
      );
  }


}
