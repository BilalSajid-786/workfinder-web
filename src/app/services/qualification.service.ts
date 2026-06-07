import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { Qualification } from '../models/qualification.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/qualifications`;

  constructor(private http: HttpClient) {}

  getQualifications(): Observable<ApiResponse<Qualification>> {
    return this.http.get<ApiResponse<Qualification>>(`${this.apiUrl}`);
  }
}
