import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRoomPageRoutingModule } from './chat-room-routing.module';

import { ChatRoomPage } from './chat-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChatRoomPageRoutingModule
  ],
  declarations: [ChatRoomPage]
})
export class ChatRoomPageModule {}
