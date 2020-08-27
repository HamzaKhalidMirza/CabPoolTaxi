import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportAdminPage } from './report-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ReportAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportAdminPageRoutingModule {}
