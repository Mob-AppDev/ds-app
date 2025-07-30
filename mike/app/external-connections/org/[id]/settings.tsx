import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Users, Bell, Trash2, Settings as SettingsIcon } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { externalOrgs } from '../../../../src/data/external-connections-data';
import Toast from '../../../components/Toast';

export default function OrganizationSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orgData = externalOrgs.find(org => org.id === id) || externalOrgs[0];
  
  const [notifications, setNotifications] = useState(true);
  const [autoJoin, setAutoJoin] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const handleRevokeAccess = () => {
    Alert.alert(
      'Revoke Access',
      'Are you sure you want to revoke access for this organization? This will remove all shared channels and DMs.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Revoke', 
          style: 'destructive',
          onPress: () => {
            setToast({ visible: true, message: 'Access revoked successfully', type: 'success' });
            setTimeout(() => router.back(), 1500);
          }
        }
      ]
    );
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Organization',
      'Are you sure you want to completely disconnect from this organization? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: () => {
            setToast({ visible: true, message: 'Organization disconnected', type: 'success' });
            setTimeout(() => router.back(), 1500);
          }
        }
      ]
    );
  };

  const renderSettingItem = (
    icon: any,
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
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {action}
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Organization Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization</Text>
          <View style={styles.orgInfo}>
            <Text style={styles.orgName}>{orgData.name}</Text>
            <Text style={styles.orgStatus}>{orgData.status}</Text>
          </View>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          {renderSettingItem(
            <Shield size={20} color="#8B8D97" />,
            'Access Control',
            'Manage who can join channels and DMs',
            <TouchableOpacity style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </TouchableOpacity>,
            () => Alert.alert('Access Control', 'Access control settings would open here')
          )}
          
          {renderSettingItem(
            <Users size={20} color="#8B8D97" />,
            'Member Management',
            'View and manage organization members',
            <TouchableOpacity style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </TouchableOpacity>,
            () => Alert.alert('Member Management', 'Member management would open here')
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem(
            <Bell size={20} color="#8B8D97" />,
            'Push Notifications',
            'Receive notifications from this organization',
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#2D3142', true: '#4A154B' }}
              thumbColor={notifications ? '#FFFFFF' : '#8B8D97'}
            />
          )}
          
          {renderSettingItem(
            <SettingsIcon size={20} color="#8B8D97" />,
            'Auto-join Channels',
            'Automatically join new channels',
            <Switch
              value={autoJoin}
              onValueChange={setAutoJoin}
              trackColor={{ false: '#2D3142', true: '#4A154B' }}
              thumbColor={autoJoin ? '#FFFFFF' : '#8B8D97'}
            />
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          {renderSettingItem(
            <Shield size={20} color="#FF6B6B" />,
            'Revoke Access',
            'Remove access to shared channels and DMs',
            <TouchableOpacity style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </TouchableOpacity>,
            handleRevokeAccess
          )}
          
          {renderSettingItem(
            <Trash2 size={20} color="#FF6B6B" />,
            'Disconnect Organization',
            'Completely disconnect from this organization',
            <TouchableOpacity style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </TouchableOpacity>,
            handleDisconnect
          )}
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orgInfo: {
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
  },
  orgName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  orgStatus: {
    color: '#8B8D97',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginBottom: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1A1D29',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    lineHeight: 20,
  },
  chevron: {
    padding: 4,
  },
  chevronText: {
    color: '#8B8D97',
    fontSize: 18,
    fontWeight: '600',
  },
}); 