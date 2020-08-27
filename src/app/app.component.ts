import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from 'src/common/sdk/core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: any;
  public appMainPages = [
    {
      title: 'Your Trips',
      url: '/rides',
      icon: 'car-sport'
    },
    {
      title: 'Wallet',
      url: '/wallet',
      icon: 'cash'
    }
  ];
  public appAccountPages = [
    {
      title: 'Settings',
      url: '/setting',
      icon: 'settings'
    },
    {
      title: 'Help',
      url: '/help',
      icon: 'help-circle'
    },
    {
      title: 'Sign Out',
      url: '/app-starter-auth',
      icon: 'log-out'
    }
  ];

  public legalPage = {
    title: 'Legal',
    url: '/legal',
    version: 'v1.0.0'
  };

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    setInterval(async () => {
      this.currentUser = await this.authService.getCurrentUser();
    }, 1000);
  }

  logout(page) {
    if (page.title === 'Sign Out') {
      this.authService.logout();
    }
  }
}
