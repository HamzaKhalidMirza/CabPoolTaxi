import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninPage } from './signin.page';

const routes: Routes = [
  {
    path: '',
    component: SigninPage
  },
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'forgotPassword',
    loadChildren: () => import('./forgotPassword/phone-verification/phone-verification.module').then( m => m.PhoneVerificationPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./forgotPassword/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SigninPageRoutingModule {}
