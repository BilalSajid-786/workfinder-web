import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchooldegreeService {

  private apiUrl: string = 'https://localhost:44389/api/schooldegrees';
    // private apiUrl: string =
    //   'http://bilalsajid-001-site1.mtempurl.com/api/qualifications';
  
    constructor(private http: HttpClient) {}
  
    getQualifications(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}`);
    }
}
