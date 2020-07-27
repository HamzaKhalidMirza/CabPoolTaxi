import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RideRequestPageRoutingModule } from './ride-request-routing.module';

import { RideRequestPage } from './ride-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RideRequestPageRoutingModule
  ],
  declarations: [RideRequestPage]
})
export class RideRequestPageModule {}
