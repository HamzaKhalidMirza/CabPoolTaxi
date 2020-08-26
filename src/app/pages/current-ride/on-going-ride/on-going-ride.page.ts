import { ClientTripSocket } from "./../../../../common/sdk/custom/sockets/clientTripSocket.service";
import { Router } from "@angular/router";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { Subscription } from "rxjs";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import { CurrentLocationService } from "src/common/sdk/custom/maps/currentLocation.service";
import { AuthService } from "src/common/sdk/core/auth.service";
import { AlertController, ModalController, ToastController, NavController } from "@ionic/angular";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { BookingSubmissionComponent } from '../booking-submission/booking-submission.component';
import { Location } from '@angular/common';

@Component({
  selector: "app-on-going-ride",
  templateUrl: "./on-going-ride.page.html",
  styleUrls: ["./on-going-ride.page.scss"],
})
export class OnGoingRidePage implements OnInit {
  @ViewChild("map") mapEl: ElementRef;
  googleMapsSdk: any;
  directionsService: any;
  directionsDisplay: any;
  map: any;
  marker: any;
  center: any;

  currentLocationObs: Subscription;
  clientSocketObs: Subscription;
  driverArrivalObs: Subscription;
  driverPickupObs: Subscription;
  driverDropoffObs: Subscription;

  tripSourceLocation: any;
  tripDestLocation: any;
  loadedTrip: any;
  bookingTrips: any = [];
  clients: any = [];
  currentClient: any;
  driver: any;
  vehicle: any;

  isLoading: any;
  arrived: any;
  pickup: any;
  dropoff: any;

  constructor(
    private baseMapService: BaseMapService,
    private renderer: Renderer2,
    private currentLocationService: CurrentLocationService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private clientTripSocket: ClientTripSocket,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private location: Location,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.isLoading = true;
    this.createMap();
    const token = await this.authService.getTokenFromStorage();
    this.currentClient = await this.authService.getDecodedAccessToken(token).user;
    this.loadedTrip = await this.authService.getFieldDataFromStorage("on-going-trip");
    await this.getCurrentTripData();

    this.getDriverLocaion();
    this.listenForDriverLocation();
    this.listenForDriverArrival();
    this.listenForDriverPickup();
    this.listenForDriverDropoff();
  }
  ionViewDidEnter() {
    console.log("ionViewDidEnter");
  }
  ionViewWillLeave() {
    console.log("ionViewWillLeave");
  }
  ionViewDidLeave() {
    console.log("ionViewDidLeave");
    this.currentLocationObs.unsubscribe();
    this.clientSocketObs.unsubscribe();

    if(this.driverArrivalObs) {
      this.driverArrivalObs.unsubscribe();
    }
    if(this.driverPickupObs) {
      this.driverPickupObs.unsubscribe();
    }
    if(this.driverDropoffObs) {
      this.driverDropoffObs.unsubscribe();
    }
  }
  ngOnDestroy() {
    console.log("ngOnDestroy");
  }

