import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}

  private hubConnection!: signalR.HubConnection;
  private readonly hubUrl = 'https://localhost:7205/chatHub';

  // Start SignalR connection
  startConnection(userId: string) {
    // userId should be a GUID string like "5e85a7b8-4e57-46c9-8f71-fb88a06b9db5"
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?userId=${userId}`, {
        withCredentials: false, // optional, only needed if you use cookies/auth
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(`✅ SignalR connected for user: ${userId}`))
      .catch((err) => console.error('❌ SignalR connection error:', err));
  }

  // Send a message to another user (GUIDs as strings)
  sendMessage(senderId: string, receiverId: string, message: string) {
    if (!this.hubConnection) {
      console.error('SignalR connection not started.');
      return;
    }

    this.hubConnection
      .invoke('SendMessage', senderId, receiverId, message)
      .catch((err) => console.error('SendMessage error:', err));
  }

  // Listen for incoming messages
  onReceiveMessage(callback: (senderId: string, message: string) => void) {
    if (!this.hubConnection) {
      console.error('SignalR connection not started.');
      return;
    }

    this.hubConnection.on('ReceiveMessage', callback);
  }

  // Stop the connection gracefully (optional)
  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => console.log('🛑 SignalR connection stopped.'))
        .catch((err) => console.error('Stop connection error:', err));
    }
  }
}
