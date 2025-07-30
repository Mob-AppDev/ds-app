import AsyncStorage from '@react-native-async-storage/async-storage';
import { measureNetworkRequest } from '../utils/performance';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  'http://10.132.169.243:8080/api'; // Updated to match current network IP

console.log('🌐 API_BASE_URL:', API_BASE_URL);

// =======================
// Interfaces
// =======================
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  status: 'ACTIVE' | 'AWAY' | 'DO_NOT_DISTURB' | 'OFFLINE';
  isOnline: boolean;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdBy: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  content: string;
  sender: User;
  channel?: Channel;
  recipient?: User;
  parentMessage?: Message;
  replies: Message[];
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// =======================
// API Service Class
// =======================
class ApiService {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Network error',
      }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // ========== Auth ==========
  async login(username: string, password: string): Promise<AuthResponse> {
    return measureNetworkRequest('login', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await this.handleResponse<AuthResponse>(response);
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userId', data.id.toString());
      return data;
    });
  }

  async bypassAuth(): Promise<AuthResponse> {
    return measureNetworkRequest('bypassAuth', async () => {
      const mock: AuthResponse = {
        token: 'bypass-token-' + Date.now(),
        type: 'Bearer',
        id: 999,
        username: 'bypass-user',
        email: 'bypass@devsync.com',
        roles: ['ROLE_USER'],
      };
      await AsyncStorage.setItem('authToken', mock.token);
      await AsyncStorage.setItem('userId', mock.id.toString());
      return mock;
    });
  }

  async signup(username: string, email: string, password: string): Promise<{ message: string }> {
    return measureNetworkRequest('signup', async () => {
      const requestBody = { username, email, password, role: null };
      console.log('📤 Signup request body:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📥 Signup response status:', response.status);
      return this.handleResponse(response);
    });
  }

  async logout(): Promise<void> {
    return measureNetworkRequest('logout', async () => {
      try {
        await fetch(`${API_BASE_URL}/auth/signout`, {
          method: 'POST',
          headers: await this.getAuthHeaders(),
        });
      } finally {
        await AsyncStorage.multiRemove(['authToken', 'userId']);
      }
    });
  }

  async isAuthenticated(): Promise<boolean> {
    return measureNetworkRequest('isAuthenticated', async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token?.startsWith('bypass-token-')) return true;
      if (!token) return false;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: await this.getAuthHeaders(),
        });
        return response.ok;
      } catch {
        return false;
      }
    });
  }

  // ========== User ==========
  async getUserProfile(): Promise<User> {
    return measureNetworkRequest('getUserProfile', async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token?.startsWith('bypass-token-')) {
        const now = new Date().toISOString();
        return {
          id: 999,
          username: 'bypass-user',
          email: 'bypass@devsync.com',
          firstName: 'Bypass',
          lastName: 'User',
          profilePicture: undefined,
          status: 'ACTIVE',
          isOnline: true,
          lastSeen: now,
          createdAt: now,
          updatedAt: now,
        };
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: await this.getAuthHeaders(),
      });
      return this.handleResponse<User>(response);
    });
  }

  async getOnlineUsers(): Promise<User[]> {
    return measureNetworkRequest('getOnlineUsers', async () => {
      const response = await fetch(`${API_BASE_URL}/users/online`, {
        headers: await this.getAuthHeaders(),
      });
      return this.handleResponse<User[]>(response);
    });
  }

  async updateUserStatus(status: string, isOnline?: boolean): Promise<{ message: string }> {
    return measureNetworkRequest('updateUserStatus', async () => {
      const params = new URLSearchParams({ status });
      if (isOnline !== undefined) params.append('isOnline', isOnline.toString());

      const response = await fetch(`${API_BASE_URL}/users/status?${params}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    });
  }

  async updateFirebaseToken(token: string): Promise<{ message: string }> {
    return measureNetworkRequest('updateFirebaseToken', async () => {
      const url = `${API_BASE_URL}/users/firebase-token?token=${encodeURIComponent(token)}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    });
  }

  async getCurrentUserId(): Promise<number | null> {
    const userId = await AsyncStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  // ========== Channels ==========
  async getUserChannels(): Promise<Channel[]> {
    return measureNetworkRequest('getUserChannels', async () => {
      const response = await fetch(`${API_BASE_URL}/channels`, {
        headers: await this.getAuthHeaders(),
      });
      return this.handleResponse<Channel[]>(response);
    });
  }

  async createChannel(name: string, description = '', isPrivate = false): Promise<Channel> {
    return measureNetworkRequest('createChannel', async () => {
      const response = await fetch(`${API_BASE_URL}/channels`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ name, description, isPrivate }),
      });
      return this.handleResponse<Channel>(response);
    });
  }

  async joinChannel(channelId: number): Promise<{ message: string }> {
    return measureNetworkRequest('joinChannel', async () => {
      const response = await fetch(`${API_BASE_URL}/channels/${channelId}/join`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    });
  }

  // ========== Messages ==========
  async getChannelMessages(
    channelId: number,
    page = 0,
    size = 20
  ): Promise<{
    content: Message[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }> {
    return measureNetworkRequest('getChannelMessages', async () => {
      const response = await fetch(
        `${API_BASE_URL}/messages/channel/${channelId}?page=${page}&size=${size}`,
        { headers: await this.getAuthHeaders() }
      );
      return this.handleResponse(response);
    });
  }

  async getDirectMessages(
    userId: number,
    page = 0,
    size = 20
  ): Promise<{

    content: Message[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }> {
    return measureNetworkRequest('getDirectMessages', async () => {
      const response = await fetch(
        `${API_BASE_URL}/messages/direct/${userId}?page=${page}&size=${size}`,
        { headers: await this.getAuthHeaders() }
      );
      return this.handleResponse(response);
    });
  }

  async sendChannelMessage(channelId: number, content: string, type = 'TEXT'): Promise<Message> {
    return measureNetworkRequest('sendChannelMessage', async () => {
      const response = await fetch(`${API_BASE_URL}/messages/channel/${channelId}`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ content, type }),
      });
      return this.handleResponse<Message>(response);
    });
  }

  async sendDirectMessage(userId: number, content: string, type = 'TEXT'): Promise<Message> {
    return measureNetworkRequest('sendDirectMessage', async () => {
      const response = await fetch(`${API_BASE_URL}/messages/direct/${userId}`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ content, type }),
      });
      return this.handleResponse<Message>(response);
    });
  }

  async getThreadReplies(messageId: number): Promise<Message[]> {
    return measureNetworkRequest('getThreadReplies', async () => {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/replies`, {
        headers: await this.getAuthHeaders(),
      });
      return this.handleResponse<Message[]>(response);
    });
  }
}

export const apiService = new ApiService();
