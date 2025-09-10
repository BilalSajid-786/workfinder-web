import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Employer } from '../models/employer.model';


@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private apiUrl: string = 'https://localhost:7205/api/authentication';

  constructor(private http: HttpClient) { }

  registerEmployer(employerModel: Employer): Observable<any> {
    console.log("EmployerModel", employerModel);
    return this.http.post(`${this.apiUrl}/registerEmployer`, employerModel).pipe(
      tap((response: any) => {
          console.log("ServiceResponse", response);
      })
    );
  }
}
