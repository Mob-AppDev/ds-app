import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      this.socket = io('http://10.225.228.51:8080', {
        auth: {
          token: token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
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

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Message events
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageUpdate(callback) {
    if (this.socket) {
      this.socket.on('message_updated', callback);
    }
  }

  onMessageDelete(callback) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  sendMessage(channelId, content, type = 'text') {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        channelId,
        content,
        type,
      });
    }
  }

  // Typing events
  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  startTyping(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('start_typing', { channelId });
    }
  }

  stopTyping(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('stop_typing', { channelId });
    }
  }

  // Presence events
  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  updateStatus(status) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_status', { status });
    }
  }

  // Channel events
  onChannelUpdate(callback) {
    if (this.socket) {
      this.socket.on('channel_updated', callback);
    }
  }

  joinChannel(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_channel', { channelId });
    }
  }

  leaveChannel(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_channel', { channelId });
    }
  }
}

export const socketService = new SocketService();