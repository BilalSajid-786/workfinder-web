import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'en' | 'de' | 'fr' | 'tr';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  currentLang: AppLanguage = 'en';

  lang$ = new BehaviorSubject<AppLanguage>(this.currentLang);

  private languages: AppLanguage[] = ['en', 'de', 'fr', 'tr'];

  constructor() {

    const saved = sessionStorage.getItem('lang') as AppLanguage | null;

    if (saved && this.languages.includes(saved)) {
      this.applyLanguage(saved);
    }

  }

  toggleLanguage() {

    const currentIndex = this.languages.indexOf(this.currentLang);

    const nextLang = this.languages[(currentIndex + 1) % this.languages.length];

    this.applyLanguage(nextLang);

  }

  applyLanguage(lang: AppLanguage) {

    this.currentLang = lang;

    sessionStorage.setItem('lang', lang);

    this.lang$.next(lang);

    this.triggerGoogleTranslate(lang);

  }

  private triggerGoogleTranslate(lang: AppLanguage) {

    const changeLang = () => {

      const select = document.querySelector(
        '#google_translate_element select'
      ) as HTMLSelectElement;

      if (!select) {
        setTimeout(changeLang, 200);
        return;
      }

      if (select.value !== lang) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }

    };

    changeLang();
  }

}