import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerStatusService {
  private isServerDownSubject = new BehaviorSubject<boolean>(false);
  isServerDown$ = this.isServerDownSubject.asObservable();

  setServerDown(isDown: boolean) {
    // Only emit if it changes to avoid infinite digest loops
    if (this.isServerDownSubject.value !== isDown) {
      this.isServerDownSubject.next(isDown);
    }
  }
}
