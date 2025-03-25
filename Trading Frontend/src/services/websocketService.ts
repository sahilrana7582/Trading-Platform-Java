import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Polyfill for global to fix sockjs-client in browser environment
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

class WebSocketService {
  private stompClient: Client | null = null;
  private connected: boolean = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: function (str) {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = () => {
        this.connected = true;
        console.log('Connected to WebSocket');
        resolve();
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error', frame);
        reject(new Error(`WebSocket connection error: ${frame.headers.message}`));
      };

      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
      console.log('Disconnected from WebSocket');
    }
  }

  subscribe(destination: string, callback: (message: any) => void) {
    if (!this.stompClient || !this.connected) {
      console.error('Cannot subscribe, not connected to WebSocket');
      return null;
    }

    return this.stompClient.subscribe(destination, (message) => {
      try {
        const payload = JSON.parse(message.body);
        callback(payload);
      } catch (e) {
        callback(message.body);
      }
    });
  }

  sendMessage(destination: string, body: any) {
    if (!this.stompClient || !this.connected) {
      console.error('Cannot send message, not connected to WebSocket');
      return;
    }

    this.stompClient.publish({
      destination,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;