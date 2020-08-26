import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-app-starter-auth',
  templateUrl: './app-starter-auth.page.html',
  styleUrls: ['./app-starter-auth.page.scss'],
})
export class AppStarterAuthPage implements OnInit {

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
  }

}
