import {
  Coordinates,
  PlaceLocation,
} from "./../../../../../../common/model/placeLocation.model";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";

@Component({
  selector: "app-location-picker-map",
  templateUrl: "./location-picker-map.component.html",
  styleUrls: ["./location-picker-map.component.scss"],
})
export class LocationPickerMapComponent implements OnInit, AfterViewInit {

  @ViewChild("map") mapElementRef: ElementRef;
  @Input() center: any;
  @Input() titleCaption: any;
  @Output() centerEmitted = new EventEmitter<any>();
  @Output() confirmLocationEmitted = new EventEmitter<any>();
  googleMapsSdk: any;

  constructor(
    private baseMapService: BaseMapService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMapsSdk: any) => {
        this.googleMapsSdk = googleMapsSdk;

        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMapsSdk.Map(mapEl, {
          center: this.center,
          zoom: 17,
          disableDefaultUI: true,
          scaleControl: true,
          mapTypeId: googleMapsSdk.MapTypeId.ROADMAP,
        });

        this.googleMapsSdk.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
        });

        const marker = new googleMapsSdk.Marker({
          position: this.center,
          icon: "assets/icon/car.png",
          map: map,
          title: "Picked Location",
        });

        let selfRef = this;
        googleMapsSdk.event.addListener(map, "center_changed", function () {
          window.setTimeout(function () {
            var mapCenter = map.getCenter();
            const coordinates: Coordinates = {
              lat: mapCenter.lat(),
              lng: mapCenter.lng(),
            };
            marker.setPosition(mapCenter);
            selfRef.emitLocation(coordinates);
          }, 100);
        });

        this.emitLocation(this.center);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  emitLocation(center: Coordinates) {
    this.baseMapService
      .getAddress(center.lat, center.lng)
      .subscribe((response) => {

        let actualAddress = '';
        let streetAddress = {
          street_number: null,
          route: null,
          locality: null,
        };

        response.address_components.forEach((addressCmp) => {
          let types = addressCmp.types;
          types.forEach((type) => {
            if (type === "street_number") {
              streetAddress.street_number = addressCmp.long_name;
            } else if (type === "route") {
              streetAddress.route = addressCmp.long_name;
            } else if (type === "locality") {
              streetAddress.locality = addressCmp.long_name;
            }
          });
        });
        
        if(streetAddress.street_number != null) {
          actualAddress += streetAddress.street_number + ' - ' +
                           streetAddress.locality;
        } else if(streetAddress.route != null) {
          actualAddress += streetAddress.route + ' - ' +
                           streetAddress.locality;
        } else if(streetAddress.locality != null) {
          actualAddress += streetAddress.locality + ' - ' +
                           streetAddress.locality;
        }

        const location: PlaceLocation = {
          lat: center.lat,
          lng: center.lng,
          address: actualAddress,
          caption: actualAddress,
          staticMapImageUrl: null
        };

        this.centerEmitted.emit(location);
      });
  }

  confirmLocation() {
    this.confirmLocationEmitted.emit();
  }
}
