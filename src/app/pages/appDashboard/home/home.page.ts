import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "./../../../../common/sdk/core/auth.service";
import { Observable } from "rxjs/internal/Observable";
import { CurrentLocationService } from "./../../../../common/sdk/custom/maps/currentLocation.service";
import { BaseMapService } from "./../../../../common/sdk/custom/maps/baseMap.service";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
  OnDestroy,
} from "@angular/core";
import {
  AlertController,
  ModalController,
  MenuController,
} from "@ionic/angular";
import { LocationPickerModalComponent } from "../shared/modals/location-picker-modal/location-picker-modal.component";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild("map") mapEl: ElementRef;
  googleMapsSdk: any;
  directionsService: any;
  directionsDisplay: any;
  map: any;
  marker: any;
  center: any;
  currentLocationObs: Subscription;
  startLocation: any;
  endLocation: any;
  tripBookingForm: FormGroup;

  constructor(
    private baseMapService: BaseMapService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private alertCtrl: AlertController,
    private currentLocationService: CurrentLocationService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    console.log("ngOnInit");
    this.menuCtrl.enable(true);
    this.formInitializer();
  }

  formInitializer() {
    this.tripBookingForm = this.formBuilder.group({
      startLocation: ["", Validators.required],
      endLocation: ["", Validators.required],
    });
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.startLocation = null;
    this.endLocation = null;
    this.tripBookingForm.reset();
    this.currentLocationObs = this.currentLocationService
      .getCurrentLocation()
      .subscribe(
        (location) => {
          this.center = location;
          this.baseMapService
            .getGoogleMapsSdk()
            .then((googleMapsSdk: any) => {
              this.googleMapsSdk = googleMapsSdk;
              const mapEl = this.mapEl.nativeElement;

              const map = new googleMapsSdk.Map(mapEl, {
                center: location,
                zoom: 17,
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
              this.showMapsErrorAlert();
            });
        },
        (err) => {
          console.log(err);
          this.showMapsErrorAlert();
        }
      );
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
  }
  ngOnDestroy() {
    console.log("ngOnDestroy");
  }

  private showMapsErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch location",
        buttons: ["Okay"],
      })
      .then((alertEl) => alertEl.present());
  }

  pickupLocation() {
    this.openLocationPickerModal("Pickup").subscribe((location) => {
      this.startLocation = location;
      this.tripBookingForm.patchValue({
        startLocation: {
          coordinates: [this.startLocation.lat, this.startLocation.lng],
          address: this.startLocation.address,
        },
      });

      if (!this.endLocation) {
        this.setAndRemoveMarker(location);
        return;
      } else {
        if (this.directionsDisplay) {
          this.directionsDisplay.setMap(null);
        }
        let googleMapsSk = this.googleMapsSdk;
        let map = this.map;
        this.marker.setMap(null);
        let directionsService = new googleMapsSk.DirectionsService();
        let directionsDisplay = new googleMapsSk.DirectionsRenderer({
          map: map,
        });
        this.directionsDisplay = directionsDisplay;

        var start = new googleMapsSk.LatLng(
          this.startLocation.lat,
          this.startLocation.lng
        );
        var end = new googleMapsSk.LatLng(
          this.endLocation.lat,
          this.endLocation.lng
        );

        var request = {
          origin: start,
          destination: end,
          travelMode: googleMapsSk.TravelMode.DRIVING,
        };

        directionsService.route(request, function (response, status) {
          if (status == googleMapsSk.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
          } else {
            alert(
              "Directions Request from " +
                start.toUrlValue(6) +
                " to " +
                end.toUrlValue(6) +
                " failed: " +
                status
            );
          }
        });
      }
    });
  }

  dropoffLocation() {
    this.openLocationPickerModal("Dropoff").subscribe((location) => {
      this.endLocation = location;
      this.tripBookingForm.patchValue({
        endLocation: {
          coordinates: [this.endLocation.lat, this.endLocation.lng],
          address: this.endLocation.address,
        },
      });

      if (!this.startLocation) {
        this.setAndRemoveMarker(location);
        return;
      } else {
        if (this.directionsDisplay) {
          this.directionsDisplay.setMap(null);
        }
        let googleMapsSk = this.googleMapsSdk;
        let map = this.map;
        this.marker.setMap(null);
        let directionsService = new googleMapsSk.DirectionsService();
        let directionsDisplay = new googleMapsSk.DirectionsRenderer({
          map: map,
        });
        this.directionsDisplay = directionsDisplay;

        var start = new googleMapsSk.LatLng(
          this.startLocation.lat,
          this.startLocation.lng
        );
        var end = new googleMapsSk.LatLng(
          this.endLocation.lat,
          this.endLocation.lng
        );

        var request = {
          origin: start,
          destination: end,
          travelMode: googleMapsSk.TravelMode.DRIVING,
        };

        directionsService.route(request, function (response, status) {
          if (status == googleMapsSk.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
          } else {
            alert(
              "Directions Request from " +
                start.toUrlValue(6) +
                " to " +
                end.toUrlValue(6) +
                " failed: " +
                status
            );
          }
        });
      }
    });
  }

  async bookRide() {
    if (this.tripBookingForm.invalid) {
      return;
    }
    await this.authService.clearFieldDataFromStorage("location-filtered-data");
    await this.authService.setFieldDataToStorage(
      "location-filtered-data",
      this.tripBookingForm.value
    );
    this.startLocation = null;
    this.endLocation = null;
    this.tripBookingForm.reset();
    this.directionsDisplay.setMap(null);

    this.marker = new this.googleMapsSdk.Marker({
      position: this.center,
      icon: "assets/icon/car.png",
      map: this.map,
    });
    this.map.panTo(this.center);
    this.map.setZoom(17);
    console.log("Home", this.tripBookingForm.value);
    this.router.navigateByUrl("/tabs/home/filtered-rides-list");
  }

  setAndRemoveMarker(location) {
    let myLatLng = new this.googleMapsSdk.LatLng({
      lat: location.lat,
      lng: location.lng,
    });
    this.marker.setMap(null);
    this.marker = new this.googleMapsSdk.Marker({
      position: myLatLng,
      icon: "assets/icon/car.png",
      map: this.map,
    });
    this.map.panTo(myLatLng);
  }

  openLocationPickerModal(titleCaption: string): Observable<any> {
    let locationObs = Observable.create((observable) => {
      this.modalCtrl
        .create({
          component: LocationPickerModalComponent,
          componentProps: {
            currentLocation: this.center,
            titleCaption: titleCaption,
          },
        })
        .then((modalEl) => {
          modalEl.present();
          modalEl.onDidDismiss().then(async (locationData) => {
            if (locationData.data != null) {
              observable.next(locationData.data[0]);
            }
          });
        });
    });
    return locationObs;
  }
}
