import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RideDetailPageRoutingModule } from './ride-detail-routing.module';

import { RideDetailPage } from './ride-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RideDetailPageRoutingModule
  ],
  declarations: [RideDetailPage]
})
export class RideDetailPageModule {}
