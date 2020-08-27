import { AuthService } from './../../../../../common/sdk/core/auth.service';
import { ActivatedRoute, Router } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { TripService } from "src/common/sdk/custom/api/trip.service";
import { format } from "date-fns";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";

@Component({
  selector: "app-ride-detail",
  templateUrl: "./ride-detail.page.html",
  styleUrls: ["./ride-detail.page.scss"],
})
export class RideDetailPage implements OnInit {
  @ViewChild("map") mapElementRef: ElementRef;
  @ViewChild("mapContainer") mapContainer: ElementRef;
  sourceLocation: any;
  destLocation: any;
  googleMapsSdk: any;
  isLoading: any;
  loadedTrip: any;
  bookingTrips: any = [];
  driver: any;
  vehicle: any;

  constructor(
    private tripService: TripService,
    private renderer: Renderer2,
    private baseMapService: BaseMapService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.route.paramMap.subscribe(async (router) => {
      let rideId = router.get("rideId");
      this.isLoading = true;
      const getTripObservable = await this.tripService.getSingleTrip(
        {
          tripId: rideId,
        }
      );

      getTripObservable.subscribe(
        async (response: any) => {
          this.isLoading = false;
          this.loadedTrip = response.data.data;
          this.driver = this.loadedTrip.driver;
          this.vehicle = this.loadedTrip.vehicle
          console.log(this.loadedTrip);
          this.sourceLocation = {
            lat: this.loadedTrip.startLocation.coordinates[0],
            lng: this.loadedTrip.startLocation.coordinates[1],
            address: this.loadedTrip.startLocation.address,
          };
          this.destLocation = {
            lat: this.loadedTrip.endLocation.coordinates[0],
            lng: this.loadedTrip.endLocation.coordinates[1],
            address: this.loadedTrip.endLocation.address,
          };
          this.createMap();

          if (this.loadedTrip.booking.length > 0) {
            this.bookingTrips = this.loadedTrip.booking;
          }
        },
        (error: AppError) => {
          this.isLoading = false;
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
    });
  }
  ionViewWillLeave() {
  }

  createMap() {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMapsSdk: any) => {
        this.googleMapsSdk = googleMapsSdk;
        var start = new googleMapsSdk.LatLng(this.sourceLocation.lat, this.sourceLocation.lng);
        var end = new googleMapsSdk.LatLng(this.destLocation.lat, this.destLocation.lng);

        this.mapContainer.nativeElement.hidden = false;
        const mapEl = this.mapElementRef.nativeElement;

        const map = new googleMapsSdk.Map(mapEl, {
          center: start,
          zoom: 14,
          disableDefaultUI: true,
          scaleControl: true,
          mapTypeId: "roadmap",
        });

        this.googleMapsSdk.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
        });

        let sourceMarker = new googleMapsSdk.Marker({
          position: start,
          icon: "assets/icon/car.png",
          map: map,
          title: "Picked Location",
        });

        let destMarker = new googleMapsSdk.Marker({
          position: end,
          icon: "assets/icon/car.png",
          map: map,
          title: "Destination Location",
        });

        let directionsService = new googleMapsSdk.DirectionsService();
        let directionsDisplay = new googleMapsSdk.DirectionsRenderer();
        directionsDisplay.setMap(map);

        var bounds = new googleMapsSdk.LatLngBounds();
        // bounds.extend(start);
        // bounds.extend(end);
        map.fitBounds(bounds);
        var request = {
          origin: start,
          destination: end,
          travelMode: googleMapsSdk.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          drivingOptions: {
            departureTime: new Date(Date.now() + 1000),  // for the time N milliseconds from now.
            trafficModel: 'optimistic'
          },
          optimizeWaypoints: true,
        };
        directionsService.route(request, function (response, status) {
          if (status == googleMapsSdk.DirectionsStatus.OK) {
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTripDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTripTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, "h:m a");
  }

  getTripDate(dateStr) {
    var time = new Date(dateStr);
    return format(time, "dd-MM-yyyy");
  }
  
  async reportAdmin() {
    await this.authService.setFieldDataToStorage('report-loadedTrip', this.loadedTrip);
    this.router.navigateByUrl(`/rides/${this.loadedTrip.id}/report-admin`);
  }
}
