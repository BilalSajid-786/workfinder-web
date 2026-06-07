import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/meetings`;
  constructor(private http: HttpClient) {}

  ScheduleMeeting(meetingModel: any): Observable<ApiResponse<any>> {
    return this.http
      .post(`${this.apiUrl}`, meetingModel)
      .pipe(tap((response: any) => {}));
  }
}
