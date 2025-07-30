import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, AuthResponse } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserStatus: (status: string, isOnline?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
  bypassAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check for cached user data first
      const cachedUser = await AsyncStorage.getItem('cachedUser');
      const token = await AsyncStorage.getItem('authToken');
      
      if (cachedUser && token) {
        const userData = JSON.parse(cachedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Verify token in background
        setTimeout(async () => {
          try {
            const authenticated = await apiService.isAuthenticated();
            if (!authenticated) {
              await apiService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error('Background auth check failed:', error);
          }
        }, 1000);
        return;
      }

      // No cached data, check authentication
      const authenticated = await apiService.isAuthenticated();
      if (authenticated) {
        const userProfile = await apiService.getUserProfile();
        setUser(userProfile);
        setIsAuthenticated(true);
        // Cache user data
        await AsyncStorage.setItem('cachedUser', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await apiService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const authResponse = await apiService.login(username, password);
      const userProfile = await apiService.getUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
      // Cache user data
      await AsyncStorage.setItem('cachedUser', JSON.stringify(userProfile));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await apiService.signup(username, email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      // Clear cached data
      await AsyncStorage.multiRemove(['cachedUser', 'authToken', 'userId']);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (status: string, isOnline?: boolean) => {
    try {
      await apiService.updateUserStatus(status, isOnline);
      if (user) {
        const updatedUser = {
          ...user,
          status: status as any,
          isOnline: isOnline ?? user.isOnline,
        };
        setUser(updatedUser);
        // Update cached data
        await AsyncStorage.setItem('cachedUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userProfile = await apiService.getUserProfile();
      setUser(userProfile);
      // Update cached data
      await AsyncStorage.setItem('cachedUser', JSON.stringify(userProfile));
    } catch (error) {
      console.error('User refresh failed:', error);
    }
  };

  const bypassAuth = async () => {
    try {
      setIsLoading(true);
      await apiService.bypassAuth();
      const userProfile = await apiService.getUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
      // Cache user data
      await AsyncStorage.setItem('cachedUser', JSON.stringify(userProfile));
    } catch (error) {
      console.error('Bypass auth failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUserStatus,
        refreshUser,
        bypassAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;