import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppStarterAuthPage } from './app-starter-auth.page';

const routes: Routes = [
  {
    path: '',
    component: AppStarterAuthPage
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppStarterAuthPageRoutingModule {}
