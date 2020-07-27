import { CanActivate, Router } from '@angular/router';

import { AuthService } from 'src/common/sdk/core/auth.service';
import { Injectable } from '@angular/core';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RedirectLoginGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    const token = await this.authService.getTokenFromStorage();
    if (token) {
      this.router.navigateByUrl('/tabs');
  } else {
      return true;
    }
  }
}
