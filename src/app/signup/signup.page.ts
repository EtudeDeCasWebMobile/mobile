import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from 'ngx-custom-validators';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Plugins} from '@capacitor/core';
import {UsersService} from '../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

const {Toast} = Plugins;

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
    private readonly usersService: UsersService
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
    const values = this.registerForm.value;
    if (this.registerForm.valid) {

      this.usersService.createUser(
        values.email,
        values.password
      )
        .pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 409) {
                Toast.show({
                  text: `User already exist`,
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
        .subscribe(res => {
          Toast.show({
            text: `User successfully created`,
            duration: 'long',
            position: 'bottom'
          });
          this.router.navigateByUrl(`/login`);
        });

    } else {

      Toast.show({
        position: 'bottom',
        text: 'Invalid form'
      });
    }

  }

  ngOnDestroy(): void {
  }


}
