import {Component, OnDestroy, OnInit} from '@angular/core';
import {from, interval, of} from 'rxjs';
import {Storage} from '@ionic/storage';
import {AlertController, MenuController} from '@ionic/angular';
import {Plugins} from '@capacitor/core';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {JwtHelperService} from '@auth0/angular-jwt';

const {Modals, Geolocation, Toast} = Plugins;

@AutoUnsubscribe()
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public isAuthenticated: boolean;
  public user: { authToken: string, id: number, email: string };

  constructor(
    private readonly storage: Storage,
    private readonly alertController: AlertController,
    private readonly router: Router,
    private readonly menuController: MenuController,
    private readonly authService: AuthService,
    private readonly jwtHelperService: JwtHelperService
  ) {
  }

  async ngOnInit() {

    this.authService.isAuthenticated$().subscribe(res => {
      this.isAuthenticated = res;
    });

    this.authService.getIsAuthnticatedSubject()
      .subscribe(res => {
        this.isAuthenticated = res;
        if (this.isAuthenticated) {
          this.authService.getCurrentUser().subscribe(user => {
            this.user = user;
          });
        }
      });

    from(this.storage.get('server'))
      .subscribe(async (result) => {
        if (!result) {
          const value = await this.showPrompt();
          console.log(value?.value);
          await this.storage.set('server', value.value);
        }
      });

    interval(1000)
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
            console.log('coords = ', res);
            // call api
          }
          return of(res);
        })
      )
      .subscribe(res => {
        console.log('api call results = ', res);
      });

  }

  async showPrompt() {

    const promptRet = await Modals.prompt({
      title: 'Add a server',
      inputPlaceholder: 'www.server.com',
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

  ngOnDestroy(): void {
  }

  logout() {
    this.menuController.close();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
