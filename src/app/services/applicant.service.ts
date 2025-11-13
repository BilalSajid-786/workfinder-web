import { Injectable } from '@angular/core';
import { Applicant } from '../models/applicant.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private apiUrl: string = 'https://localhost:7205/api';

  constructor(private http: HttpClient) {}

  registerApplicantData(applicantModel: Applicant): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/authentication/registerApplicant`, applicantModel)
      .pipe(tap((response: any) => {}));
  }

  getApplicants(pagingModel: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/applicants/getApplicants`, pagingModel)
      .pipe(tap((response: any) => {}));
  }
}
