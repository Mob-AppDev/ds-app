import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';

/**
 * Login screen combining the best UI elements from AL and Mike implementations
 * with authentication logic from ODF implementation
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1D1C1D" />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>DS</Text>
          </View>
          <Text style={styles.title}>Sign in to DevSync</Text>
          <Text style={styles.subtitle}>Welcome back to your workspace</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="name@work-email.com"
              placeholderTextColor="#696969"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#696969"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#696969" />
                ) : (
                  <Eye size={20} color="#696969" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In with Email'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleButtonText}>Sign In with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appleButton}>
            <Text style={styles.appleButtonText}>Sign In with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New to DevSync?{' '}
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.footerLink}>Create an account</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1D1C1D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#696969',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1C1D',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1D1C1D',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1D1C1D',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#4A154B',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#E1E8ED',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#1264A3',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#696969',
    fontWeight: '500',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    color: '#1D1C1D',
    fontSize: 16,
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#696969',
  },
  footerLink: {
    color: '#1264A3',
    fontWeight: '500',
  },
});