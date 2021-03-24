import {Injectable} from '@angular/core';
import {from, Observable, of, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../environments';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  public showHideFilter = new Subject<boolean>();
  public search = new Subject<string>();

  constructor(
    private readonly httpClient: HttpClient,
    private readonly storage: Storage
  ) {
  }

  public getAllOwnedCollection() {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.get(`${environment.url}${url}/me/collections`);
        })
      );
  }

  public generateLink(id: string): Observable<string> {
    let link;
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          link = url;
          return this.storage.get('user');
        }),
        switchMap(user => {
          return of(`${environment.url}${link}/collections/${id}?token=${user?.authToken}`);
        })
      );
  }

  public findCollection(id: number) {
    let link;
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          link = url;
          return this.storage.get('user');
        }),
        switchMap(user => {
          return this.httpClient.get(`${environment.url}${link}/collections/${id}?token=${user?.authToken}`);
        })
      );
  }

  public findSharedCollection(link: string) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(user => {
          return this.httpClient.get(`${environment.url}${link}`);
        })
      );
  }

  public createCollection(tag: string) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.post(`${environment.url}${url}/me/collections`, {
            tag
          });
        })
      );
  }

  public updateCollection(id: number, tag: string) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.put(`${environment.url}${url}/collections/${id}`, {
            tag
          });
        })
      );
  }

  public shareCollection(id: number) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.post(`${environment.url}${url}/collections/${id}/share`, {});
        })
      );
  }

  public deleteCollection(id: number) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.httpClient.delete(`${environment.url}${url}/collections/${id}`);
        })
      );
  }

}
