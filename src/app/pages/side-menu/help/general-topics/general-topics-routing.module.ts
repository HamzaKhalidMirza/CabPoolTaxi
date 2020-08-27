import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralTopicsPage } from './general-topics.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralTopicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralTopicsPageRoutingModule {}
