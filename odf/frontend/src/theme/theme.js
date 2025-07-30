import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4A154B',
    secondary: '#611f69',
    accent: '#007a5a',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#1d1c1d',
    onSurface: '#1d1c1d',
    placeholder: '#616061',
    border: '#e1e5e9',
    notification: '#ff6b6b',
    success: '#007a5a',
    warning: '#f2c744',
    error: '#e01e5a',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};