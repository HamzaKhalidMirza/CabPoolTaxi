import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'filtered-rides-list',
    loadChildren: () => import('./filtered-rides-list/filtered-rides-list.module').then( m => m.FilteredRidesListPageModule)
  },
  {
    path: 'location-setup',
    loadChildren: () => import('./location-setup/location-setup.module').then( m => m.LocationSetupPageModule)
  },
  {
    path: 'ride-request',
    loadChildren: () => import('./ride-request/ride-request.module').then( m => m.RideRequestPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
