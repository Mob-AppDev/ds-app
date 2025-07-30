import axios from 'axios';

/**
 * Authentication service for unified DevSync app
 * Enhanced from ODF implementation with additional features
 */
const API_BASE_URL = 'http://localhost:8080/api';

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/signin', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(name: string, email: string, password: string): Promise<void> {
    try {
      await this.api.post('/auth/signup', {
        name,
        email,
        password,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.api.post('/auth/forgot-password', {
        email,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await this.api.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }
}

export const authService = new AuthService();