import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private apiUrl: string = 'https://localhost:7205/api/skills';

  constructor(private http: HttpClient) {}

  getSkillByName(searchName: string): Observable<ApiResponse<Skill>> {
    return this.http.get<ApiResponse<Skill>>(`${this.apiUrl}/${searchName}`);
  }
}
