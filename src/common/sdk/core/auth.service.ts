import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private storage: Storage, private router: Router) {}

  public saveTokenToStorage(token: string) {
    this.storage.set('token', token);
  }

  public getTokenFromStorage() {
    return this.storage.get('token');
  }

  public getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  public async logout() {
    await this.storage.remove('token');
    this.router.navigateByUrl('/app-starter-auth');
  }

  public setFieldDataToStorage(fieldName: string, fieldData: any) {
    this.storage.set(fieldName, fieldData);
  }

  public getFieldDataFromStorage(fieldName: string) {
    return this.storage.get(fieldName);
  }

  public async clearFieldDataFromStorage(fieldName: string) {
    await this.storage.remove(fieldName);
  }

  public setCurrentUser(currentUser) {
    this.storage.set('current-driver', currentUser);
  }

  public getCurrentUser() {
    return this.storage.get('current-driver');
  }

}
