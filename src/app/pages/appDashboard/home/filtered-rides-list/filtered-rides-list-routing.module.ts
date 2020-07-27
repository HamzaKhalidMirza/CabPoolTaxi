import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilteredRidesListPage } from './filtered-rides-list.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: FilteredRidesListPage,
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
export class FilteredRidesListPageRoutingModule {}
