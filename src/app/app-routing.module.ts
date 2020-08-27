import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RedirectLoginGuard } from 'src/common/sdk/custom/guards/redirectlogin.guard';
import { IsLoginGuard } from 'src/common/sdk/custom/guards/islogin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app-starter-auth',
    pathMatch: 'full'
  },
  {
    path: 'app-starter-auth',
    canActivate: [RedirectLoginGuard],
    loadChildren: () => import('./pages/app-starter-auth/app-starter-auth.module').then( m => m.AppStarterAuthPageModule)
  },
  {
    path: 'tabs',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/appDashboard/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'help',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/side-menu/help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'wallet',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/side-menu/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'legal',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/side-menu/legal/legal.module').then( m => m.LegalPageModule)
  },
  {
    path: 'setting',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/side-menu/setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'rides',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/side-menu/rides/rides.module').then( m => m.RidesPageModule)
  },
  {
    path: 'ride-detail',
    loadChildren: () => import('./pages/appDashboard/home/filtered-rides-list/ride-detail/ride-detail.module').then( m => m.RideDetailPageModule)
  },
  {
    path: 'chat-room',
    canActivate: [IsLoginGuard],
    loadChildren: () => import('./pages/chat/chat-room/chat-room.module').then( m => m.ChatRoomPageModule)
  },
  {
    path: 'on-going-ride',
    loadChildren: () => import('./pages/current-ride/on-going-ride/on-going-ride.module').then( m => m.OnGoingRidePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
