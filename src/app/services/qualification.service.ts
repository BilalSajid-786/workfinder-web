import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { Qualification } from '../models/qualification.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private apiUrl: string = 'https://localhost:7205/api/qualifications';

  constructor(private http: HttpClient) {}

  getQualifications(): Observable<ApiResponse<Qualification>> {
    return this.http.get<ApiResponse<Qualification>>(`${this.apiUrl}`);
  }
}
