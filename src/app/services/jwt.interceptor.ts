import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {switchMap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private readonly jwtHelperService: JwtHelperService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storage = this.injector.get(Storage);
    return from(storage.get('user')).pipe(
      switchMap(user => {
        if (!this.jwtHelperService.isTokenExpired(user?.authToken)) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user?.authToken}`,
            }
          });
        }
        return next.handle(request);
      }));

  }
}
