import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ModuleResponse } from '../../models/module-response';
import { CommonModule } from '@angular/common';
import { NotificationPannelComponent } from '../../components/notification-pannel/notification-pannel.component';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../services/notification.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    NotificationPannelComponent,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  modules: ModuleResponse[] = [];
  notifications: any[] = [];
  showNotifications = false;
  unreadCount = 2; // Example count
  count: number = 0;
  sidebarOpen: boolean = true;
  userName: string | undefined = '';

  /**
   *
   */
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.userName$.subscribe((name) => {
      debugger;
      this.userName = name;
    });
    this.userService.getModules().subscribe({
      next: (data) => {
        this.modules = data;
      },
      error: (err) => console.error('Error fetching modules:', err),
    });

    this.getNotifications();

    this.notificationService.count$.subscribe((c) => (this.unreadCount = c));

    this.userName = this.authService.getUserName();
  }

  getNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data.result.items;
        this.unreadCount = data.result.totalCount;
      },
      error: (err) => console.error('Error fetching modules:', err),
    });
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  onEditProfile() {
    this.router.navigate(['userprofile']);
  }

  handleNotification(notificationId: number) {
    // setTimeout(() => {
    //   this.showNotifications = false;
    // });
  }

  // Close dropdown if user clicks anywhere outside
  @HostListener('document:click')
  closeDropdown() {
    this.showNotifications = false;
  }
}
