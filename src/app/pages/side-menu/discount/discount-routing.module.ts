import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountPage } from './discount.page';

const routes: Routes = [
  {
    path: '',
    component: DiscountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountPageRoutingModule {}
