import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountrycodeService {

    private baseUrl: string = environment.apiUrl;
    private apiUrl: string = `${this.baseUrl}/countrycodes`;

  constructor(private http: HttpClient) { }

    getCountryCodes(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/getCountryCodes`);
    }
}
