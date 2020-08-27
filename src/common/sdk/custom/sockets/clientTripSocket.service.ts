import { AuthService } from "./../../core/auth.service";
import { Observable } from "rxjs/internal/Observable";
import { Injectable } from "@angular/core";
import { SocketIo } from "ng-io";
import { observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ClientTripSocket {
  constructor(private socket: SocketIo, private authService: AuthService) {}
  
  tripStarted(): Observable<any> {

    const chatMessageObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const chatMessageEvent =
          decodedToken.id + "-clientStartTripEvent";

          this.socket.on(chatMessageEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return chatMessageObs;
  }
  
  getDriverTrackings(data): Observable<any> {
    this.socket.emit('clientQueriedDriverTracings', data);

    const driverTrackingsObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage()
        .then(token => {
          const decodedToken = this.authService.getDecodedAccessToken(token);
          const driverTrackingsEvent = decodedToken.id + '-clientGetDriverTrackings';

          this.socket.on(driverTrackingsEvent, (data) => {
            observable.next(data);
          });  
        });
    });

    return driverTrackingsObs;
  }
    
  trackTrip(): Observable<any> {

    const trackTripObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const trackTripEvent =
          decodedToken.id + "-clientTrackTripEvent";

          this.socket.on(trackTripEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return trackTripObs;
  }
    
  driverArrived(): Observable<any> {

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const tripEvent =
          decodedToken.id + "-client-driverArrived";

          this.socket.on(tripEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }
    
  driverPickUp(): Observable<any> {

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const tripEvent =
          decodedToken.id + "-client-driverPickup";

          this.socket.on(tripEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }
    
  driverDropoff(): Observable<any> {

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const tripEvent =
          decodedToken.id + "-client-driverDropoff";

          this.socket.on(tripEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }

  submitReview(data): Observable<any> {
    this.socket.emit("clientSubmitReview", data);

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);

        const event = decodedToken.id + "-clientReviewSubmitted";

        this.socket.on(event, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }

  reportAdmin(data): Observable<any> {
    this.socket.emit("reportAdmin", data);

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);

        const event = decodedToken.id + "-adminReported";

        this.socket.on(event, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }
}
