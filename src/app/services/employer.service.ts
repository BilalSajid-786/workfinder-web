import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Employer } from '../models/employer.model';

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  private apiUrl: string = 'https://localhost:7205/api/authentication';
  // private apiUrl: string =
  //   'http://bilalsajid-001-site1.mtempurl.com/api/authentication';

  constructor(private http: HttpClient) {}

  registerEmployer(employerModel: Employer): Observable<any> {
    console.log('EmployerModel', employerModel);
    return this.http
      .post(`${this.apiUrl}/registerEmployer`, employerModel)
      .pipe(
        tap((response: any) => {
          console.log('ServiceResponse', response);
        })
      );
  }

  editEmployer(employerId: any, employerModel: Employer): Observable<any> {
    return this.http
      .post(
        `https://localhost:7205/api/employers/editEmployer/${employerId}`,
        employerModel
      )
      .pipe(tap((response: any) => {}));
  }

  getEmployerById(employerId: any): Observable<any> {
    return this.http.get<any>(
      `https://localhost:7205/api/employers/getemployerbyid/${employerId}`
    );
  }
}
