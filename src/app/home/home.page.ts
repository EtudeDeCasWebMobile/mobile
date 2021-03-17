import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  searchValue: string;

  constructor() {
  }

  ngOnInit() {
  }

  searchLocationOrCollection() {
    console.log(this.searchValue);
  }

}
