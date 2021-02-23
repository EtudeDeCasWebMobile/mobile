import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from 'ngx-custom-validators';
import {Plugins} from '@capacitor/core';
import {Storage} from '@ionic/storage';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

const {Modals} = Plugins;

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
    private readonly storage: Storage
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
