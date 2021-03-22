import {Injectable} from '@angular/core';
import {from, Subject} from 'rxjs';
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

}
