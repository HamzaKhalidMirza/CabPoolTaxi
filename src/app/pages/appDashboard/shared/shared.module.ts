import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { LocationPickerMapComponent } from './pickers/location-picker-map/location-picker-map.component';
import { LocationPickerModalComponent } from './modals/location-picker-modal/location-picker-modal.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        LocationPickerModalComponent,
        LocationPickerMapComponent,
        ImagePickerComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        LocationPickerModalComponent,
        LocationPickerMapComponent,
        ImagePickerComponent
    ],
    entryComponents: [
        LocationPickerModalComponent
    ],
    providers: []
  })
  export class SharedModule {}
  