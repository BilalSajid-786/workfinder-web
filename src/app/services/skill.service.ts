import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Skill } from '../models/skill.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/skills`;

  constructor(private http: HttpClient) {}

  getSkillByName(searchName: string): Observable<ApiResponse<Skill>> {
    return this.http.get<ApiResponse<Skill>>(`${this.apiUrl}/${searchName}`);
  }

  getSkills(): Observable<ApiResponse<Skill>> {
    return this.http.get<ApiResponse<Skill>>(`${this.apiUrl}`);
  }
}
