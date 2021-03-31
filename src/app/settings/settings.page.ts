import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Storage} from '@ionic/storage';
import {Plugins} from '@capacitor/core';
import {AuthService} from '../services/auth.service';
import {from, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {SettingsService} from '../services/settings.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LocationsService} from '../services/locations.service';

const {Modals, Geolocation} = Plugins;

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
  public isShareAllowed: any;

  constructor(
    private readonly storage: Storage,
    private readonly authService: AuthService,
    private readonly settingsService: SettingsService,
    private readonly jwtHelperService: JwtHelperService,
    private readonly locationsService: LocationsService
  ) {
  }

  async ngOnInit() {
    this.serverUrl = await this.storage.get('server');
    this.isShareAllowed = !!(await this.storage.get('user'))?.sharePosition;

    this.authService.isAuthenticated$().subscribe(res => {
      this.isAuthenticated = res;
    });

    this.authService.getIsAuthnticatedSubject().subscribe(res => {
      this.isAuthenticated = res;
    });

  }

  public async changeServerUrl() {
    const {value, cancelled} = await Modals.prompt({
      message: 'Server url',
      title: 'Server',
      cancelButtonTitle: 'Cancel',
      inputText: this.serverUrl,
      okButtonTitle: 'save'
    });
    if (value?.trim()?.length > 0 && !cancelled) {
      this.serverUrl = value;
      await this.storage.set('server', this.serverUrl);
    }

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

  togglePosition(event: any) {
    from(this.storage.get('user'))
      .pipe(map(user => {
        const temp = {...user, sharePosition: event.detail.checked};
        this.storage.set('user', temp);
        if (event.detail.checked) {
          this.authService.getCurrentUser()
            .pipe(
              switchMap(res => {
                if (!!res && !this.jwtHelperService.isTokenExpired(res.authToken) && res.sharePosition) {
                  return from(Geolocation.getCurrentPosition({enableHighAccuracy: true}));
                }
                return of(null);
              }),
              switchMap(res => {
                if (!!res) {
                  return this.locationsService.updatePosition(this.user.id, {
                    latitude: res.coords.latitude,
                    longitude: res.coords.longitude
                  });
                }
                return of(res);
              })
            )
            .subscribe(res => {
              console.log('api call results = ', res);
            });
        }
        return temp;
      }))
      .subscribe(res => {
        this.user = res;
        console.log(event.detail.checked);
        this.settingsService.shareLocation$.next(event.detail.checked);
      });
  }

}
