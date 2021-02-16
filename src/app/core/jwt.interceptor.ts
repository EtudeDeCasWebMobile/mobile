import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {Storage} from '@ionic/storage';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storage = this.injector.get(Storage);
    from(storage.get('user')).subscribe(user => {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user?.authToken}`,
        }
      });
    });

    return next.handle(request);

  }
}
