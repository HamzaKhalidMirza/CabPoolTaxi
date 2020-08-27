import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportAdminPageRoutingModule } from './report-admin-routing.module';

import { ReportAdminPage } from './report-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReportAdminPageRoutingModule
  ],
  declarations: [ReportAdminPage]
})
export class ReportAdminPageModule {}
