import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {from, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments';
import {Toast} from '@capacitor/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage,
    private readonly jwtHelperService: JwtHelperService
  ) {
  }

  public isAuthenticated$(): Observable<boolean> {
    return from(this.storage.get('user'))
      .pipe(map(user => {
        return !!(!!user && !!user.authToken && !this.jwtHelperService.isTokenExpired(user.authToken));
      }));
  }

  public login(email: string, password: string) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.http.post(`${environment.url}${url}/auth`, {
            email,
            password
          }, {observe: 'response'});
        })
      );
  }

  public logout() {
    this.storage.remove('user');
    Toast.show({
      text: 'Successfully disconnected',
      position: 'bottom',
      duration: 'long'
    });
  }

}
