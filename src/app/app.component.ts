import {Component, OnInit} from '@angular/core';
import {from} from 'rxjs';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private readonly storage: Storage) {
  }

  ngOnInit(): void {
    from(this.storage.get('server')).subscribe((results) => {
      console.log(results);
    });
  }

}
