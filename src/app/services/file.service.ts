import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Guid } from '../models/types.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl: string = environment.apiUrl;
  private apiUrl: string = `${this.baseUrl}/Files`;

  constructor(private http: HttpClient) {}

  UploadFile(
    file: FormData,
    fileType: string,
    applicantId: Guid
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${fileType}/${applicantId}`, file)
      .pipe(tap((response: any) => {}));
  }

  UploadProfile(file: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/uploadProfile`, file)
      .pipe(tap((response: any) => {}));
  }
}
