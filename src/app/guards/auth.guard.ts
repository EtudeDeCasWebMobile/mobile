import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$()
      .pipe(tap(res => {
        if (!!res) {
          console.log(res)

          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/login');
        }
      }));
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$()
      .pipe(tap(res => {
        console.log(res)
        if (!!res) {
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/login');
        }
      }));
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$()
      .pipe(tap(res => {
        if (!!res) {
          console.log(res)

          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/login');
        }
      }));
  }


}
