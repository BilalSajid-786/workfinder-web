import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleResponse } from '../models/module-response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = 'https://localhost:7205/api/users';

  constructor(private http: HttpClient) {}

  getModules(): Observable<ModuleResponse[]> {
    return this.http.get<ModuleResponse[]>(`${this.apiUrl}/getSideBarItems`);
  }
}
