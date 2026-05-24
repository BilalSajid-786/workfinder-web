import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountrycodeService {

    private apiUrl: string = 'https://initti.com/api/countrycodes';

  constructor(private http: HttpClient) { }

    getCountryCodes(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/getCountryCodes`);
    }
}
