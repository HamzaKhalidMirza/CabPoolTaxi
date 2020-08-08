import { AuthService } from 'src/common/sdk/core/auth.service';
import { TripService } from 'src/common/sdk/custom/api/trip.service';
import { Component, OnInit } from '@angular/core';
import {format} from "date-fns";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";

@Component({
  selector: 'app-filtered-rides-list',
  templateUrl: './filtered-rides-list.page.html',
  styleUrls: ['./filtered-rides-list.page.scss'],
})
export class FilteredRidesListPage implements OnInit {

  tabBarElement: any;
  loadedTrips: any = [];
  relevantTrips: any = [];
  isLoading: any;
  startLocation: any;
  endLocation: any;

  constructor(
    private tripService: TripService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.tabBarElement.style.display = "none";

    const locationData = await this.authService.getFieldDataFromStorage('location-filtered-data');

    if(locationData) {
      this.startLocation = locationData.startLocation;
      this.endLocation = locationData.endLocation;

      this.isLoading = true;
      const getTripObservable = await this.tripService.searchTripsWithinLocation({
        startLoc: this.startLocation,
        endLoc: this.endLocation
      });
  
      getTripObservable.subscribe(
        async (response: any) => {
          this.isLoading = false;
          this.loadedTrips = response.data.data;
          console.log(this.loadedTrips);
          this.relevantTrips = this.loadedTrips.filter(
            (trip) => trip.status === "upcoming" && trip.seatsAvailable > 0
          );
          console.log("CO-Trips", this.relevantTrips);
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
    }
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = "flex";
  }

  getTripDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTripTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, 'h:m a');
  }

  getTripDate(dateStr) {
    var time = new Date(dateStr);
    return format(time, 'dd-MM-yyyy');
  }

}
