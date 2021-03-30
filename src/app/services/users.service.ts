import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../environments';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';


@AutoUnsubscribe()
@Injectable({
  providedIn: 'root'
})
export class UsersService implements OnDestroy {

  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage,
  ) {
  }

  public serverUrl: string;

  ngOnDestroy(): void {
  }

  public createUser(email: string, password: string) {
    return from(this.storage.get('server'))
      .pipe(switchMap(url => {
        console.log(url);
        return this.http.post(`${environment.url}${url}/users`, {
          email,
          password
        });
      }));
  }


}
