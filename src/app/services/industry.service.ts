import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleResponse } from '../models/module-response';
import { HttpClient } from '@angular/common/http';
import { Industry } from '../models/industry.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndustryService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/industries`;

  constructor(private http: HttpClient) {}

  getIndustries(): Observable<Industry[]> {
    return this.http.get<Industry[]>(`${this.apiUrl}/getIndustries`);
  }
}
