import { AuthService } from 'src/common/sdk/core/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClientAppConfig } from '../../../client-app.config';

import { BadInput } from '../../../error/bad-input';
import { NotFoundError } from '../../../error/not-found-error';
import { AppError } from '../../../error/app-error';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UnAuthorized } from 'src/common/error/unauthorized-error';
import { SocketIo } from 'ng-io';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
    
  constructor(
    private http: HttpClient,
    private socket: SocketIo,
    private authService: AuthService
  ) { }

  public requestReceived(): Observable<any> {
    const requestObs = Observable.create(observable => {
      this.authService.getTokenFromStorage()
      .then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const requestReceivedEvent = decodedToken.id + '-clientReceivedRequest';
    
        this.socket.on(requestReceivedEvent, (data) => {
          console.log('1', data);
          observable.next(data);
        });
      });
    });
    return requestObs;
  }

  public async requestRide(credentials, tripId) {
    const token = await this.authService.getTokenFromStorage();
    const url = ClientAppConfig.getHostPath() + `/api/v1/trips/${tripId}/requests`;

    return this.http.post(url, credentials, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public async getCurrentClientAllRequests() {
    const token = await this.authService.getTokenFromStorage();
    const url = ClientAppConfig.getHostPath() + `/api/v1/requests/getCurrentClientRequests`;

    return this.http.get(url, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public async getCurrentClientSingleRequest(credentials) {
    const token = await this.authService.getTokenFromStorage();
    const url = ClientAppConfig.getHostPath() + `/api/v1/requests/${credentials.requestId}`;

    return this.http.get(url, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: Response) {
    if (error.status === 400) {
      return throwError(new BadInput(error));
    }
    if (error.status === 404) {
      return throwError(new NotFoundError(error));
    }
    if (error.status === 401) {
      return throwError(new UnAuthorized(error));
    }
    return throwError(new AppError(error));
  }
}