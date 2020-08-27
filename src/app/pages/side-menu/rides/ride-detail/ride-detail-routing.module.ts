import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RideDetailPage } from './ride-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RideDetailPage
  },
  {
    path: 'report-admin',
    loadChildren: () => import('./report-admin/report-admin.module').then( m => m.ReportAdminPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RideDetailPageRoutingModule {}
