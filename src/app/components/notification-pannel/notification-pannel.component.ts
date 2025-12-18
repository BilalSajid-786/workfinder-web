import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatPannelComponent } from '../chat-pannel/chat-pannel.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-pannel',
  standalone: true,
  imports: [CommonModule, ChatPannelComponent],
  templateUrl: './notification-pannel.component.html',
  styleUrl: './notification-pannel.component.scss',
})
export class NotificationPannelComponent implements OnInit {
  @Input() notifications: any[] = [];
  @Output() notificationClicked = new EventEmitter<number>();
  selectedUserId: any = null;
  selectedUserName: string = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {}

  openMessagePannel(notification: any) {
    this.selectedUserName = notification.senderName;
    this.selectedUserId = notification.senderId;
  }

  markAsRead(notification: any) {
    notification.isRead = true;
    setTimeout(() => {
      this.openMessagePannel(notification);
    }, 0);
    this.updateNotifications(notification.notificationId);
    this.notificationClicked.emit(1);
  }

  updateNotifications(notificationId: number) {
    this.notificationService
      .updateNotification(notificationId)
      .subscribe((res) => {
        this.notifications = res.result.items;
      });
  }

  onClose() {}
}
