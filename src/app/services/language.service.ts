import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang: 'en' | 'de' = 'en';
  lang$ = new BehaviorSubject<'en' | 'de'>(this.currentLang);

  constructor() {
    const saved = sessionStorage.getItem('lang') as 'en' | 'de' | null;
    if (saved) this.applyLanguage(saved);
  }

  toggleLanguage() {
    const lang = this.currentLang === 'en' ? 'de' : 'en';
    this.applyLanguage(lang);
  }

  applyLanguage(lang: 'en' | 'de') {
    this.currentLang = lang;
    sessionStorage.setItem('lang', lang);
    this.lang$.next(lang);

    const applySelect = () => {
      const select = document.querySelector(
        '#google_translate_element select'
      ) as HTMLSelectElement;
      if (!select) {
        setTimeout(applySelect, 50);
        return;
      }

      // force the language even if Google changes it
      if (select.value !== lang) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    };

    // Give Google Translate some time to initialize
    setTimeout(applySelect, 100);
    setTimeout(applySelect, 300);
    setTimeout(applySelect, 600);
  }
}
