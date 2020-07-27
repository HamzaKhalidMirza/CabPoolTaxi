import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

import { BadInput } from "../../../error/bad-input";
import { NotFoundError } from "../../../error/not-found-error";
import { AppError } from "../../../error/app-error";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { UnAuthorized } from "src/common/error/unauthorized-error";

@Injectable({
  providedIn: "root",
})
export class BaseMapService {
  constructor(private http: HttpClient) {}

  public getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}
         &types=street_address
         &key=${environment.googleMapsAPIKey}`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0];
        })
      );
  }

  public getGoogleMapsSdk() {
    const win = window as any;
    const googleModule = win.google;
    // console.log('Google Module 1: ', googleModule);
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}
        &libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        // console.log('Google Module 2: ', loadedGoogleModule);
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject("Google maps SDK not available.");
        }
      };
    });
  }
}
