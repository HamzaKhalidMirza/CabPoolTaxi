import { Component, OnInit, ViewChild, ElementRef, Input, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseMapService } from 'src/common/sdk/custom/maps/baseMap.service';
import { PlaceLocation } from 'src/common/model/placeLocation.model';

@Component({
  selector: 'app-location-picker-modal',
  templateUrl: './location-picker-modal.component.html',
  styleUrls: ['./location-picker-modal.component.scss'],
})
export class LocationPickerModalComponent implements OnInit {

  @ViewChild("editIcon") editIcon: ElementRef;
  @ViewChild("closeIcon") closeIcon: ElementRef;
  @ViewChild("inputEl") inputEl: ElementRef | any;

  @Input("titleCaption") titleCaption: string;
  @Input("center") currentLocation: any;
  actualCurrentAddress: any;
  googleMapsSdk: any;
  loading: any;

  focus: any;
  locationItems: any;
  selectedLocation: any;

  mapAdjustmentIcons: any;
  mapAdjustment: any;

  constructor(
    private modalCtrl: ModalController,
    private baseMapService: BaseMapService,
    private zone: NgZone
  ) { }

  ionViewWillEnter() {
    this.locationItems = [];
    this.loading = false;
    this.mapAdjustment = false;
    this.mapAdjustmentIcons = true;

    if (this.currentLocation) {
      this.baseMapService
        .getAddress(this.currentLocation.lat, this.currentLocation.lng)
        .subscribe((address) => {
          let actualAddress = '';
          let streetAddress = {
            street_number: null,
            route: null,
            locality: null,
          };
  
          address.address_components.forEach((addressCmp) => {
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

          this.actualCurrentAddress = actualAddress;
        });
    }
  }

  ngOnInit() {}

  onSearchLocation(value) {
    this.locationItems = [];
    this.selectedLocation = null;

    if (value === "") {
      this.closeIcon.nativeElement.style.display = "none";
      this.editIcon.nativeElement.style.display = "block";
      this.mapAdjustmentIcons = true;
      this.loading = false;
    } else {
      this.closeIcon.nativeElement.style.display = "block";
      this.editIcon.nativeElement.style.display = "none";
      this.mapAdjustmentIcons = false;
      this.loading = true;

      this.baseMapService
        .getGoogleMapsSdk()
        .then((googleMapsSdk: any) => {
          this.googleMapsSdk = googleMapsSdk;

          let myLatLng = new googleMapsSdk.LatLng({
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
          });

          let service = new googleMapsSdk.places.AutocompleteService();
          service.getPlacePredictions(
            {
              input: value,
              components: "country:pk",
              location: myLatLng,
              radius: "500",
            },
            (predictions) => {
              this.loading = false;
              this.locationItems = [];

              this.zone.run(() => {
                predictions.forEach((prediction) => {
                  this.locationItems.push(prediction);
                });
              });
            }
          );
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    }
  }

  closeLocationField() {
    console.log("OnCloseFrom Hi");
    this.loading = false;
    this.selectedLocation = null;
    this.locationItems = [];
    this.closeIcon.nativeElement.style.display = "none";
    this.editIcon.nativeElement.style.display = "block";
    this.inputEl.value = "";
  }

  onBlur() {
    this.closeIcon.nativeElement.style.display = "none";
    this.editIcon.nativeElement.style.display = "block";
    this.focus = false;
    this.loading = false;
    console.log("Source Focus: ", this.focus);
  }

  onFocus(value) {
    this.focus = true;
    this.mapAdjustment = false;
    console.log("Source Focus: ", this.focus);

    if (value != "") {
      this.closeIcon.nativeElement.style.display = "block";
      this.editIcon.nativeElement.style.display = "none";
    } else {
      this.mapAdjustmentIcons = true;
    }

    this.inputEl.getInputElement().then((nativeInputEl) => {
      nativeInputEl.select();
    });
  }

  onSelectionLocation(item) {
    this.locationItems = [];
    this.selectedLocation = null;

    let geocoder = new this.googleMapsSdk.Geocoder();

    geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };

        const location: PlaceLocation = {
          lat: position.lat,
          lng: position.lng,
          address: item.structured_formatting.main_text,
          caption: item.structured_formatting.main_text,
          staticMapImageUrl: null,
        };

        this.selectedLocation = location;
        this.modalCtrl.dismiss([
          this.selectedLocation
        ]);
      }
    });
  }

  setCurrentLocation() {
    const location: PlaceLocation = {
      lat: this.currentLocation.lat,
      lng: this.currentLocation.lng,
      address: this.actualCurrentAddress,
      caption: "Your Location",
      staticMapImageUrl: null,
    };

    this.selectedLocation = location;
    this.modalCtrl.dismiss([
      this.selectedLocation
    ]);
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  openLocationMapContainer() {
    this.mapAdjustment = true;
  }

  captureLocationFromMap(location) {
    this.selectedLocation = location;
  }

  captureConfirmation() {
    this.modalCtrl.dismiss([
      this.selectedLocation
    ]);
  }

}
