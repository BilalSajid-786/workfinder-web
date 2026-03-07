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
   
  }

  toggleLanguage() {
    this.lang.toggleLanguage();
  }
}
