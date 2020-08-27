import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-general-topics',
  templateUrl: './general-topics.page.html',
  styleUrls: ['./general-topics.page.scss'],
})
export class GeneralTopicsPage implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
