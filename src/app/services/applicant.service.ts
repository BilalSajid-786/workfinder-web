import { Injectable } from '@angular/core';
import { Applicant } from '../models/applicant.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private apiUrl: string = 'https://localhost:7205/api/authentication';
  // private apiUrl: string =
  //   'http://bilalsajid-001-site1.mtempurl.com/api/authentication';

  constructor(private http: HttpClient) {}

  registerApplicantData(applicantModel: Applicant): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/registerApplicant`, applicantModel)
      .pipe(tap((response: any) => {}));
  }

  getApplicants(pagingModel: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/applicants/getApplicants`, pagingModel)
      .pipe(tap((response: any) => {}));
  }

  updateApplicant(applicantModel: any): Observable<any> {
    return this.http
      .post(
        `https://localhost:7205/api/applicants/UpdateApplicant`,
        applicantModel
      )
      .pipe(tap((response: any) => {}));
  }

  getApplicantById(): Observable<any> {
    return this.http.get<any>(
      `https://localhost:7205/api/applicants/getapplicantbyid`
    );
  }
}
