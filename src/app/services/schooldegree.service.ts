import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchooldegreeService {

  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/schooldegrees`;
    // private apiUrl: string =
    //   'http://bilalsajid-001-site1.mtempurl.com/api/qualifications';
  
    constructor(private http: HttpClient) {}
  
    getQualifications(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}`);
    }
}
