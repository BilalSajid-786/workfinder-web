import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Guid } from '../models/types.model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl: string = 'https://localhost:7205/api/Files';

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
}
