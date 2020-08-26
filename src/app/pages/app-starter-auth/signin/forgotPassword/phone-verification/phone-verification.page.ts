import { ClientAuthService } from './../../../../../../common/sdk/custom/api/clientAuth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppError } from 'src/common/error/app-error';
import { BadInput } from 'src/common/error/bad-input';
import { NotFoundError } from 'src/common/error/not-found-error';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationPage implements OnInit, AfterViewInit {

  loading = false;
  formSubmit = false;
  maxAttempts = false;
  resendStatus = false;
  signupForm: FormGroup;
  clientObj: any;
  phoneNumber: any;
  code;

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
    this.signupForm = this.formBuilder.group({
      code: [
        '',
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(9999)
        ]
      ]
    });
    this.signupForm.reset();
  }

  get FormContols() {
    return this.signupForm.controls;
  }

  get verificationCode() {
    return this.signupForm.get('code');
  }

  async ngAfterViewInit() {
    this.loading = true;
    this.clientObj = await this.authService.getFieldDataFromStorage('client-auth');
    this.phoneNumber = this.clientObj.phone;
    await this.getVerificationCode();
  }

  resendCode() {
    this.loading = true;
    this.getVerificationCode('resend');
  }

  getVerificationCode(sendStatus?: string) {
    this.maxAttempts = false;
    this.resendStatus = false;
    this.clientAuthService.forgotPassword(this.clientObj)
      .subscribe(
        response => {
          this.loading = false;
          if (sendStatus === 'resend') {
            this.resendStatus = true;
          }
        },
        (error: AppError) => {
          this.loading = false;
          if (error.originalError.error.message === 'Max send attempts reached' ||
            error.originalError.error.message === 'Too many requests') {
            this.maxAttempts = true;
            this.verificationCode.setErrors({ maxAttempts: true });
          } else {
            console.log(error);
          }
        }
      );
  }

  verifyCode() {

    this.loading = true;
    this.formSubmit = true;
    this.maxAttempts = false;
    this.resendStatus = false;

    if (this.maxAttempts) {
      this.loading = false;
      return;
    }

    if (this.signupForm.invalid) {
      this.loading = false;
      return;
    }
    this.clientObj.code = this.code;

    this.clientAuthService.verifyForgotPasswordCode(this.clientObj)
      .subscribe(
        response => {
          this.loading = false;
          this.router.navigateByUrl('/app-starter-auth/signin/password-reset');
        },
        (error: AppError) => {
          this.loading = false;

          if (error instanceof BadInput) {
            this.verificationCode.setErrors({ invalid: true });
          } else if (error instanceof NotFoundError) {
            this.verificationCode.setErrors({ invalid: true });
          } else {

            if (error.originalError.error.message === 'Invalid Code. Try again later!') {
              this.verificationCode.setErrors({ invalid: true });
            } else {
              console.log(error);
            }
          }
        }
      );
  }
}
