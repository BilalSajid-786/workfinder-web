import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private baseUrl = `${environment.apiUrl}/billing`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary`);
  }

  openPortal(): Observable<any> {
    return this.http.post(`${this.baseUrl}/portal`, {});
  }
}
