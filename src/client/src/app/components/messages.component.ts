import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="message-container">
      <h2>Messages</h2>
      <div class="messages-list">
        <div *ngFor="let message of messages" class="message">
          {{ message }}
        </div>
      </div>
      <div class="message-input">
        <input [(ngModel)]="newMessage" placeholder="Type a message..." />
        <button (click)="sendMessage()">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .message-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .messages-list {
      height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .message {
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .message-input {
      display: flex;
      gap: 10px;
    }

    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class MessagesComponent implements OnInit {
  messages: string[] = [];
  newMessage: string = '';

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.getMessages().subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messageService.sendMessage(this.newMessage).subscribe({
        next: () => {
          this.newMessage = '';
        },
        error: (error) => console.error('Error sending message:', error)
      });
    }
  }
}
