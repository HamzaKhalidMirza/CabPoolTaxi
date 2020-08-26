import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnGoingRidePage } from './on-going-ride.page';

const routes: Routes = [
  {
    path: '',
    component: OnGoingRidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnGoingRidePageRoutingModule {}
