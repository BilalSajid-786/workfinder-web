import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleResponse } from '../models/module-response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = 'https://initti.com/api/users';
  // private apiUrl: string = 'http://bilalsajid-001-site1.mtempurl.com/api/users';

  constructor(private http: HttpClient) {}

  getModules(): Observable<ModuleResponse[]> {
    return this.http.get<ModuleResponse[]>(`${this.apiUrl}/getSideBarItems`);
  }

    getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserDetails`);
  }
}
