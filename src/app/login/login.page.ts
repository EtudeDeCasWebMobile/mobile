import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from 'ngx-custom-validators';
import {Plugins} from '@capacitor/core';
import {Storage} from '@ionic/storage';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {AuthService} from '../services/auth.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {LoginResponseDtoInterface} from '../models/login-response-dto.interface';

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
    private readonly authService: AuthService
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
              if (err.status === 400) {
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
        .subscribe((res: LoginResponseDtoInterface) => {
          Toast.show({
            text: `Successfully logged`,
            duration: 'long',
            position: 'bottom'
          });
          // this.router.navigateByUrl(`/login`); //redirect to show locations pages
        });
    } else {
      Toast.show({
        position: 'bottom',
        text: 'Invalid form'
      });
    }
    console.log(this.loginForm);
    this.storage.set('user', {authToken: 'bablablabal'});
  }

  public async loginAsAnonymous() {
    const {value} = await Modals.prompt({
      title: 'Anonymous login',
      message: 'Enter a token'
    });
    console.log(value);
  }

  ngOnDestroy(): void {
  }


}
