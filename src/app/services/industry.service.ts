import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleResponse } from '../models/module-response';
import { HttpClient } from '@angular/common/http';
import { Industry } from '../models/industry.model';

@Injectable({
  providedIn: 'root',
})
export class IndustryService {
  private apiUrl: string = 'https://localhost:7205/api/industries';
  // private apiUrl: string =
  //   'http://bilalsajid-001-site1.mtempurl.com/api/industries';

  constructor(private http: HttpClient) {}

  getIndustries(): Observable<Industry[]> {
    return this.http.get<Industry[]>(`${this.apiUrl}/getIndustries`);
  }
}
