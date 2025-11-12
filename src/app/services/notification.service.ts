import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl: string = 'https://localhost:7205/api/notifications';
  // private apiUrl: string =
  //   'http://bilalsajid-001-site1.mtempurl.com/api/notifications';
  private _count = new BehaviorSubject<number>(0);
  count$ = this._count.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  updateNotification(notificationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${notificationId}`).pipe(
      tap((res) => {
        // assuming res.count is the new count that API returns
        this._count.next(res.result.totalCount);
      })
    );
  }
}
