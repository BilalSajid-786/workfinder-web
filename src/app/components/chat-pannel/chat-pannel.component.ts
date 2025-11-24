import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../services/signalR/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-pannel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './chat-pannel.component.html',
  styleUrl: './chat-pannel.component.scss',
})
export class ChatPannelComponent implements OnInit, OnDestroy {
  @Input() userId: any;
  @Input() userName: string = '';
  @Output() onClose = new EventEmitter<void>();
  senderId: string = '';
  senderName: string = '';
  isChatOpen = false;
  newMessage = '';
  allMessages: any = [];
  groupedMessages: { date: string; messages: any[] }[] = [];

  /**
   *
   */
  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.chatService.stopConnection();
  }
  ngOnInit(): void {
    //setup connection of the current user
    this.chatService.startConnection(this.authService.getUserId() ?? '');

    this.getMessages();

    this.senderId = this.authService.getUserId() ?? '';
    this.senderName = this.authService.getUserName() ?? '';

    //listen for the real time messages for the specific sender
    this.chatService.onReceiveMessage((senderId: string, message: string) => {
      this.allMessages.push({
        senderId: senderId,
        text: message,
        sentAt: new Date(),
      });
      this.groupMessagesByDate();
      // this.groupedMessages[this.groupedMessages.length - 1].messages.push({
      //   senderId: senderId,
      //   receiverId: this.userId,
      //   text: message,
      // });
    });
  }
  private getFriendlyDateLabel(dateString: string): string {
    const today = new Date();
    const date = new Date(dateString);
    const diffDays = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toDateString();
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const names = fullName.split(' ');
    const firstInitial = names[0]?.charAt(0).toUpperCase() || '';
    const lastInitial =
      names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  }

  getMessages() {
    //payload
    var message = {
      senderId: this.authService.getUserId(),
      receiverId: this.userId,
    };

    this.chatService.getUserMessages(message).subscribe({
      next: (res: any) => {
        this.allMessages = res.result;
        this.groupMessagesByDate();
      },
      error: (err: any) => {},
    });
  }

  groupMessagesByDate() {
    const grouped: { [key: string]: any[] } = {};

    this.allMessages.forEach((msg: any) => {
      const date = new Date(msg.sentAt).toDateString(); // e.g. "Sat Oct 26 2025"
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });

    // Convert object to array for ngFor
    this.groupedMessages = Object.keys(grouped).map((date) => ({
      date: this.getFriendlyDateLabel(date),
      messages: grouped[date],
    }));

    console.log('grouped messages are as', this.groupedMessages);
  }

  sendMessage() {
    const messageText = this.newMessage.trim();
    if (messageText) {
      // Add to the chat visually
      this.allMessages.push({
        senderId: this.senderId,
        receiverId: this.userId,
        text: messageText,
        sentAt: new Date(),
      });

      this.groupMessagesByDate();

      // if (this.groupedMessages.length > 0) {
      //   // this.groupedMessages[this.groupedMessages.length - 1].messages.push({
      //   //   senderId: this.senderId,
      //   //   receiverId: this.userId,
      //   //   text: messageText,
      //   // });
      //   this.groupMessagesByDate();
      // } else {
      //   this.groupMessagesByDate();
      // }

      //message payload
      var message = {
        senderId: this.authService.getUserId(),
        receiverId: this.userId,
        text: this.newMessage,
        senderName: this.senderName,
      };

      //use api endpoint to persist and send message
      this.chatService.sendPersistMessage(message).subscribe({
        next: (res: any) => {},
        error: (err: any) => {},
      });

      this.newMessage = '';
    }
  }

  closeChat() {
    this.onClose.emit();
  }
}
