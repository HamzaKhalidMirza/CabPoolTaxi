import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-starter-auth',
  templateUrl: './app-starter-auth.page.html',
  styleUrls: ['./app-starter-auth.page.scss'],
})
export class AppStarterAuthPage implements OnInit {

  sideMenu: any;

  constructor() { }

  ngOnInit() {
    this.sideMenu = document.querySelector(".side-menu");
  }
  ionViewWillEnter() {
    this.sideMenu.style.display = "none";
  }
  ionViewWillLeave() {
    this.sideMenu.style.display = "flex";
  }

}
