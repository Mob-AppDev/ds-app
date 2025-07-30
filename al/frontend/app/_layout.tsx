import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, ActivityIndicator, Animated, Image, Text, StyleSheet } from 'react-native';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400, // Reduced from 600ms
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 1200); // Reduced from 1800ms
    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}> 
      <View style={styles.logoBox}>
        <Image source={require('../assets/images/icon.png')} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.logoText}>DevSync</Text>
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  const [isLoading, setIsLoading] = useState(false); // Changed to false to skip loading state
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Removed the artificial loading delay
    // The AuthProvider will handle its own loading state
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    alignItems: 'center',
  },
  logoImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  logoText: {
    color: '#FF8000',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
