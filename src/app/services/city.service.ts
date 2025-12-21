import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private apiUrl: string = 'https://localhost:7205/api/cities';
  // private apiUrl: string =
  //   'http://bilalsajid-001-site1.mtempurl.com/api/cities';

  constructor(private http: HttpClient) {}

  getCitiesByCountryId(countryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cities/by-country/${countryId}`);
  }
}
