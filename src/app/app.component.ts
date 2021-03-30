import {Component, OnInit} from '@angular/core';
import {from, interval, of, throwError} from 'rxjs';
import {Storage} from '@ionic/storage';
import {AlertController, MenuController} from '@ionic/angular';
import {Plugins} from '@capacitor/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {catchError, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LocationsService} from './services/locations.service';
import {SettingsService} from './services/settings.service';

const {Modals, Geolocation, Toast, Clipboard} = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public isAuthenticated: boolean;
  public user: { authToken: string, id: number, email: string };
  public shareLocation: boolean;

  constructor(
    private readonly storage: Storage,
    private readonly alertController: AlertController,
    private readonly router: Router,
    private readonly menuController: MenuController,
    private readonly authService: AuthService,
    private readonly jwtHelperService: JwtHelperService,
    private readonly locationsService: LocationsService,
    private readonly settingsService: SettingsService,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    console.log('kkk');
    this.activatedRoute.queryParams.subscribe(ignore => {

      this.authService.isAuthenticated$().subscribe(res => {
        this.isAuthenticated = res;
      });

      this.authService.getIsAuthnticatedSubject()
        .subscribe(res => {
          this.isAuthenticated = res;
          if (this.isAuthenticated) {
            this.authService.getCurrentUser().subscribe(user => {
              this.user = user;
              // @ts-ignore
              this.shareLocation = user?.shareLocation;
            });
          }
        });

      this.settingsService.shareLocation$.subscribe(res => {
        console.log('share subject', res);
        // @ts-ignore
        this.shareLocation = res;
      });

      from(this.storage.get('server'))
        .subscribe(async (result) => {
          if (!result) {
            const {value, cancelled} = await this.showPrompt();
            if (value?.trim()?.length > 0 && !cancelled) {
              await this.storage.set('server', value);
              console.log(value);
            }
          }
        });

      interval(1000 * 60)
        .pipe(
          switchMap(res => this.authService.getCurrentUser()),
          switchMap(res => {
            if (!!res && !this.jwtHelperService.isTokenExpired(res.authToken) && res.sharePosition) {
              return from(Geolocation.getCurrentPosition({enableHighAccuracy: true}));
            }
            return of(null);
          }),
          distinctUntilChanged(),
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

    });

  }

  async showPrompt() {

    const promptRet = await Modals.prompt({
      title: 'Add a server',
      inputPlaceholder: 'http://www.server.com',
      okButtonTitle: 'Save',
      message: `Add a server URL/IP address`
    });
    /*    if (!(!!promptRet?.value?.match(`[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)`) ||
          !!promptRet?.value?.match(`^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$`))) {
          promptRet = await this.showPrompt();
        }*/
    return promptRet;

  }

  public navigate(s: string) {
    this.menuController.close();
    this.router.navigateByUrl(s);
  }

  public logout() {
    this.menuController.close();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  public async sharePosition() {
    const isShareActivated = (await this.storage.get('user')).sharePosition;
    if (isShareActivated) {
      this.locationsService.sharePosition(this.user.id)
        .pipe(
          catchError((err) => {
            Toast.show({
              position: 'bottom',
              text: `An error occured, try again`
            });
            return throwError(err);
          })
        )
        .subscribe(async (res: any) => {
          console.log(`${res.link}?token=${res.token}`);
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Shared link',
            inputs: [
              {
                name: 'token',
                type: 'text',
                id: 'token',
                value: `${res.link}?token=${res.token}`,
                attributes: {readonly: true}
              }
            ],
            buttons: [
              {
                text: 'Copy',
                handler: () => {
                  Clipboard.write({string: `${res.link}?token=${res.token}`});
                  Toast.show({
                    duration: 'short',
                    position: 'bottom',
                    text: 'Link have been copied'
                  });
                }
              }
            ]
          });

          await alert.present();
        });
    } else {
      Toast.show({
        text: `You have to activate share option first`,
        position: 'bottom',
        duration: 'long'
      });
    }

  }

  public async viewUserSharedLocation() {
    // @ts-ignore
    const {value, cancelled} = await Modals.prompt({
      title: 'Visualize shared user position',
      inputPlaceholder: 'http://exemple.com?token=your_token',
      okButtonTitle: 'Visualize',
    });

    if (value.trim() && !cancelled) {
      this.locationsService.getUserCurrentPosition(value)
        .pipe(
          catchError((e) => {
            Toast.show({
              duration: 'long',
              position: 'bottom',
              text: `An error occurred`
            });
            return throwError(e);
          }),
        )
        .subscribe(res => {
          this.router.navigate([`view-position`], {
            state: {...res, ...this.user}
          });
        });
    }

  }

}
