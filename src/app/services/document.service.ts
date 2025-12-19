import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private apiUrl: string = 'https://localhost:7205';

  constructor(private http: HttpClient) { }

  downloadResume(userId: string, filename: string): void {
    const dot = filename.lastIndexOf('.');
    const ext = dot > 0 ? filename.slice(dot).toLowerCase() : '';
    const url = `${this.apiUrl}/resumes/${userId}${ext}`; // backend serves wwwroot/resumes/{userId}{ext}

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => this.saveBlob(blob, this.suggestName(userId, ext, filename)),
      error: () => alert('Failed to download resume.')
    });
  }

  private suggestName(userId: string | number, ext: string, original?: string): string {
    if (original) return original;
    return `resume-${userId}${ext}`;
  }

  private saveBlob(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  }
}
