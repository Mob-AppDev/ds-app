import axios from 'axios';

const API_BASE_URL = 'http://10.225.228.51:8080/api';


class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } 

  async login(email, password) {
    try {
      const response = await this.api.post('/auth/signin', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(name, email, password) {
    try {
      const response = await this.api.post('/auth/signup', {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await this.api.post('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await this.api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }
}

export const authService = new AuthService();