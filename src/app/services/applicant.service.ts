import { Injectable } from '@angular/core';
import { Applicant } from '../models/applicant.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/authentication`;

  constructor(private http: HttpClient) {}

  registerApplicantData(applicantModel: Applicant): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/registerApplicant`, applicantModel)
      .pipe(tap((response: any) => {}));
  }

  getApplicants(pagingModel: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/applicants/getApplicants`, pagingModel)
      .pipe(tap((response: any) => {}));
  }

  updateApplicant(applicantModel: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/applicants/UpdateApplicant`, applicantModel)
      .pipe(tap((response: any) => {}));
  }

  getApplicantById(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/applicants/getapplicantbyid`);
  }
}
