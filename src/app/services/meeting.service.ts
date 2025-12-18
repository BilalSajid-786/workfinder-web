import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private apiUrl: string = 'https://localhost:7205/api/meetings';
  constructor(private http: HttpClient) {}

  ScheduleMeeting(meetingModel: any): Observable<ApiResponse<any>> {
    return this.http
      .post(`${this.apiUrl}`, meetingModel)
      .pipe(tap((response: any) => {}));
  }
}
