import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { StatusProvider } from '../src/context/StatusContext';
import { CanvasProvider } from '../src/context/CanvasContext';
import { ListsProvider } from '../src/context/ListsContext';

/**
 * Root layout component for the unified DevSync app
 * Combines providers from all implementations for comprehensive functionality
 */
export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <CanvasProvider>
              <ListsProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ListsProvider>
            </CanvasProvider>
          </GestureHandlerRootView>
        </StatusProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}