import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationSetupPage } from './location-setup.page';

const routes: Routes = [
  {
    path: '',
    component: LocationSetupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationSetupPageRoutingModule {}
