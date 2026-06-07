import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/cities`;

  constructor(private http: HttpClient) {}

  getCitiesByCountryId(countryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cities/by-country/${countryId}`);
  }
}
