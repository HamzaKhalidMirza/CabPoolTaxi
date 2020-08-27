import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from './../../../../../../common/sdk/core/auth.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ClientTripSocket } from 'src/common/sdk/custom/sockets/clientTripSocket.service';

@Component({
  selector: 'app-report-admin',
  templateUrl: './report-admin.page.html',
  styleUrls: ['./report-admin.page.scss'],
})
export class ReportAdminPage implements OnInit {

  loadedTrip: any;
  formSubmit = false;
  form: FormGroup;
  isLoading: any;
  success: any;
  currentClient: any;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private clientTripSocket: ClientTripSocket,
    private navCtrl: NavController,
    private router: Router
  ) { }

  async ngOnInit() {
    this.formInitializer();

    const token = await this.authService.getTokenFromStorage();
    this.currentClient = await this.authService.getDecodedAccessToken(token).user;
  }

  formInitializer() {
    this.form = this.formBuilder.group({
      subject: [ "", [ Validators.required ]],
      message: [ "", [ Validators.required ]]
    });
    this.form.reset();
  }

  get subject() {
    return this.form.get("subject");
  }
  get message() {
    return this.form.get("message");
  }

  async ionViewWillEnter() {
    this.loadedTrip = await this.authService.getFieldDataFromStorage('report-loadedTrip')
    // await this.authService.clearFieldDataFromStorage('report-loadedTrip');
  }

  reportAdmin() {
    this.isLoading = true;
    this.formSubmit = true;

    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    const data = {
      reportedBy: 'client',
      subject: this.subject.value,
      message: this.message.value,
      trip: this.loadedTrip.id,
      client: this.currentClient.id,
      driver: this.loadedTrip.driver.id
    };

    this.clientTripSocket.reportAdmin(data)
      .subscribe(
        data => {
          this.isLoading = false;
          console.log(data);
          this.success = true;
          setTimeout(() => {
            this.navCtrl.pop()
            .then(() => {
              this.router.navigateByUrl('/tabs');
            })
            .catch(err => {
              console.log(err);
            });
          }, 3000);
        }, err => {
          this.isLoading = false;
          console.log(err);
        }
      );
  }

  goBack() {
    this.location.back();
  }

}
