import { RequestService } from 'src/common/sdk/custom/api/request.service';
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { LoadingController, ToastController } from "@ionic/angular";
import { Location } from "@angular/common";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { AuthService } from 'src/common/sdk/core/auth.service';
import { TripService } from 'src/common/sdk/custom/api/trip.service';

@Component({
  selector: 'app-ride-request',
  templateUrl: './ride-request.page.html',
  styleUrls: ['./ride-request.page.scss'],
})
export class RideRequestPage implements OnInit {
  seatsCounter: number = 1;
  viewNote: any;
  tabBarElement: any;
  loadedTrip: any;
  requestData: any;

  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private loadingCtrl: LoadingController,
    private tripService: TripService,
    private requestService: RequestService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.tabBarElement.style.display = 'none';
    this.loadedTrip = await this.authService.getFieldDataFromStorage('loadedTrip');
    this.requestData = await this.authService.getFieldDataFromStorage('request-data');
    console.log(this.loadedTrip, this.requestData);
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  continue() {
    this.requestData.seatsReserved = this.seatsCounter;
    this.requestData.driver = this.loadedTrip.driver.id;
    if (this.viewNote) {
      this.requestData.description = this.viewNote;
    }
    console.log(this.requestData);

    this.loadingCtrl
    .create()
    .then(async (loading) => {
      loading.present();

      const tripbookingObs = await this.requestService.requestRide(
        this.requestData, this.loadedTrip.id
      );
      tripbookingObs.subscribe(
        async (response) => {
          loading.dismiss();
          this.toastCtrl
            .create({
              message: "Request Sent successfully",
              duration: 3000,
              position: "bottom"
            })
            .then((toast) => {
              toast.present();
            })
            .catch((err) => {
              console.log(err);
            });

          this.seatsCounter = 1;
          this.viewNote = "";
          await this.authService.clearFieldDataFromStorage("location-filtered-data");
          this.authService.clearFieldDataFromStorage("loadedTrip");
          this.authService.clearFieldDataFromStorage("request-data");

          setTimeout(() => {
            this.router.navigateByUrl('/tabs');
          }, 3000);
        },
        (error: AppError) => {
          loading.dismiss();
          if (error instanceof BadInput) {
            console.log("error B", error);
          } else if (error instanceof NotFoundError) {
            console.log("error N", error);
          } else if (error instanceof UnAuthorized) {
            console.log("error U", error);
          } else {
            console.log("error", error);
          }
        }
      );
    })
    .catch((err) => {
      this.loadingCtrl.dismiss();
      console.log(err);
    });
  }

  incrementSeat() {
    if (this.seatsCounter === this.loadedTrip.seatsAvailable) {
      return;
    }
    this.seatsCounter++;
  }

  decrementSeat() {
    if (this.seatsCounter === 1) {
      return;
    }
    this.seatsCounter--;
  }

  goBack() {
    this.location.back();
  }
}
