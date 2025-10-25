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
  isChatOpen = false;
  newMessage = '';
  allMessages: any = [];

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

    //listen for the real time messages for the specific sender
    this.chatService.onReceiveMessage((senderId: string, message: string) => {
      this.allMessages.push({
        senderId: senderId,
        text: message,
      });
    });
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
      },
      error: (err: any) => {},
    });
  }

  sendMessage() {
    const messageText = this.newMessage.trim();
    if (messageText) {
      // Add to the chat visually
      this.allMessages.push({
        senderId: this.senderId,
        receiverId: this.userId,
        text: messageText,
      });

      //message payload
      var message = {
        senderId: this.authService.getUserId(),
        receiverId: this.userId,
        text: this.newMessage,
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
