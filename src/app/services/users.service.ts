import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Plugins} from '@capacitor/core';
import {Storage} from '@ionic/storage';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../environments';

const {Modals} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public serverUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage,
  ) {}

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
