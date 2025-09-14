import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private hubConnection: signalR.HubConnection;
  private messagesSubject = new BehaviorSubject<string[]>([]);
  private baseUrl = 'https://localhost:7001/api';

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7001/messageHub')
      .build();

    this.startConnection();
  }

  private async startConnection() {
    try {
      await this.hubConnection.start();
      console.log('SignalR connection started');

      this.hubConnection.on('ReceiveMessage', (message: string) => {
        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, message]);
      });
    } catch (error) {
      console.error('Error establishing SignalR connection:', error);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  sendMessage(content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/messages`, content);
  }

  getMessages(): Observable<string[]> {
    return this.messagesSubject.asObservable();
  }
}
