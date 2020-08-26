import { ClientTripSocket } from './../../../../common/sdk/custom/sockets/clientTripSocket.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { AuthService } from "src/common/sdk/core/auth.service";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: 'app-booking-submission',
  templateUrl: './booking-submission.component.html',
  styleUrls: ['./booking-submission.component.scss'],
})
export class BookingSubmissionComponent implements OnInit {

  @Input('client') client: any;
  @Input('trip') trip: any;
  form: FormGroup;
  formSubmit: any;
  ratingStar = 4;
  error: any;
  success: any;
  isLoading: any;
  
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private clientTripSocket: ClientTripSocket,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.form = this.formBuilder.group({
      rating: [ "", [ Validators.required ]],
      review: [ "", [ Validators.required ]],
    });
    this.form.patchValue({ rating: this.ratingStar });
  }

  get rating() {
    return this.form.get("rating");
  }

  get review() {
    return this.form.get("review");
  }

  logRatingChange(value) {
    this.ratingStar = value;
    this.form.patchValue({ rating: this.ratingStar });
  }

  submitBooking() {
    this.formSubmit = true;
    console.log(this.form);
    if(this.form.invalid) {
      this.error = 'Please fill the form first!';
      return;
    } 

    this.isLoading = true;
    const client = this.client;
    const trip = this.trip;
    const driver = this.trip.driver;
    const review = {
      givenBy: 'driver',
      review: this.review.value,
      rating: this.rating.value,
      trip: trip,
      client: client,
      driver: driver
    }

    const data = {
      trip,
      client,
      driver,
      review
    };

    console.log(data);
    
    this.clientTripSocket.submitReview(data)
      .subscribe(async (data) => {
        this.isLoading = false;
        console.log(data);
        this.success = true;
        setTimeout(() => {
          this.modalCtrl.dismiss({
            message: 'success'
          });
        }, 2000);
      }, err => {
        this.isLoading = false;
        console.log(err);
      });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

}
