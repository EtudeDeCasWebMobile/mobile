import {Injectable} from '@angular/core';
import {from, Subject} from 'rxjs';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public shareLocation$ = new Subject<string>();


  constructor(
    private readonly storage: Storage
  ) {
  }

  public isShareLocationActivate() {
    return from(this.storage.get(`user`))
      .pipe(
        map(user => {
          return user.sharePosition;
        })
      );
  }

}
