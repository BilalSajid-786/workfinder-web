import { Injectable } from '@angular/core';
import { Applicant } from '../models/applicant.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private apiUrl: string = 'https://initti.com/api/authentication';
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
      .post(`https://initti.com/api/applicants/getApplicants`, pagingModel)
      .pipe(tap((response: any) => {}));
  }

  updateApplicant(applicantModel: any): Observable<any> {
    return this.http
      .post(
        `https://initti.com/api/applicants/UpdateApplicant`,
        applicantModel
      )
      .pipe(tap((response: any) => {}));
  }

  getApplicantById(): Observable<any> {
    return this.http.get<any>(
      `https://initti.com/api/applicants/getapplicantbyid`
    );
  }
}
