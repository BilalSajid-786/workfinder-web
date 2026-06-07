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

      // Activates the dynamic overlay translate listener
    this.initOverlayTranslateObserver();

  }

  private initOverlayTranslateObserver() {
  let debounceTimer: any;

  const observer = new MutationObserver((mutations) => {
    if (this.currentLang === 'en') return;

    // Check if a custom overlay container or dynamic panel was added to the DOM
    const overlayOpened = mutations.some(m => 
      Array.from(m.addedNodes).some(node => {
        const className = (node as HTMLElement).className || '';
        const id = (node as HTMLElement).id || '';
        
        // This targets typical custom framework overlay classes/IDs
        return className.includes('cdk-overlay') || 
               className.includes('ng-dropdown-panel') || 
               className.includes('p-dropdown-panel') ||
               id.includes('overlay');
      })
    );

    if (overlayOpened) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const select = document.querySelector('#google_translate_element select') as HTMLSelectElement | null;
        if (select) {
          // Re-trigger Google Translate to process the newly opened panel text
          select.dispatchEvent(new Event('change'));
        }
      }, 50); // Small delay to let the UI finish rendering options
    }
  });

  // Watch the document body where overlay wrappers are created
  observer.observe(document.body, { childList: true, subtree: true });
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

    // Handle resetting English language preferences
    if (lang === 'en') {
      document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "googtransopt=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      select.value = 'en';
      select.dispatchEvent(new Event('change'));
      return;
    }

    // Update target tracking cookies
    document.cookie = `googtrans=/en/${lang};path=/`;

    if (select.value !== lang) {
      select.value = lang;
      
      // Dispatch standard DOM events
      select.dispatchEvent(new Event('change'));

      // FIX FOR SPAs: Force Google Translate framework engine to process the new layout state
      try {
        const win = window as any;
        if (win.google && win.google.translate && win.google.translate.TranslateElement) {
          // Re-instantiate the script instance to scrub untranslated nodes
          new win.google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'en,de,fr,tr', autoDisplay: false },
            'google_translate_element'
          );
        }
      } catch (e) {
        console.warn('Google Translate re-init bypass failed:', e);
      }

      // Secondary delay patch to catch deferred animation nodes
      setTimeout(() => {
        select.dispatchEvent(new Event('change'));
      }, 150);
    }
  };

  changeLang();
}

// private triggerGoogleTranslate(lang: AppLanguage) {

//   let retries = 0;
//   const maxRetries = 20;

//   const changeLang = () => {

//     const select = document.querySelector(
//       '#google_translate_element select'
//     ) as HTMLSelectElement | null;

//     if (!select || select.options.length === 0) {

//       if (retries < maxRetries) {
//         retries++;
//         setTimeout(changeLang, 300);
//       }

//       return;
//     }

//     if (lang === 'en') {

//       document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//       document.cookie = "googtransopt=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

//       select.value = 'en';
//       select.dispatchEvent(new Event('change'));

//       return;

//     }

//     document.cookie = `googtrans=/en/${lang};path=/`;

//     if (select.value !== lang) {

//       select.value = lang;

//       select.dispatchEvent(new Event('change'));

//       setTimeout(() => {
//         select.dispatchEvent(new Event('change'));
//       }, 150);
//     }

//   };

//   changeLang();
// }

}