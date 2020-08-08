import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ClientAppConfig } from '../../../client-app.config';

import { BadInput } from '../../../error/bad-input';
import { NotFoundError } from '../../../error/not-found-error';
import { AppError } from '../../../error/app-error';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UnAuthorized } from 'src/common/error/unauthorized-error';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthService {

  constructor(
    private http: HttpClient
  ) { }

  public checkPhoneExistance(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/checkPhoneExistance';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public getVerificationCode(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/getVerificationCode';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public verifyCode(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/verifyCode';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public checkEmailExistance(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/checkEmailExistance';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public registerClient(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/signup';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public verifyPhoneExistance(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/verifyPhoneExistance';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public loginClient(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/login';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public forgotPassword(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/forgotPassword';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public verifyForgotPasswordCode(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/verifyForgotPasswordCode';

    return this.http.post(url, credentials)
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public resetPassword(credentials: object): Observable<any> {
    const url = ClientAppConfig.getHostPath() + '/api/v1/clients/resetPassword';

    return this.http.patch(url, credentials)
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

