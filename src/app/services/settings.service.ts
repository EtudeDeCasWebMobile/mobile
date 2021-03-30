import {Injectable, OnDestroy} from '@angular/core';
import {from, Subject} from 'rxjs';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnDestroy {


  constructor(
    private readonly storage: Storage
  ) {
  }

  public shareLocation$ = new Subject<string>();

  ngOnDestroy(): void {
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
