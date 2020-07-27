import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppStarterAuthPageRoutingModule } from './app-starter-auth-routing.module';

import { AppStarterAuthPage } from './app-starter-auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppStarterAuthPageRoutingModule
  ],
  declarations: [AppStarterAuthPage]
})
export class AppStarterAuthPageModule {}
