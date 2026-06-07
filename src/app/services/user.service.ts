import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleResponse } from '../models/module-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  getModules(): Observable<ModuleResponse[]> {
    return this.http.get<ModuleResponse[]>(`${this.apiUrl}/getSideBarItems`);
  }

    getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserDetails`);
  }
}
