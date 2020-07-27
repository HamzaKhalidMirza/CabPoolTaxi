import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RideRequestPage } from './ride-request.page';

const routes: Routes = [
  {
    path: '',
    component: RideRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RideRequestPageRoutingModule {}
