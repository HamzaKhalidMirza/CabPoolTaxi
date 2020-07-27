import { Injectable } from '@angular/core';
import { SocketIo } from "ng-io";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripSocket {
    
  constructor(
      private socket: SocketIo
  ) { }

  emitCurrentLocation(data) {
    //   console.log('Emit');
      this.socket.emit('driverStartedTrip', data);
  }

  getClientCurrentLocation() {
    let observable = Observable.create(observer => {
        this.socket.on('clientJoinedTrip', (data) => {
          observer.next(data);
        });
      })
      return observable;
    }
}