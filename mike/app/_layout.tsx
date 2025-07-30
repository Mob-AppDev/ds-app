import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CanvasProvider } from '../src/context/CanvasContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { StatusProvider } from '../src/context/StatusContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <StatusProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <CanvasProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </CanvasProvider>
        </GestureHandlerRootView>
      </StatusProvider>
    </ThemeProvider>
  );
}
