import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: 'en' | 'de'): Observable<string> {
    if (targetLang === 'en') return of(text); // no need to translate
    // Replace with your translation endpoint
    return this.http
      .post<{ translatedText: string }>('/api/translate', { text, targetLang })
      .pipe(
        map((res) => res.translatedText),
        catchError(() => of(text)) // fallback to original
      );
  }
}
