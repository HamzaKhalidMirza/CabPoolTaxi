import { Router } from '@angular/router';
import { AuthService } from "./../../../../../common/sdk/core/auth.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-location-setup",
  templateUrl: "./location-setup.page.html",
  styleUrls: ["./location-setup.page.scss"],
})
export class LocationSetupPage implements OnInit {
  tabBarElement: any;
  loadedTrip: any;
  selectedStartLoc: any;
  selectedEndLoc: any;
  locationList: any = [];

  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router
    ) {}

  async ngOnInit() {
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.tabBarElement.style.display = "none";

    this.loadedTrip = await this.authService.getFieldDataFromStorage(
      "loadedTrip"
    );
    console.log(this.loadedTrip);

    if (this.loadedTrip) {
      this.locationList.push({
        index: 0,
        disabled: false,
        isChecked: false,
        location: this.loadedTrip.startLocation,
      });
      let index = 1;
      if (this.loadedTrip.stops) {
        this.loadedTrip.stops.forEach((stop) => {
          this.locationList.push({
            index,
            disabled: false,
            isChecked: false,
            location: stop.location,
          });
          index++;
        });
      }
      this.locationList.push({
        index,
        disabled: true,
        isChecked: false,
        location: this.loadedTrip.endLocation,
      });
    }
    console.log(this.locationList);
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = "flex";
  }

  choiceChanged(selectedLocation) {

    if(!selectedLocation.isChecked) {
      this.selectedStartLoc = null;
      this.selectedEndLoc = null;
      for(let i=0; i<this.locationList.length-1; i++) {
        this.locationList[i].disabled = false;
      }
      this.locationList[this.locationList.length-1].disabled = true;
      return;
    }

    if(this.selectedStartLoc == null) {
      this.selectedStartLoc = selectedLocation;

      for(let i=0; i<=selectedLocation.index; i++) {
        this.locationList[i].disabled = true;
      }
      for(let i=++selectedLocation.index; i<this.locationList.length; i++) {
        this.locationList[i].disabled = false;
      }
    } else if(this.selectedEndLoc == null) {
      this.selectedEndLoc = selectedLocation;
      for(let i=0; i<this.locationList.length; i++) {
        this.locationList[i].disabled = true;
      }
    }
  }

  resetLocations() {
    for(let i=0; i<this.locationList.length; i++) {
      this.locationList[i].isChecked = false;
    }
  }

  async continue() {
    if(!this.selectedStartLoc || !this.selectedEndLoc) {
      return;
    }

    await this.authService.clearFieldDataFromStorage('request-data');
    await this.authService.setFieldDataToStorage('request-data', {
      startLocation: this.selectedStartLoc.location,
      endLocation: this.selectedEndLoc.location
    });
    this.router.navigateByUrl("/tabs/home/ride-request");
  }

  goBack() {
    this.location.back();
  }
}
