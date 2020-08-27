import { getTestBed } from '@angular/core/testing';
import { AuthService } from "./../../core/auth.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ClientAppConfig } from "../../../client-app.config";

import { BadInput } from "./../../../error/bad-input";
import { NotFoundError } from "./../../../error/not-found-error";
import { AppError } from "./../../../error/app-error";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { UnAuthorized } from "src/common/error/unauthorized-error";

@Injectable({
  providedIn: "root",
})
export class AccountSettingService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public async updateAccountSettings(credentials: object | any, imgUrl) {
    const token = await this.authService.getTokenFromStorage();
    const url = ClientAppConfig.getHostPath() + "/api/v1/clients/updateMe";

    const formData = {
      'fName': credentials.fName,
      'lName': credentials.lName,
      'gender': credentials.gender,
      'dob': credentials.dob,
      'photoAvatar': imgUrl
    };

    return this.http
      .patch(url, formData, {
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
