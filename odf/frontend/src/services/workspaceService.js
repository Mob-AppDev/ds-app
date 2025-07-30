import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://10.225.228.51:8080/api';

class WorkspaceService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.api.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getUserWorkspaces() {
    try {
      const response = await this.api.get('/workspaces/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      // Return mock data for now
      return [
        {
          id: 1,
          name: 'DevTeam Workspace',
          description: 'Main development workspace',
          memberCount: 25,
          logo: null,
        },
        {
          id: 2,
          name: 'Design Team',
          description: 'Creative design discussions',
          memberCount: 12,
          logo: null,
        },
      ];
    }
  }

  async getWorkspaceChannels(workspaceId) {
    try {
      const response = await this.api.get(`/workspaces/${workspaceId}/channels`);
      return response.data;
    } catch (error) {
      console.error('Error fetching channels:', error);
      // Return mock data for now
      return [
        {
          id: 1,
          name: 'general',
          description: 'General discussions',
          type: 'PUBLIC',
          unreadCount: 3,
          lastMessage: 'Welcome to the team!',
        },
        {
          id: 2,
          name: 'development',
          description: 'Development discussions',
          type: 'PUBLIC',
          unreadCount: 0,
          lastMessage: 'Code review completed',
        },
      ];
    }
  }

  async createWorkspace(name, description) {
    try {
      const response = await this.api.post('/workspaces', {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create workspace');
    }
  }

  async joinWorkspace(inviteCode) {
    try {
      const response = await this.api.post('/workspaces/join', {
        inviteCode,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to join workspace');
    }
  }
}

export const workspaceService = new WorkspaceService();