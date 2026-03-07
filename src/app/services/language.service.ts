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


//   private triggerGoogleTranslate(lang: AppLanguage) {

//   let retries = 0;
//   const maxRetries = 20;

//   const changeLang = () => {

//     const select = document.querySelector(
//       '#google_translate_element select'
//     ) as HTMLSelectElement | null;

//     // wait until widget fully loads
//     if (!select || select.options.length === 0) {

//       if (retries < maxRetries) {
//         retries++;
//         setTimeout(changeLang, 300);
//       }

//       return;
//     }

//     // force google translate cookie
//     document.cookie = `googtrans=/en/${lang};path=/`;

//     if (select.value !== lang) {

//       select.value = lang;

//       select.dispatchEvent(new Event('change'));

//       // second trigger fixes random ignore
//       setTimeout(() => {
//         select.dispatchEvent(new Event('change'));
//       }, 150);
//     }

//   };

//   changeLang();
// }

private triggerGoogleTranslate(lang: AppLanguage) {

  let retries = 0;
  const maxRetries = 20;

  const changeLang = () => {

    const select = document.querySelector(
      '#google_translate_element select'
    ) as HTMLSelectElement | null;

    if (!select || select.options.length === 0) {

      if (retries < maxRetries) {
        retries++;
        setTimeout(changeLang, 300);
      }

      return;
    }

    if (lang === 'en') {

      document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "googtransopt=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

      select.value = 'en';
      select.dispatchEvent(new Event('change'));

      return;

    }

    document.cookie = `googtrans=/en/${lang};path=/`;

    if (select.value !== lang) {

      select.value = lang;

      select.dispatchEvent(new Event('change'));

      setTimeout(() => {
        select.dispatchEvent(new Event('change'));
      }, 150);
    }

  };

  changeLang();
}

}