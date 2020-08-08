import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClientAuthService } from 'src/common/sdk/custom/api/clientAuth.service';
import { AppError } from 'src/common/error/app-error';
import { BadInput } from 'src/common/error/bad-input';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  loading = false;
  formSubmit = false;
  signupForm: FormGroup;
  clientObj: any;
  phone;

  constructor(
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private clientAuthService: ClientAuthService
  ) { }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.signupForm = this.formBuilder.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999)
        ]
      ]
    });
    this.signupForm.reset();
  }

  get FormContols() {
    return this.signupForm.controls;
  }

  get phoneNumber() {
    return this.signupForm.get('phone');
  }

  phoneNoVerification() {

    this.loading = true;
    this.formSubmit = true;

    if (this.signupForm.invalid) {
      this.loading = false;
      return;
    }

    this.clientAuthService.checkPhoneExistance(this.signupForm.value)
      .subscribe(
        async (response) => {
          this.loading = false;
          this.clientObj = new Object({
            phone: this.phone,
            countryCode: '+92'
          });

          await this.authService.clearFieldDataFromStorage('client-auth');
          await this.authService.setFieldDataToStorage('client-auth', this.clientObj);
          this.router.navigateByUrl('/app-starter-auth/signup/phone-verification');
        },
        (error: AppError) => {
          console.log(error);
          this.loading = false;
          if (error instanceof BadInput) {
            if (error.originalError.error.message === 'Phone Number already exits!') {
              this.phoneNumber.setErrors({notUnique: true});
            } else {
              this.phoneNumber.setErrors({required: true});
            }
          } else {
            throw error;
          }
        }
      );

  }

  goBack() {
    this.location.back();
  }

}
