import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly storage: Storage) {
  }

  public isAuthenticated(): boolean {
    let isAuthenticated = false;
    from(this.storage.get('user')).subscribe(user => {
      if (!!user && user.authToken) {
        isAuthenticated = true;
      }
    });
    return isAuthenticated;
  }
}
