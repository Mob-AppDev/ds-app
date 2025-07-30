import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Theme context from Mike implementation
 * Enhanced for unified DevSync branding
 */
type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const colors = theme === 'dark' ? {
    primary: '#4A154B',
    secondary: '#7C3AED',
    background: '#1A1D29',
    surface: '#2D3142',
    text: '#FFFFFF',
    textSecondary: '#8B8D97',
    border: '#23242A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  } : {
    primary: '#4A154B',
    secondary: '#7C3AED',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1D1C1D',
    textSecondary: '#616061',
    border: '#E1E5E9',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};