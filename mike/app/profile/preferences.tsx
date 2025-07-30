import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, Sun, Globe, Languages, Palette, Smartphone, Download, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';

interface Preferences {
  theme: 'dark' | 'light' | 'system';
  language: string;
  compactMode: boolean;
  showAvatars: boolean;
  showTimestamps: boolean;
  autoDownloadMedia: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

export default function PreferencesScreen() {
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'dark',
    language: 'English',
    compactMode: false,
    showAvatars: true,
    showTimestamps: true,
    autoDownloadMedia: false,
    dataUsage: 'medium',
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      largeText: false,
    },
  });

  const handleTogglePreference = (key: keyof Preferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleAccessibility = (key: keyof Preferences['accessibility'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value }
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. The app will need to re-download some content.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Cache Cleared', 'All cached data has been cleared.')
        }
      ]
    );
  };

  const renderSettingItem = (
    IconComponent: any,
    title: string,
    subtitle: string,
    action?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>
        <IconComponent size={20} color="#8B8D97" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {action && <View style={styles.settingAction}>{action}</View>}
    </TouchableOpacity>
  );

  const renderSwitchItem = (
    IconComponent: any,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <IconComponent size={20} color="#8B8D97" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#2D3142', true: '#4A154B' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          {renderSettingItem(
            preferences.theme === 'dark' ? Moon : Sun,
            'Theme',
            preferences.theme === 'system' ? 'System' : preferences.theme === 'dark' ? 'Dark' : 'Light',
            undefined,
            () => {
              const themes = ['dark', 'light', 'system'];
              const currentIndex = themes.indexOf(preferences.theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length] as 'dark' | 'light' | 'system';
              handleTogglePreference('theme', nextTheme);
            }
          )}

          {renderSwitchItem(
            Palette,
            'Compact mode',
            'Reduce spacing between messages',
            preferences.compactMode,
            (value) => handleTogglePreference('compactMode', value)
          )}

          {renderSwitchItem(
            Palette,
            'Show avatars',
            'Display user profile pictures',
            preferences.showAvatars,
            (value) => handleTogglePreference('showAvatars', value)
          )}

          {renderSwitchItem(
            Palette,
            'Show timestamps',
            'Display message timestamps',
            preferences.showTimestamps,
            (value) => handleTogglePreference('showTimestamps', value)
          )}
        </View>

        {/* Language & Region */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language & Region</Text>
          
          {renderSettingItem(
            Languages,
            'Language',
            preferences.language,
            undefined,
            () => Alert.alert('Language', 'Language selection would be configured here.')
          )}

          {renderSettingItem(
            Globe,
            'Region',
            'United States',
            undefined,
            () => Alert.alert('Region', 'Region settings would be configured here.')
          )}
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          
          {renderSwitchItem(
            Download,
            'Auto-download media',
            'Automatically download images and videos',
            preferences.autoDownloadMedia,
            (value) => handleTogglePreference('autoDownloadMedia', value)
          )}

          {renderSettingItem(
            Smartphone,
            'Data usage',
            preferences.dataUsage === 'low' ? 'Low (save data)' : 
            preferences.dataUsage === 'high' ? 'High (best quality)' : 'Medium',
            undefined,
            () => {
              const options = ['low', 'medium', 'high'];
              const currentIndex = options.indexOf(preferences.dataUsage);
              const nextOption = options[(currentIndex + 1) % options.length] as 'low' | 'medium' | 'high';
              handleTogglePreference('dataUsage', nextOption);
            }
          )}

          {renderSettingItem(
            Trash2,
            'Clear cache',
            'Free up storage space',
            undefined,
            handleClearCache
          )}
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          {renderSwitchItem(
            Smartphone,
            'Reduce motion',
            'Minimize animations and transitions',
            preferences.accessibility.reduceMotion,
            (value) => handleToggleAccessibility('reduceMotion', value)
          )}

          {renderSwitchItem(
            Palette,
            'High contrast',
            'Increase contrast for better visibility',
            preferences.accessibility.highContrast,
            (value) => handleToggleAccessibility('highContrast', value)
          )}

          {renderSwitchItem(
            Palette,
            'Large text',
            'Increase text size throughout the app',
            preferences.accessibility.largeText,
            (value) => handleToggleAccessibility('largeText', value)
          )}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          {renderSettingItem(
            Smartphone,
            'App version',
            '1.0.0 (Build 1)',
            undefined,
            undefined
          )}

          {renderSettingItem(
            Smartphone,
            'Terms of service',
            'Read our terms and conditions',
            undefined,
            () => Alert.alert('Terms of Service', 'Terms of service would be displayed here.')
          )}

          {renderSettingItem(
            Smartphone,
            'Privacy policy',
            'Read our privacy policy',
            undefined,
            () => Alert.alert('Privacy Policy', 'Privacy policy would be displayed here.')
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  sectionTitle: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D29',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
  },
  settingAction: {
    marginLeft: 12,
  },
}); 