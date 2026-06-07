import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/countries`;
  // private apiUrl: string =
  //   'http://bilalsajid-001-site1.mtempurl.com/api/countries';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
