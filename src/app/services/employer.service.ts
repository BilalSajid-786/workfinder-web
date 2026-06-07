import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Employer } from '../models/employer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/authentication`;

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
        `${this.baseUrl}/employers/editEmployer/${employerId}`,
        employerModel
      )
      .pipe(tap((response: any) => {}));
  }

  getEmployerById(employerId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/employers/getemployerbyid/${employerId}`);
  }
}
