import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from 'ngx-custom-validators';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {

  registerForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {

    const password = this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(255)
    ]));
    // @ts-ignore
    const confirmPassword = this.formBuilder.control('', CustomValidators.equalTo(password));

    this.registerForm = this.formBuilder.group({
      // @ts-ignore
      email: ['', Validators.compose([
        CustomValidators.email,
        Validators.required,
        Validators.maxLength(255)
      ])],
      password,
      confirmPassword
    });
  }

  public signup(): void {
    console.log(this.registerForm);
  }

  ngOnDestroy(): void {
  }


}
