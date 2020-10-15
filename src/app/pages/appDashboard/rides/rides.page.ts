import { BookingService } from './../../../../common/sdk/custom/api/booking.service';
import { Component, OnInit } from '@angular/core';
import {format} from "date-fns";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { AuthService } from 'src/common/sdk/core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.page.html',
  styleUrls: ['./rides.page.scss'],
})
export class RidesPage implements OnInit {

  loadedTrips: any = [];
  relevantTrips: any = [];
  isLoading: any;

  constructor(
    private bookingService: BookingService
    ) {}

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    const getTripBookingObservable = await this.bookingService.getCurrentClientAllBookings();

    getTripBookingObservable.subscribe(
      async (response: any) => {
        this.isLoading = false;
        this.loadedTrips = response.data.data;
        console.log(this.loadedTrips);
        this.relevantTrips = this.loadedTrips.filter(
          (trip) => trip.trip.status === "upcoming" || trip.trip.status === "current"
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
