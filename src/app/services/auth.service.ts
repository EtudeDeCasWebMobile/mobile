import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {from, Observable, Subject} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments';
import {Toast} from '@capacitor/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new Subject<boolean>();

  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage,
    private readonly jwtHelperService: JwtHelperService
  ) {
  }

  public isAuthenticated$(): Observable<boolean> {
    return from(this.storage.get('user'))
      .pipe(map(user => {
        if (!!user && !!user.authToken && this.jwtHelperService.isTokenExpired(user.authToken)) {
          this.logout();
        }
        this.isAuthenticatedSubject.next(!!(!!user && !!user.authToken && !this.jwtHelperService.isTokenExpired(user.authToken)));
        return !!(!!user && !!user.authToken && !this.jwtHelperService.isTokenExpired(user.authToken));
      }));
  }

  public getIsAuthnticatedSubject(): Subject<boolean> {
    return this.isAuthenticatedSubject;
  }

  public login(email: string, password: string) {
    return from(this.storage.get('server'))
      .pipe(
        switchMap(url => {
          return this.http.post(`${environment.url}${url}/auth`, {
            email,
            password
          }, {observe: 'response'});
        }),
        tap(res => {
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  public logout() {
    this.storage.remove('user');
    this.isAuthenticatedSubject.next(false);
    Toast.show({
      text: 'Successfully disconnected',
      position: 'bottom',
      duration: 'long'
    });
  }

}
