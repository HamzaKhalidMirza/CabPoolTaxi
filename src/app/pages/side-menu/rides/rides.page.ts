import { BookingService } from './../../../../common/sdk/custom/api/booking.service';
import { Component, OnInit } from '@angular/core';
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { SegmentChangeEventDetail } from "@ionic/core";
import {format} from "date-fns";

@Component({
  selector: 'app-rides',
  templateUrl: './rides.page.html',
  styleUrls: ['./rides.page.scss'],
})
export class RidesPage implements OnInit {

  loadedTrips: any = [];
  relevantTrips: any = [];
  isLoading: any;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    const getAllTripsObservable = await this.bookingService.getCurrentClientAllBookings();

    getAllTripsObservable.subscribe(
      async (response: any) => {
        this.isLoading = false;
        this.loadedTrips = response.data.data;
        console.log(this.loadedTrips);
        this.relevantTrips = this.loadedTrips.filter(
          (trip) => trip.status === "complete"
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

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === "complete") {
      this.relevantTrips = this.loadedTrips.filter(
        (trip) => trip.status === "complete"
      );
      console.log("CO-Trips", this.relevantTrips);
    } else if (event.detail.value === "cancelled") {
      this.relevantTrips = this.loadedTrips.filter(
        (trip) => trip.status === "cancelled"
      );
      console.log("CA-Trips", this.relevantTrips);
    }
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
