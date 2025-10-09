import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ModuleResponse } from '../../models/module-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  modules: ModuleResponse[] = [];

  /**
   *
   */
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getModules().subscribe({
      next: (data) => {
        this.modules = data;
        console.log(this.modules);
      },
      error: (err) => console.error('Error fetching modules:', err),
    });
  }
}
