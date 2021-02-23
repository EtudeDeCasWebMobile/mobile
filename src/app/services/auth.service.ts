import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {from, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly storage: Storage
  ) {
  }

  public isAuthenticated$(): Observable<boolean> {
    return from(this.storage.get('user'))
      .pipe(switchMap(async (user) => !!user && user.authToken));
  }

  public isAuthenticated(): boolean {
    let isAuthenticated = false;
    this.storage.get('user').then(user => {
      if (!!user && user.authToken) {
        isAuthenticated = true;
      }
    });
    return isAuthenticated;
  }

}
