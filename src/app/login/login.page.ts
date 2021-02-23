import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from 'ngx-custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
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
  }

}
