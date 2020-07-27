import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilteredRidesListPageRoutingModule } from './filtered-rides-list-routing.module';

import { FilteredRidesListPage } from './filtered-rides-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilteredRidesListPageRoutingModule
  ],
  declarations: [FilteredRidesListPage]
})
export class FilteredRidesListPageModule {}
