import { ClientAuthService } from './../../../../../common/sdk/custom/api/clientAuth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppError } from 'src/common/error/app-error';
import { BadInput } from 'src/common/error/bad-input';
import { AuthService } from 'src/common/sdk/core/auth.service';
import { NotFoundError } from 'src/common/error/not-found-error';
import { UnAuthorized } from 'src/common/error/unauthorized-error';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit, AfterViewInit {

  loading = false;
  formSubmit = false;
  loginForm: FormGroup;
  driverObj: any;
  password;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private clientAuthService: ClientAuthService
  ) { }

  ngOnInit() {
    this.formInitializer();
  }
  ionViewWillEnter() {
  }
  ionViewWillLeave() {
  }

  formInitializer() {
    this.loginForm = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ]
    });
    this.loginForm.reset();
  }

  get FormContols() {
    return this.loginForm.controls;
  }

  get passwordField() {
    return this.loginForm.get('password');
  }

  async ngAfterViewInit() {
    this.loading = true;
    this.driverObj = await this.authService.getFieldDataFromStorage('client-auth');
    this.loading = false;
  }

  login() {

    this.loading = true;
    this.formSubmit = true;

    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }
    this.driverObj.password = this.password;

    this.clientAuthService.loginClient(this.driverObj)
      .subscribe(
        async (response) => {
          this.loading = false;
          await this.authService.clearFieldDataFromStorage('client-auth');
          await this.authService.saveTokenToStorage(response.token);
          await this.authService.setCurrentUser(response.data.user);
          this.router.navigateByUrl('/tabs');
        },
        (error: AppError) => {
          this.loading = false;
          if (error instanceof BadInput) {
            this.passwordField.setErrors({ required: true });
          } else if (error instanceof NotFoundError) {
            this.passwordField.setErrors({ notFound: true });
          } else if (error instanceof UnAuthorized) {
            this.passwordField.setErrors({ notFound: true });
          } else {
            console.log('error', error);
          }
        }
      );
  }
}
