import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RidesPage } from './rides.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RidesPage,
      },
      {
        path: ':rideId',
        loadChildren: () => import('./ride-detail/ride-detail.module').then( m => m.RideDetailPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RidesPageRoutingModule {}
