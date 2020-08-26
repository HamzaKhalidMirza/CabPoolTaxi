import { ClientAuthService } from './../../../../../../common/sdk/custom/api/clientAuth.service';
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { AuthService } from "src/common/sdk/core/auth.service";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit, AfterViewInit {

  loading = false;
  formSubmit = false;
  forgotPasswordForm: FormGroup;
  driverObj: any;
  password;
  confPassword;
  passwordResetSuccess: any;

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
    this.forgotPasswordForm = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ],
      conf_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          this.matchOtherValidator('password')
        ]
      ],
    });
    this.forgotPasswordForm.reset();
  }
  matchOtherValidator(otherControlName: string) {
    return (control: AbstractControl): { [key: string]: any } => {
      const otherControl: AbstractControl = control.root.get(otherControlName);

      if (otherControl) {
        const subscription: Subscription = otherControl.valueChanges.subscribe(
          () => {
            control.updateValueAndValidity();
            subscription.unsubscribe();
          }
        );
      }

      return otherControl && control.value !== otherControl.value
        ? { match: true }
        : null;
    };
  }

  async ngAfterViewInit() {
    this.loading = true;
    this.driverObj = await this.authService.getFieldDataFromStorage('client-auth');
    this.loading = false;
  }

  get FormContols() {
    return this.forgotPasswordForm.controls;
  }

  get passwordField() {
    return this.forgotPasswordForm.get('password');
  }

  getConfirmPasswordField() {
    return this.forgotPasswordForm.get('conf_password');
  }

  resetPassword() {

    this.loading = true;
    this.formSubmit = true;

    if (this.forgotPasswordForm.invalid) {
      this.loading = false;
      return;
    }
    this.driverObj.password = this.password;

    this.clientAuthService.resetPassword(this.driverObj)
      .subscribe(
        async (response) => {
          this.loading = false;
          await this.authService.clearFieldDataFromStorage('client-auth');
          this.passwordResetSuccess = true;
          setTimeout(() => {
            this.router.navigateByUrl('/app-starter-auth');
          }, 2000);
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
