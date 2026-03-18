import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
   private baseUrl = 'https://hostingaccount-001-site1.qtempurl.com/api/billing';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary`);
  }

  openPortal(): Observable<any> {
    return this.http.post(`${this.baseUrl}/portal`, {});
  }
}
