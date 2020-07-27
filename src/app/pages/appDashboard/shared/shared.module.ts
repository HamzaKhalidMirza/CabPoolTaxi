import { LocationPickerMapComponent } from './pickers/location-picker-map/location-picker-map.component';
import { LocationPickerModalComponent } from './modals/location-picker-modal/location-picker-modal.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        LocationPickerModalComponent,
        LocationPickerMapComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        IonicModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        LocationPickerModalComponent,
        LocationPickerMapComponent
    ],
    entryComponents: [
        LocationPickerModalComponent
    ],
    providers: []
  })
  export class SharedModule {}
  