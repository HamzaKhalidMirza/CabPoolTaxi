import { ClientTripSocket } from './../../../../common/sdk/custom/sockets/clientTripSocket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  isTripStarted: any = false;
  tripStartedData: any;

  constructor(
    private clientTripSocket: ClientTripSocket
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    this.clientTripSocket.tripStarted().subscribe((data) => {
      this.tripStartedData = data;
      console.log("2", this.tripStartedData);
      this.isTripStarted = true;
      setTimeout(() => {
        this.isTripStarted = false;
      }, 5000);
    });
  }
}
