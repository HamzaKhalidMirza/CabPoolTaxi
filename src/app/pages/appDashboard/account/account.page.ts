import { AuthService } from './../../../../common/sdk/core/auth.service';
import { Component, OnInit } from '@angular/core';
import { format } from "date-fns";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  currentUser: any;

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    this.currentUser = await this.authService.getCurrentUser();
    console.log(this.currentUser);    
  }

  setDOB(dateStr) {
    if(!dateStr) {
      return '';
    }
    let date = new Date(dateStr);
    return format(date, "LLL dd, yyyy");
  }

}
