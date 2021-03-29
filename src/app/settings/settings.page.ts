import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Storage} from '@ionic/storage';
import {Plugins} from '@capacitor/core';
import {AuthService} from '../services/auth.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {SettingsService} from '../services/settings.service';

const {Modals, Toast} = Plugins;

@AutoUnsubscribe()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  public serverUrl = '';
  public isAuthenticated: boolean;
  public user;

  constructor(
    private readonly storage: Storage,
    private readonly authService: AuthService,
    private readonly settingsService: SettingsService
  ) {
  }

  async ngOnInit() {
    this.serverUrl = await this.storage.get('server');

    this.authService.isAuthenticated$().subscribe(res => {
      this.isAuthenticated = res;
    });

    this.authService.getIsAuthnticatedSubject().subscribe(res => {
      this.isAuthenticated = res;
    });

  }

  public async changeServerUrl() {
    const {value} = await Modals.prompt({
      message: 'Server url',
      title: 'Server',
      cancelButtonTitle: 'Cancel',
      okButtonTitle: 'save'
    });

    this.serverUrl = value;
    this.storage.set('server', this.serverUrl);

    /*    if (!!value?.match(`[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)`) ||
          !!value?.match(`^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$`)) {
          this.serverUrl = value;
          this.storage.set('server', this.serverUrl);
        } else {
          await Toast.show({
            text: 'Enter a valid server url',
            duration: 'long',
            position: 'bottom'
          });
        }*/


  }

  ngOnDestroy(): void {
  }

  togglePosition($event: any) {
    from(this.storage.get('user'))
      .pipe(map(user => {
        const temp = {...user, sharePosition: $event.detail.checked};
        this.storage.set('user', temp);
        return temp;
      }))
      .subscribe(res => {
        this.user = res;
        this.settingsService.shareLocation$.next($event.detail.checked);
      });
  }

}
