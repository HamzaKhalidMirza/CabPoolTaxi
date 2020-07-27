import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClientAuthService } from 'src/common/sdk/custom/api/clientAuth.service';
import { AppError } from 'src/common/error/app-error';
import { BadInput } from 'src/common/error/bad-input';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit, AfterViewInit {

  loading = false;
  formSubmit = false;
  signupForm: FormGroup;
  clientObj: any;
  email;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private clientAuthService: ClientAuthService
  ) { }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.signupForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]
    });
    this.signupForm.reset();
  }

  get FormContols() {
    return this.signupForm.controls;
  }

  get emailId() {
    return this.signupForm.get('email');
  }

  async ngAfterViewInit() {
    this.loading = true;
    this.clientObj = await this.authService.getFieldDataFromStorage('client-auth');
    this.loading = false;
  }

  setEmail() {

    this.loading = true;
    this.formSubmit = true;

    if (this.signupForm.invalid) {
      this.loading = false;
      return;
    }

    this.clientAuthService.checkEmailExistance(this.signupForm.value)
      .subscribe(
        async (response) => {
          this.loading = false;
          this.clientObj.email = this.email;
          await this.authService.setFieldDataToStorage('client-auth', this.clientObj);
          this.router.navigateByUrl('/app-starter-auth/signup/password');
        },
        (error: AppError) => {
          this.loading = false;
          if (error instanceof BadInput) {
            if (error.originalError.error.message === 'Email already exits!') {
              this.emailId.setErrors({notUnique: true});
            } else {
              this.emailId.setErrors({required: true});
            }
          } else {
            console.log(error);
          }
        }
      );
  }
}