  getDriverLocaion() {
    this.clientTripSocket
    .getDriverTrackings({
      client: this.currentClient.id,
      trip: this.loadedTrip.id,
    })
    .subscribe(
      (data) => {
        const locations = data.locations;
        console.log('2');
        this.center = new this.googleMapsSdk.LatLng(
          locations[locations.length - 1].coordinates[0],
          locations[locations.length - 1].coordinates[1]
        );
        this.map.panTo(this.center);
        this.marker.setPosition(this.center);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  listenForDriverLocation() {
    this.driverArrivalObs = this.clientSocketObs = this.clientTripSocket
    .trackTrip()
    .subscribe(
      (data) => {
        data.clients.forEach(client => {
          if(client.client === this.currentClient.id) {
            if(client.status === 'arrived') {
              this.arrived = true;
              this.pickup = false;
              this.dropoff = false;
            } else if(client.status === 'pickup') {
              this.arrived = false;
              this.pickup = true;
              this.dropoff = false;
            }
          }
        });
        const locations = data.locations;
        this.center = new this.googleMapsSdk.LatLng(
          locations[locations.length - 1].coordinates[0],
          locations[locations.length - 1].coordinates[1]
        );
        this.map.panTo(this.center);
        this.marker.setPosition(this.center);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  listenForDriverArrival() {
    this.driverPickupObs = this.clientSocketObs = this.clientTripSocket
    .driverArrived()
    .subscribe(
      (data) => {
        console.log('Arrived');
        this.arrived = true;
        this.pickup = null;
        this.dropoff = null;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  listenForDriverPickup() {
    this.driverDropoffObs = this.clientSocketObs = this.clientTripSocket
    .driverPickUp()
    .subscribe(
      (data) => {
        console.log('Pickup');
        this.arrived = null;
        this.pickup = true;
        this.dropoff = null;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  listenForDriverDropoff() {
    this.clientSocketObs = this.clientTripSocket
    .driverDropoff()
    .subscribe(
      (data) => {
        console.log('Dropoff');
        this.arrived = null;
        this.pickup = null;
        this.dropoff = true;

        this.modalCtrl
        .create({
          component: BookingSubmissionComponent,
          componentProps: {
            trip: this.loadedTrip,
            client: this.currentClient
          }
        })
        .then((modalEl) => {
          modalEl.present();
          modalEl.onDidDismiss().then(async (data) => {
            if(data.data != null) {
              console.log(data);
            }
            
            this.toastCtrl
            .create({
              message: "Ride Completed successfully",
              duration: 3000,
              position: "bottom"
            })
            .then((toast) => {
              toast.present();
            })
            .catch((err) => {
              console.log(err);
            });
    
            setTimeout(() => {
              this.navCtrl.pop()
                .then(() => {
                  this.router.navigateByUrl('/tabs');
                })
                .catch(err => {
                  console.log(err);
                });
            }, 3000);    
          });
        });    
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createMap() {
    console.log("On-Going-Ride");
    this.currentLocationObs = this.currentLocationService
      .getCurrentLocation()
      .subscribe(
        (location) => {
          this.center = location;
          this.baseMapService
            .getGoogleMapsSdk()
            .then((googleMapsSdk: any) => {
              this.googleMapsSdk = googleMapsSdk;
              console.log('1');
              const mapEl = this.mapEl.nativeElement;

              const map = new googleMapsSdk.Map(mapEl, {
                center: location,
                zoom: 18,
                disableDefaultUI: true,
                scaleControl: true,
                mapTypeId: "roadmap",
              });
              this.map = map;

              googleMapsSdk.event.addListenerOnce(map, "idle", () => {
                this.renderer.addClass(mapEl, "visible");
              });

              this.marker = new googleMapsSdk.Marker({
                position: location,
                icon: "assets/icon/car.png",
                map: map,
              });

            })
            .catch((err) => {
              console.log(err);
            });
        },
        (err) => {
          console.log(err);
          this.showMapsErrorAlert();
        }
      );
  }

  async getCurrentTripData() {
    if (this.loadedTrip) {
      this.isLoading = false;
      this.driver = this.loadedTrip.driver;
      this.vehicle = this.loadedTrip.vehicle;
      console.log(this.loadedTrip);
      this.tripSourceLocation = {
        lat: this.loadedTrip.startLocation.coordinates[0],
        lng: this.loadedTrip.startLocation.coordinates[1],
        address: this.loadedTrip.startLocation.address,
      };
      this.tripDestLocation = {
        lat: this.loadedTrip.endLocation.coordinates[0],
        lng: this.loadedTrip.endLocation.coordinates[1],
        address: this.loadedTrip.endLocation.address,
      };

      if (this.loadedTrip.booking.length > 0) {
        this.bookingTrips = this.loadedTrip.booking;
        this.bookingTrips.forEach((booking) => {
          this.clients.push(booking.client);
        });
      }
    }
  }

  async openChatRoom() {
    await this.authService.clearFieldDataFromStorage("chat-driverData");
    await this.authService.setFieldDataToStorage(
      "chat-driverData",
      this.loadedTrip.driver
    );

    this.router.navigateByUrl("chat-room");
  }

  private showMapsErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch location",
        buttons: ["Okay"],
      })
      .then((alertEl) => alertEl.present());
  }
  
  goBack() {
    this.location.back();
  }
}
