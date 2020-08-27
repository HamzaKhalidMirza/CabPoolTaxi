import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneralTopicsPageRoutingModule } from './general-topics-routing.module';

import { GeneralTopicsPage } from './general-topics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralTopicsPageRoutingModule
  ],
  declarations: [GeneralTopicsPage]
})
export class GeneralTopicsPageModule {}
