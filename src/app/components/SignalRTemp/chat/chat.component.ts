import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../../services/signalR/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

interface ChatMessage {
  senderId: string;
  message: string;
  sentByMe: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  currentUserId = '66361C54-B1FC-4BF8-9D43-011AFA33A1B4'; // 👈 Replace with logged-in user's GUID
  receiverId = 'F838AD0D-4162-40D5-B117-31BBACD19230'; // 👈 Example receiver's GUID

  messages: ChatMessage[] = [];
  newMessage = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Start SignalR connection
    this.currentUserId = this.authService.getBaseUserId();

    this.chatService.startConnection(this.currentUserId);

    this.chatService.onReceiveMessage((senderId: string, message: string) => {
      console.log('📥 Received message:', senderId, message);
      this.messages.push({
        senderId,
        message,
        sentByMe: senderId === this.currentUserId,
      });
    });

    // // Listen for incoming messages
    // this.chatService.onReceiveMessage((senderId, message) => {
    //   console.log(`Messages ${senderId}, ${message}`);
    //   this.messages.push({
    //     senderId,
    //     message,
    //     sentByMe: senderId === this.currentUserId ? true : false,
    //   });
    // });
  }

  // sendMessage() {
  //   if (!this.newMessage.trim()) return;

  //   // Send message via SignalR
  //   this.chatService.sendMessage(
  //     this.currentUserId,
  //     this.receiverId,
  //     this.newMessage
  //   );

  //   // Add to local list for instant display
  //   this.messages.push({
  //     senderId: this.currentUserId,
  //     message: this.newMessage,
  //     sentByMe: true,
  //   });

  //   this.newMessage = '';
  // }

  sendMessage() {
    if (this.newMessage.trim() && this.receiverId) {
      this.chatService.sendMessage(
        this.currentUserId,
        this.receiverId,
        this.newMessage
      );
      this.messages.push({
        senderId: this.currentUserId,
        message: this.newMessage,
        sentByMe: true,
      });
      this.newMessage = '';
    } else {
      console.warn('Receiver ID missing or empty message');
    }
  }

  ngOnDestroy() {
    this.chatService.stopConnection();
  }
}
