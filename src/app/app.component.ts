import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { LanguageService } from './services/language.service';
import { TranslationService } from './services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'workfinder-web';
  showToggle = false;

  constructor(
    router: Router,
    public lang: LanguageService,
    private translation: TranslationService
  ) {}

  ngOnInit(): void {
    const hideGoogleHeader = () => {
      document
        .querySelectorAll('iframe.goog-te-banner-frame')
        .forEach((el) => el.remove());
      document.documentElement.classList.remove('skiptranslate');
      document.body.classList.remove('skiptranslate');
    };
    hideGoogleHeader();
    const observer = new MutationObserver(hideGoogleHeader);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(hideGoogleHeader, 300);
  }

  toggleLanguage() {
    this.lang.toggleLanguage();
  }
}
