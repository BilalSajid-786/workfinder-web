import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
   private apiUrl: string = 'https://localhost:7205/api/countries';
  // private apiUrl: string =
  //   'http://bilalsajid-001-site1.mtempurl.com/api/countries';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
