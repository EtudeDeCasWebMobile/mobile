import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';
import {Storage} from '@ionic/storage';
import {catchError, switchMap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private readonly jwtHelperService: JwtHelperService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storage = this.injector.get(Storage);
    return from(storage.get('user')).pipe(
      switchMap(user => {
        if (!this.jwtHelperService.isTokenExpired(user?.authToken) && user?.id !== 0) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user?.authToken}`,
            }
          });
        }
        return next.handle(request)
          .pipe(
            catchError((errors) => {
              if (errors instanceof HttpErrorResponse && errors.status === 401) {
                //  this.authService.logout();
                //  this.router.navigateByUrl(`/`);
              }
              return throwError(errors);
            })
          );

      }));

  }
}
