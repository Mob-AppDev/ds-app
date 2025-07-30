import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Smartphone, Wifi, Battery, Volume2, Vibrate, Lock, Shield, Download } from 'lucide-react-native';
import { router } from 'expo-router';

interface MobileSettings {
  wifiOnly: boolean;
  batteryOptimization: boolean;
  backgroundRefresh: boolean;
  locationServices: boolean;
  biometricLock: boolean;
  autoLock: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
  mediaAutoPlay: boolean;
  dataSaver: boolean;
  storageOptimization: boolean;
}

export default function MobileSettingsScreen() {
  const [settings, setSettings] = useState<MobileSettings>({
    wifiOnly: false,
    batteryOptimization: true,
    backgroundRefresh: true,
    locationServices: false,
    biometricLock: false,
    autoLock: true,
    hapticFeedback: true,
    soundEffects: true,
    mediaAutoPlay: false,
    dataSaver: false,
    storageOptimization: true,
  });

  const handleToggleSetting = (key: keyof MobileSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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

  const renderSettingItem = (
    IconComponent: any,
    title: string,
    subtitle: string,
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
    </TouchableOpacity>
  );

  const handleStorageInfo = () => {
    Alert.alert(
      'Storage Information',
      'App: 45.2 MB\nCache: 12.8 MB\nDocuments: 2.1 MB\nTotal: 60.1 MB',
      [{ text: 'OK' }]
    );
  };

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
        <Text style={styles.headerTitle}>Mobile Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Data & Network */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Network</Text>
          
          {renderSwitchItem(
            Wifi,
            'Wi-Fi only',
            'Only sync when connected to Wi-Fi',
            settings.wifiOnly,
            (value) => handleToggleSetting('wifiOnly', value)
          )}

          {renderSwitchItem(
            Smartphone,
            'Data saver',
            'Reduce data usage by limiting media',
            settings.dataSaver,
            (value) => handleToggleSetting('dataSaver', value)
          )}

          {renderSwitchItem(
            Smartphone,
            'Background refresh',
            'Allow app to refresh in background',
            settings.backgroundRefresh,
            (value) => handleToggleSetting('backgroundRefresh', value)
          )}
        </View>

        {/* Battery & Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Battery & Performance</Text>
          
          {renderSwitchItem(
            Battery,
            'Battery optimization',
            'Optimize app for better battery life',
            settings.batteryOptimization,
            (value) => handleToggleSetting('batteryOptimization', value)
          )}

          {renderSwitchItem(
            Download,
            'Storage optimization',
            'Automatically manage storage space',
            settings.storageOptimization,
            (value) => handleToggleSetting('storageOptimization', value)
          )}

          {renderSettingItem(
            Download,
            'Storage information',
            'View app storage usage',
            handleStorageInfo
          )}
        </View>

        {/* Security & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          
          {renderSwitchItem(
            Lock,
            'Biometric lock',
            'Use fingerprint or face ID to unlock',
            settings.biometricLock,
            (value) => handleToggleSetting('biometricLock', value)
          )}

          {renderSwitchItem(
            Lock,
            'Auto-lock',
            'Lock app when inactive',
            settings.autoLock,
            (value) => handleToggleSetting('autoLock', value)
          )}

          {renderSwitchItem(
            Shield,
            'Location services',
            'Allow app to access location',
            settings.locationServices,
            (value) => handleToggleSetting('locationServices', value)
          )}
        </View>

        {/* Media & Sound */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media & Sound</Text>
          
          {renderSwitchItem(
            Volume2,
            'Sound effects',
            'Play sounds for notifications and actions',
            settings.soundEffects,
            (value) => handleToggleSetting('soundEffects', value)
          )}

          {renderSwitchItem(
            Vibrate,
            'Haptic feedback',
            'Vibrate for interactions',
            settings.hapticFeedback,
            (value) => handleToggleSetting('hapticFeedback', value)
          )}

          {renderSwitchItem(
            Smartphone,
            'Auto-play media',
            'Automatically play videos and GIFs',
            settings.mediaAutoPlay,
            (value) => handleToggleSetting('mediaAutoPlay', value)
          )}
        </View>

        {/* Device Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Device</Text>
              <Text style={styles.infoValue}>iPhone 15 Pro</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>OS Version</Text>
              <Text style={styles.infoValue}>iOS 17.2</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build Number</Text>
              <Text style={styles.infoValue}>1</Text>
            </View>
          </View>
        </View>

        {/* Troubleshooting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Troubleshooting</Text>
          
          {renderSettingItem(
            Smartphone,
            'Reset app settings',
            'Restore default settings',
            () => Alert.alert(
              'Reset Settings',
              'This will reset all app settings to default. Continue?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Reset', 
                  style: 'destructive',
                  onPress: () => Alert.alert('Settings Reset', 'App settings have been reset to default.')
                }
              ]
            )
          )}

          {renderSettingItem(
            Smartphone,
            'Clear all data',
            'Remove all app data and cache',
            () => Alert.alert(
              'Clear All Data',
              'This will remove all app data, cache, and settings. This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Clear All', 
                  style: 'destructive',
                  onPress: () => Alert.alert('Data Cleared', 'All app data has been cleared.')
                }
              ]
            )
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
  infoCard: {
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    color: '#8B8D97',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
}); 