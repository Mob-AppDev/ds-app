import io, { Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

/**
 * WebSocket service for real-time communication
 * Enhanced from ODF implementation with additional event handling
 */
class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  async connect(): Promise<Socket> {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      this.socket = io('http://localhost:8080', {
        auth: {
          token: token,
        },
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to DevSync server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from DevSync server');
        this.isConnected = false;
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      return this.socket;
    } catch (error) {
      console.error('Failed to connect to socket:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Message events
  onNewMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageUpdate(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on('message_updated', callback);
    }
  }

  onMessageDelete(callback: (messageId: string) => void): void {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  sendMessage(channelId: string, content: string, type = 'text'): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        channelId,
        content,
        type,
      });
    }
  }

  // Typing events
  onTyping(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onStopTyping(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  startTyping(channelId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('start_typing', { channelId });
    }
  }

  stopTyping(channelId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('stop_typing', { channelId });
    }
  }

  // Presence events
  onUserOnline(callback: (user: any) => void): void {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  onUserOffline(callback: (user: any) => void): void {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  updateStatus(status: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_status', { status });
    }
  }

  // Channel events
  onChannelUpdate(callback: (channel: any) => void): void {
    if (this.socket) {
      this.socket.on('channel_updated', callback);
    }
  }

  joinChannel(channelId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_channel', { channelId });
    }
  }

  leaveChannel(channelId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_channel', { channelId });
    }
  }

  // Canvas collaboration events
  onCanvasUpdate(callback: (canvas: any) => void): void {
    if (this.socket) {
      this.socket.on('canvas_updated', callback);
    }
  }

  updateCanvas(canvasId: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_canvas', { canvasId, data });
    }
  }

  // List collaboration events
  onListUpdate(callback: (list: any) => void): void {
    if (this.socket) {
      this.socket.on('list_updated', callback);
    }
  }

  updateList(listId: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_list', { listId, data });
    }
  }
}

export const socketService = new SocketService();