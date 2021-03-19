import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  public showHideFilter = new Subject<boolean>();

  constructor() {
  }
}
