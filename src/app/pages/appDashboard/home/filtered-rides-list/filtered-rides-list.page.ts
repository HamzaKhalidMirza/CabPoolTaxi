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
  week: any = [];
  isCarFilter: any = false;
  selectedDate: any;
  selectedTime: any;
  selectedCar: any;
  selectedGender: any;

  constructor(
    private tripService: TripService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
    
    const date1 = new Date();
    let day = this.getTripDayName(date1, 'en-Us');
    this.week.push({
      date: date1,day
    });
    const date2 = new Date(date1);
    date2.setDate(date2.getDate() + 1);
    day = this.getTripDayName(date2, 'en-Us');
    this.week.push({
      date: date2,day
    });
    const date3 = new Date(date1);
    date3.setDate(date3.getDate() + 2);
    day = this.getTripDayName(date3, 'en-Us');
    this.week.push({
      date: date3,day
    });
    const date4 = new Date(date1);
    date4.setDate(date4.getDate() + 3);
    day = this.getTripDayName(date4, 'en-Us');
    this.week.push({
      date: date4,day
    });
    const date5 = new Date(date1);
    date5.setDate(date5.getDate() + 4);
    day = this.getTripDayName(date5, 'en-Us');
    this.week.push({
      date: date5,day
    });
    const date6 = new Date(date1);
    date6.setDate(date6.getDate() + 5);
    day = this.getTripDayName(date6, 'en-Us');
    this.week.push({
      date: date6,day
    });
    const date7 = new Date(date1);
    date7.setDate(date7.getDate() + 6);
    day = this.getTripDayName(date7, 'en-Us');
    this.week.push({
      date: date7,day
    });
    this.week.push({
      day: 'All'
    });
    console.log('Week', this.week);
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

  filterTripsByDay(value) {
    if(value === 'All') {
      this.selectedDate = null;
      this.relevantTrips = this.loadedTrips.filter(
        (trip) => trip.status === "upcoming"
      );
      return;
    }

    let selectedDate;
    this.week.forEach(day => {
      if(day.day === value) {
        selectedDate = day.date;
      }
    });
    const date = new Date(selectedDate);
    this.selectedDate = date;
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => {
        const startDate = trip.startDate;
        const tripDate = new Date(startDate);
        return tripDate.getFullYear()+':'+tripDate.getMonth()+':'+tripDate.getDate() ===
          date.getFullYear()+':'+date.getMonth()+':'+date.getDate() && 
          trip.status === "upcoming";
      }
    );
  }

  filterAllCars() {
    this.selectedCar = null;
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming"
    );
    this.changeCarFilter();
  }
  
  filterTripsByMini() {
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming" &&
                trip.vehicle.type === 'mini'
    );
    this.changeCarFilter();
  }

  filterTripsByMoto() {
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming" &&
                trip.vehicle.type === 'moto'
    );
    this.changeCarFilter();
  }

  filterTripsByGender(value) {
    if(value === 'All') {
      this.selectedDate = null;
      this.relevantTrips = this.loadedTrips.filter(
        (trip) => trip.status === "upcoming"
      );
      return;
    }

    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming" &&
                trip.driver.gender === value
    );
  }

  resetFilters() {
    this.relevantTrips = this.loadedTrips.filter(
      (trip) => trip.status === "upcoming"
    );
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
  
  changeCarFilter() {
    this.isCarFilter = !this.isCarFilter;
  }
}
