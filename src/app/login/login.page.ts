import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from 'ngx-custom-validators';
import {Plugins} from '@capacitor/core';
import {Storage} from '@ionic/storage';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {AuthService} from '../services/auth.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {LoginResponseDtoInterface} from '../models/login-response-dto.interface';
import {JwtHelperService} from '@auth0/angular-jwt';

const {Modals, Toast} = Plugins;

@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  loginForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly authService: AuthService,
    private readonly jwtHelperService: JwtHelperService
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.formBuilder.group({
      // @ts-ignore
      email: ['', Validators.compose([
        CustomValidators.email,
        Validators.required,
        Validators.maxLength(255)
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }

  public login(): void {
    if (this.loginForm.valid) {
      const values = this.loginForm.value;
      this.authService.login(values.email, values.password)
        .pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401 || err.status === 400) {
                Toast.show({
                  text: `Wrong email or password`,
                  duration: 'long',
                  position: 'bottom'
                });
              } else {
                Toast.show({
                  text: `An error occurred, try again`,
                  duration: 'long',
                  position: 'bottom'
                });
              }
            }
            return throwError(err);
          })
        )
        .subscribe((res: HttpResponse<LoginResponseDtoInterface>) => {
          Toast.show({
            text: `Successfully logged`,
            duration: 'long',
            position: 'bottom'
          });
          const body: LoginResponseDtoInterface = res.body;
          const jwtToken = res.headers.get('AuthToken');
          const decodedToken = this.jwtHelperService.decodeToken(jwtToken);
          console.log(body);
          this.storage.set('user', {
            authToken: jwtToken,
            email: decodedToken.sub,
            id: decodedToken.userId,
            sharePosition: false
          });

          this.router.navigateByUrl(`/home`); // redirect to show locations pages
        });
    } else {
      Toast.show({
        position: 'bottom',
        text: 'Invalid form'
      });
    }
  }

  public async loginAsAnonymous() {
    const {value, cancelled} = await Modals.prompt({
      title: 'Anonymous login',
      message: 'Enter url'
    });

    if (!!value && !cancelled) {
      let token;
      let url;
      try {
        url = new URL(value);
        console.log(url)
        token = url.searchParams.get('token');
      } catch (e) {
        console.error(e);
      }

      if (!!token) {
        let valid = true;
        try {
          this.jwtHelperService.decodeToken(token);
          valid = !this.jwtHelperService.isTokenExpired(token);
        } catch (e) {
          console.error(e);
          valid = false;
        }
        if (!valid) {
          Toast.show({
            text: `Expired link`,
            position: 'bottom',
            duration: 'long'
          });
        } else {
          console.log(token);
          this.storage.set('user', {
            authToken: token,
            email: 'Anonymous',
            id: 0,
            sharePosition: false
          });
          let storageUrls = await this.storage.get('urls') as any[];
          if (!storageUrls) {
            storageUrls = [];
          }

          storageUrls = storageUrls.filter(elm => elm.id !== 0);
          storageUrls.push({
            id: 0,
            urls: [value]
          });

          await this.storage.set('urls', storageUrls);

          this.router.navigateByUrl(`/home`); // redirect to show locations pages
        }
      } else {
        Toast.show({
          duration: 'long',
          position: 'bottom',
          text: `Invalid url`
        });
      }

    }

  }

  ngOnDestroy(): void {
  }


}
