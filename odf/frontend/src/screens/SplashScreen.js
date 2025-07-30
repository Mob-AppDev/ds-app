import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'assets/Screenshot 2025-07-18 131941.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="headlineLarge" style={styles.title}>
          DevSync
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Connect. Collaborate. Create.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});