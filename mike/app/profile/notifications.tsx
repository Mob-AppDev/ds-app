import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, BellOff, MessageSquare, AtSign, Hash, Clock, Smartphone } from 'lucide-react-native';
import { router } from 'expo-router';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  mentions: boolean;
  directMessages: boolean;
  channelMessages: boolean;
  threadReplies: boolean;
  reactions: boolean;
  doNotDisturb: boolean;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export default function NotificationsScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: false,
    mentions: true,
    directMessages: true,
    channelMessages: false,
    threadReplies: true,
    reactions: false,
    doNotDisturb: false,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '08:00',
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const handleToggleSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSettingItem = (
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* General Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          {renderSettingItem(
            Bell,
            'Push notifications',
            'Receive notifications on your device',
            settings.pushNotifications,
            (value) => handleToggleSetting('pushNotifications', value)
          )}

          {renderSettingItem(
            MessageSquare,
            'Email notifications',
            'Receive notifications via email',
            settings.emailNotifications,
            (value) => handleToggleSetting('emailNotifications', value)
          )}
        </View>

        {/* Message Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages</Text>
          
          {renderSettingItem(
            AtSign,
            'Mentions',
            'When someone mentions you',
            settings.mentions,
            (value) => handleToggleSetting('mentions', value)
          )}

          {renderSettingItem(
            MessageSquare,
            'Direct messages',
            'When someone sends you a DM',
            settings.directMessages,
            (value) => handleToggleSetting('directMessages', value)
          )}

          {renderSettingItem(
            Hash,
            'Channel messages',
            'When someone posts in channels you\'re in',
            settings.channelMessages,
            (value) => handleToggleSetting('channelMessages', value)
          )}

          {renderSettingItem(
            MessageSquare,
            'Thread replies',
            'When someone replies to your threads',
            settings.threadReplies,
            (value) => handleToggleSetting('threadReplies', value)
          )}

          {renderSettingItem(
            MessageSquare,
            'Reactions',
            'When someone reacts to your messages',
            settings.reactions,
            (value) => handleToggleSetting('reactions', value)
          )}
        </View>

        {/* Do Not Disturb */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Do Not Disturb</Text>
          
          {renderSettingItem(
            BellOff,
            'Do not disturb',
            'Pause notifications during quiet hours',
            settings.doNotDisturb,
            (value) => handleToggleSetting('doNotDisturb', value)
          )}

          {settings.doNotDisturb && (
            <View style={styles.dndSchedule}>
              <Text style={styles.dndText}>
                Quiet hours: {settings.doNotDisturbStart} - {settings.doNotDisturbEnd}
              </Text>
            </View>
          )}
        </View>

        {/* Sound & Vibration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          
          {renderSettingItem(
            Smartphone,
            'Sound',
            'Play sound for notifications',
            settings.soundEnabled,
            (value) => handleToggleSetting('soundEnabled', value)
          )}

          {renderSettingItem(
            Smartphone,
            'Vibration',
            'Vibrate for notifications',
            settings.vibrationEnabled,
            (value) => handleToggleSetting('vibrationEnabled', value)
          )}
        </View>

        {/* Notification Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewAvatar, { backgroundColor: '#4A154B' }]}>
                <Text style={styles.previewAvatarText}>S</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewTitle}>Sarah Johnson</Text>
                <Text style={styles.previewSubtitle}>#general</Text>
              </View>
              <Text style={styles.previewTime}>now</Text>
            </View>
            <Text style={styles.previewMessage}>
              Hey @odfianko, can you review the latest changes?
            </Text>
          </View>
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
  dndSchedule: {
    marginTop: 12,
    paddingLeft: 32,
  },
  dndText: {
    color: '#8B8D97',
    fontSize: 14,
  },
  previewCard: {
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  previewSubtitle: {
    color: '#8B8D97',
    fontSize: 12,
  },
  previewTime: {
    color: '#8B8D97',
    fontSize: 12,
  },
  previewMessage: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
}); 