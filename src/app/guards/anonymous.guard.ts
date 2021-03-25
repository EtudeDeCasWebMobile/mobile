import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getCurrentUser()
      .pipe(map(res => {
        if (res?.id === 0) {
          this.router.navigateByUrl('/home/collections');
        } else {
          console.log(res);
        }
        return !(res?.id === 0);
      }));
  }

}
