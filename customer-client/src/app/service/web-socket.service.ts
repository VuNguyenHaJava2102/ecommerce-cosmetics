import { Injectable } from '@angular/core';

import { ChatMessage } from '../model/class/chat-message.class';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private webSocket!: WebSocket;
  private chatMessages: ChatMessage[] = [];

  constructor() {}

  // 1
  public openWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:8080/notification');
    this.webSocket.onopen = (event) => {};

    this.webSocket.onmessage = (event) => {
      const chatMessageDto = JSON.parse(event.data);
      this.chatMessages.push(chatMessageDto);
    };

    this.webSocket.onclose = (event) => {};
  }

  // 2
  public sendMessage(chatMessage: ChatMessage) {
    this.webSocket.send(JSON.stringify(chatMessage));
  }

  // 3
  public closeWebSocket() {
    this.webSocket.close();
  }
}
