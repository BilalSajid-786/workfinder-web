import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response.model';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl: string = 'https://localhost:7205/api/jobs';
  constructor(private http: HttpClient) {}

  GetJobTypes(): Observable<ApiResponse<string[]>> {
    return this.http
      .get(`${this.apiUrl}/jobtypes`)
      .pipe(tap((response: any) => {}));
  }

  PostJob(jobModel: any): Observable<ApiResponse<any>> {
    return this.http
      .post(`${this.apiUrl}`, jobModel)
      .pipe(tap((response: any) => {}));
  }

  GetAvailableJobs(filter: any): Observable<ApiResponse<any>> {
    return this.http.post(`${this.apiUrl}/availableJobs`, filter).pipe(
      tap((response: any) => {
        // optional: handle response here if needed
      })
    );
  }

  getEmployerJobs(pagingModel: any): Observable<ApiResponse<any>> {
    return this.http
      .post(`${this.apiUrl}/employerjobs`, pagingModel)
      .pipe(tap((response: any) => {}));
  }

  UpdateJobStatus(jobId: number, status: boolean): Observable<ApiResponse<any>>{
    return this.http.post(`${this.apiUrl}/updateJobStatusAsync/${jobId}/${status}`, null)
    .pipe(tap((response: any) => {}));
  }
}
