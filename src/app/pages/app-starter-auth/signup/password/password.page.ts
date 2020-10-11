import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClientAuthService } from 'src/common/sdk/custom/api/clientAuth.service';
import { AppError } from 'src/common/error/app-error';
import { BadInput } from 'src/common/error/bad-input';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit, AfterViewInit {

  loading = false;
  formSubmit = false;
  signupForm: FormGroup;
  clientObj: any;
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

  formInitializer() {
    this.signupForm = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ]
    });
    this.signupForm.reset();
  }

  get FormContols() {
    return this.signupForm.controls;
  }

  get passwordField() {
    return this.signupForm.get('password');
  }

  async ngAfterViewInit() {
    this.loading = true;
    this.clientObj = await this.authService.getFieldDataFromStorage('client-auth');
    this.loading = false;
  }

  setPasswordAndSignup() {

    this.loading = true;
    this.formSubmit = true;

    if (this.signupForm.invalid) {
      this.loading = false;
      return;
    }
    this.clientObj.password = this.password;

    this.clientAuthService.registerClient(this.clientObj)
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
          console.log(error);
        }
      );
  }
}
