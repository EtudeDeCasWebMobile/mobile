import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$()
      .pipe(map(res => {
        console.log(res);
        if (!!res) {
          this.router.navigateByUrl('/home');
        } else {
          console.log(res);
        }
        return !res;
      }));
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$()
      .pipe(map(res => {
        console.log(res);
        if (!!res) {
          this.router.navigateByUrl('/home');
        } else {
          console.log(res);
        }
        return !res;
      }));
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$()
      .pipe(map(res => {
        console.log(res);
        if (!!res) {
          this.router.navigateByUrl('/home');
        } else {
          console.log(res);
        }
        return !res;
      }));
  }


}
