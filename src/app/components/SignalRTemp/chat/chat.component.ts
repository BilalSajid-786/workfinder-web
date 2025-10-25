import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../../services/signalR/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ChatPannelComponent } from '../../chat-pannel/chat-pannel.component';

interface ChatMessage {
  senderId: string;
  message: string;
  sentByMe: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatPannelComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  currentUserId: string = ''; // 👈 Replace with logged-in user's GUID
  receiverId = 'CFC430DF-C256-41B3-A949-BCCD41CE27C0'; // 👈 Example receiver's GUID

  messages: ChatMessage[] = [];
  newMessage = '';
  selectedUserId: any = null;
  selectedUserName: string = '';
  chatMessages: { sender: string; text: string }[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Start SignalR connection
    this.currentUserId = this.authService.getUserId() ?? '';

    this.chatService.startConnection(this.currentUserId);

    //   this.chatService.onReceiveMessage((senderId: string, message: string) => {
    //     console.log('📥 Received message:', senderId, message);
    //     this.messages.push({
    //       senderId,
    //       message,
    //       sentByMe: senderId === this.currentUserId,
    //     });
    //   });
    // }
    // sendMessage() {
    //   if (this.newMessage.trim() && this.receiverId) {
    //     this.chatService.sendMessage(
    //       this.currentUserId,
    //       this.receiverId,
    //       this.newMessage
    //     );
    //     this.messages.push({
    //       senderId: this.currentUserId,
    //       message: this.newMessage,
    //       sentByMe: true,
    //     });
    //     this.newMessage = '';
    //   } else {
    //     console.warn('Receiver ID missing or empty message');
    //   }
    // }

    // handleMessageSend(messageText: any) {
    //   this.chatMessages.push({ sender: 'me', text: messageText });

    //   // Simulate a reply
    //   setTimeout(() => {
    //     this.chatMessages.push({
    //       sender: 'user',
    //       text: 'Thank you! Ill check it out.',
    //     });
    //   }, 1000);
    //   console.log('message to sent', this.chatMessages);
    // }
  }

  ngOnDestroy() {
    this.chatService.stopConnection();
  }

  openChat() {
    this.selectedUserId = '5CA757F8-6A90-F011-94F7-34E6D70183E9';
    this.selectedUserName = 'Web Applicant';
  }
}
