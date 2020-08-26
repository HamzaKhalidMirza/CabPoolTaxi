import { ClientAuthService } from './../../../../common/sdk/custom/api/clientAuth.service';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { AuthService } from "src/common/sdk/core/auth.service";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.page.html",
  styleUrls: ["./signin.page.scss"],
})
export class SigninPage implements OnInit {
  loading = false;
  formSubmit = false;
  loginForm: FormGroup;
  driverObj: any;
  phone;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private clientAuthService: ClientAuthService
  ) {}

  ngOnInit() {
    this.formInitializer();
  }
  ionViewWillEnter() {
  }
  ionViewWillLeave() {
  }

  formInitializer() {
    this.loginForm = this.formBuilder.group({
      phone: [
        "",
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
    });
    this.loginForm.reset();
  }

  get FormContols() {
    return this.loginForm.controls;
  }

  get phoneNumber() {
    return this.loginForm.get("phone");
  }

  phoneNoVerification() {
    this.loading = true;
    this.formSubmit = true;

    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    this.clientAuthService.verifyPhoneExistance(this.loginForm.value).subscribe(
      async (response) => {
        this.loading = false;
        this.driverObj = new Object({
          phone: this.phone,
          countryCode: '+92'
      });

        await this.authService.clearFieldDataFromStorage("client-auth");
        await this.authService.setFieldDataToStorage(
          "client-auth",
          this.driverObj
        );
        this.router.navigateByUrl("/app-starter-auth/signin/password");
      },
      (error: AppError) => {
        this.loading = false;
        if (error instanceof BadInput) {
          this.phoneNumber.setErrors({ required: true });
        } else if (error instanceof NotFoundError) {
          this.phoneNumber.setErrors({ notFound: true });
        } else if (error instanceof UnAuthorized) {
          this.phoneNumber.setErrors({ notFound: true });
        } else {
          console.log("error", error);
        }
      }
    );
  }
}
