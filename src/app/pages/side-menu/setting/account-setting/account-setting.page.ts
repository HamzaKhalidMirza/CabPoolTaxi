import { FirebaseImageHandler } from './../../../../../common/sdk/custom/api/firebase-image-handler.service';
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { AccountSettingService } from "src/common/sdk/custom/api/accountSetting.service";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { AuthService } from "src/common/sdk/core/auth.service";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LoadingController } from "@ionic/angular";

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

@Component({
  selector: "app-account-setting",
  templateUrl: "./account-setting.page.html",
  styleUrls: ["./account-setting.page.scss"],
})
export class AccountSettingPage implements OnInit {

  currentUser: any;
  accountSettingForm: FormGroup;
  settingSavedSuccessful = false;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private accountSettingService: AccountSettingService,
    private firebaseImageHandler: FirebaseImageHandler
  ) {}

  ngOnInit() {
    this.formInitializer();
  }

  async ionViewWillEnter() {
    this.currentUser = await this.authService.getCurrentUser();
    this.accountSettingForm.patchValue({ photoAvatar: this.currentUser.photoAvatar });
    this.accountSettingForm.patchValue({ fName: this.currentUser.fName });
    this.accountSettingForm.patchValue({ lName: this.currentUser.lName });
    this.accountSettingForm.patchValue({ gender: this.currentUser.gender });
    this.accountSettingForm.patchValue({ dob: this.currentUser.dob });
  }

  formInitializer() {
    this.accountSettingForm = this.formBuilder.group({
      fName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]
      ],
      lName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]
      ],
      gender: [""],
      dob: [""],
      photoAvatar: ['']
    });
  }

  get FormContols() {
    return this.accountSettingForm.controls;
  }

  get FName() {
    return this.accountSettingForm.get("fName");
  }

  get LName() {
    return this.accountSettingForm.get("lName");
  }

  get Gender() {
    return this.accountSettingForm.get("gender");
  }

  get DOB() {
    return this.accountSettingForm.get("dob");
  }

  get Photo() {
    return this.accountSettingForm.get("photoAvatar");
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = dataURLtoFile(imageData, 'profile-image.jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.accountSettingForm.patchValue({ photoAvatar: imageFile });
  }

  async saveAccountSettings() {

    this.settingSavedSuccessful = false;

    if (this.accountSettingForm.invalid) {
      return;
    }

    this.loadingCtrl.create({}).then( async (loadingEl) => {
      loadingEl.present();

      const uploadImgObs = await this.firebaseImageHandler.uploadProfileImg(
        this.accountSettingForm.value,
        'clients'
      );
      uploadImgObs.subscribe(async (imgUrl) => {
        const updateSettingsObservable = await this.accountSettingService
          .updateAccountSettings(this.accountSettingForm.value, imgUrl);
  
        updateSettingsObservable
          .subscribe(
            (response: any) => {
              loadingEl.dismiss();
              this.accountSettingForm.reset();
  
              this.settingSavedSuccessful = true;
              this.currentUser = response.data.user;
              this.authService.setCurrentUser(this.currentUser);
              this.accountSettingForm.patchValue({ photoAvatar: this.currentUser.photoAvatar });
              this.accountSettingForm.patchValue({ fName: this.currentUser.fName });
              this.accountSettingForm.patchValue({ lName: this.currentUser.lName });
              this.accountSettingForm.patchValue({ gender: this.currentUser.gender });
              this.accountSettingForm.patchValue({ dob: this.currentUser.dob });
            },
            (error: AppError) => {
              this.firebaseImageHandler.deleteImage(imgUrl);
              loadingEl.dismiss();
              console.log(error);
            }
          );
      });  
    });

  }

  goBack() {
    this.location.back();
  }
}
