import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {from, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage
  ) {
  }

  public isAuthenticated$(): Observable<boolean> {
    return from(this.storage.get('user'))
      .pipe(map(user => !!(!!user && user.authToken)));
  }

  public login(email: string, password: string) {
    return from(this.storage.get('server'))
      .pipe(switchMap(url => {
        console.log(url);
        return this.http.post(`${environment.url}${url}/auth`, {
          email,
          password
        });
      }));
  }

}
