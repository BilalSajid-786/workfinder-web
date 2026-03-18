import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  private userProfileSubject = new BehaviorSubject<string>('');
  userProfile$ = this.userProfileSubject.asObservable();

  setUserName(name: string) {
    this.userNameSubject.next(name);
  }

  setUserProfile(profile: string) {
    this.userProfileSubject.next(profile);
  }
}
