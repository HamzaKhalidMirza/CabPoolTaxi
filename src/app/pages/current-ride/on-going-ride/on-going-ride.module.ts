import { RatingComponent } from './../rating/rating.component';
import { BookingSubmissionComponent } from './../booking-submission/booking-submission.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnGoingRidePageRoutingModule } from './on-going-ride-routing.module';

import { OnGoingRidePage } from './on-going-ride.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OnGoingRidePageRoutingModule
  ],
  declarations: [
    OnGoingRidePage,
    BookingSubmissionComponent,
    RatingComponent
  ]
})
export class OnGoingRidePageModule {}
