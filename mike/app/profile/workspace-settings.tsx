import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Building, Users, Shield, Settings, Bell, Globe, Lock, UserPlus, Trash2, Plus, X, CreditCard, Calendar, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import Toast from '../components/Toast';

interface WorkspaceSettings {
  name: string;
  domain: string;
  memberCount: number;
  plan: 'free' | 'pro' | 'business';
  allowInvites: boolean;
  requireApproval: boolean;
  allowExternalConnections: boolean;
  defaultChannels: string[];
  retentionPolicy: 'forever' | '30days' | '90days' | '1year';
  privacyLevel: 'public' | 'private';
  billingEmail: string;
  nextBillingDate: string;
  monthlyCost: number;
}

export default function WorkspaceSettingsScreen() {
  const [settings, setSettings] = useState<WorkspaceSettings>({
    name: 'My Workspace',
    domain: 'myworkspace',
    memberCount: 25,
    plan: 'pro',
    allowInvites: true,
    requireApproval: false,
    allowExternalConnections: true,
    defaultChannels: ['general', 'random', 'announcements'],
    retentionPolicy: 'forever',
    privacyLevel: 'private',
    billingEmail: 'admin@myworkspace.com',
    nextBillingDate: '2024-02-15',
    monthlyCost: 12.99,
  });

  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showChannelsModal, setShowChannelsModal] = useState(false);
  const [newChannel, setNewChannel] = useState('');
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const handleToggleSetting = (key: keyof WorkspaceSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setToast({ visible: true, message: 'Setting updated successfully', type: 'success' });
  };

  const handleUpdateRetentionPolicy = (policy: WorkspaceSettings['retentionPolicy']) => {
    setSettings(prev => ({ ...prev, retentionPolicy: policy }));
    setShowRetentionModal(false);
    setToast({ visible: true, message: 'Retention policy updated', type: 'success' });
  };

  const handleUpdatePrivacyLevel = (level: 'public' | 'private') => {
    setSettings(prev => ({ ...prev, privacyLevel: level }));
    setShowPrivacyModal(false);
    setToast({ visible: true, message: 'Privacy level updated', type: 'success' });
  };

  const handleAddDefaultChannel = () => {
    if (newChannel.trim() && !settings.defaultChannels.includes(newChannel.trim())) {
      setSettings(prev => ({
        ...prev,
        defaultChannels: [...prev.defaultChannels, newChannel.trim()]
      }));
      setNewChannel('');
      setToast({ visible: true, message: 'Channel added to defaults', type: 'success' });
    }
  };

  const handleRemoveDefaultChannel = (channel: string) => {
    setSettings(prev => ({
      ...prev,
      defaultChannels: prev.defaultChannels.filter(c => c !== channel)
    }));
    setToast({ visible: true, message: 'Channel removed from defaults', type: 'success' });
  };

  const handleDeleteWorkspace = () => {
    Alert.alert(
      'Delete Workspace',
      'Are you sure you want to delete this workspace? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setToast({ visible: true, message: 'Workspace deleted successfully', type: 'success' });
            setTimeout(() => router.back(), 1500);
          }
        }
      ]
    );
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return '#9C27B0';
      case 'business': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'pro': return 'Pro';
      case 'business': return 'Business';
      default: return 'Free';
    }
  };

  const getRetentionText = (policy: string) => {
    switch (policy) {
      case '30days': return '30 days';
      case '90days': return '90 days';
      case '1year': return '1 year';
      default: return 'Forever';
    }
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

  const RetentionModal = () => (
    <Modal visible={showRetentionModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Message Retention</Text>
            <TouchableOpacity onPress={() => setShowRetentionModal(false)}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>Choose how long to keep messages</Text>
          
          {(['forever', '30days', '90days', '1year'] as const).map((policy) => (
            <TouchableOpacity
              key={policy}
              style={[
                styles.retentionOption,
                settings.retentionPolicy === policy && styles.retentionOptionSelected
              ]}
              onPress={() => handleUpdateRetentionPolicy(policy)}
            >
              <Text style={[
                styles.retentionOptionText,
                settings.retentionPolicy === policy && styles.retentionOptionTextSelected
              ]}>
                {getRetentionText(policy)}
              </Text>
              {settings.retentionPolicy === policy && (
                <View style={styles.retentionCheckmark}>
                  <Text style={styles.retentionCheckmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const PrivacyModal = () => (
    <Modal visible={showPrivacyModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Settings</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>Control workspace visibility</Text>
          
          <TouchableOpacity
            style={[
              styles.privacyOption,
              settings.privacyLevel === 'private' && styles.privacyOptionSelected
            ]}
            onPress={() => handleUpdatePrivacyLevel('private')}
          >
            <View style={styles.privacyOptionHeader}>
              <Lock size={20} color={settings.privacyLevel === 'private' ? '#4A154B' : '#8B8D97'} />
              <Text style={[
                styles.privacyOptionTitle,
                settings.privacyLevel === 'private' && styles.privacyOptionTitleSelected
              ]}>Private</Text>
            </View>
            <Text style={styles.privacyOptionDesc}>
              Only invited members can see workspace information
            </Text>
            {settings.privacyLevel === 'private' && (
              <View style={styles.privacyCheckmark}>
                <Text style={styles.privacyCheckmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.privacyOption,
              settings.privacyLevel === 'public' && styles.privacyOptionSelected
            ]}
            onPress={() => handleUpdatePrivacyLevel('public')}
          >
            <View style={styles.privacyOptionHeader}>
              <Globe size={20} color={settings.privacyLevel === 'public' ? '#4A154B' : '#8B8D97'} />
              <Text style={[
                styles.privacyOptionTitle,
                settings.privacyLevel === 'public' && styles.privacyOptionTitleSelected
              ]}>Public</Text>
            </View>
            <Text style={styles.privacyOptionDesc}>
              Anyone can see basic workspace information
            </Text>
            {settings.privacyLevel === 'public' && (
              <View style={styles.privacyCheckmark}>
                <Text style={styles.privacyCheckmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const BillingModal = () => (
    <Modal visible={showBillingModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Billing & Subscription</Text>
            <TouchableOpacity onPress={() => setShowBillingModal(false)}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.billingCard}>
            <View style={styles.billingHeader}>
              <View style={[styles.planBadge, { backgroundColor: getPlanColor(settings.plan) }]}>
                <Text style={styles.planText}>{getPlanName(settings.plan)}</Text>
              </View>
              <Text style={styles.billingAmount}>${settings.monthlyCost}/month</Text>
            </View>
            
            <View style={styles.billingDetails}>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Billing Email:</Text>
                <Text style={styles.billingValue}>{settings.billingEmail}</Text>
              </View>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Next Billing:</Text>
                <Text style={styles.billingValue}>{settings.nextBillingDate}</Text>
              </View>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Members:</Text>
                <Text style={styles.billingValue}>{settings.memberCount} users</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.billingButton}>
              <CreditCard size={16} color="#FFFFFF" />
              <Text style={styles.billingButtonText}>Update Payment Method</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const ChannelsModal = () => (
    <Modal visible={showChannelsModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Default Channels</Text>
            <TouchableOpacity onPress={() => setShowChannelsModal(false)}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>New members will automatically join these channels</Text>
          
          <View style={styles.addChannelContainer}>
            <TextInput
              style={styles.addChannelInput}
              value={newChannel}
              onChangeText={setNewChannel}
              placeholder="Add a new default channel..."
              placeholderTextColor="#8B8D97"
              autoCorrect={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              returnKeyType="done"
              keyboardType="default"
              textContentType="none"
              onSubmitEditing={handleAddDefaultChannel}
            />
            <TouchableOpacity 
              style={styles.addChannelButton}
              onPress={handleAddDefaultChannel}
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={settings.defaultChannels}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.channelModalItem}>
                <Text style={styles.channelModalName}>#{item}</Text>
                <TouchableOpacity 
                  style={styles.removeChannelButton}
                  onPress={() => handleRemoveDefaultChannel(item)}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
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
        <Text style={styles.headerTitle}>Workspace Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workspace Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workspace</Text>
          
          <View style={styles.workspaceCard}>
            <View style={styles.workspaceHeader}>
              <View style={[styles.workspaceAvatar, { backgroundColor: '#4A154B' }]}>
                <Building size={24} color="#FFFFFF" />
              </View>
              <View style={styles.workspaceInfo}>
                <Text style={styles.workspaceName}>{settings.name}</Text>
                <Text style={styles.workspaceDomain}>@{settings.domain}</Text>
              </View>
              <View style={[styles.planBadge, { backgroundColor: getPlanColor(settings.plan) }]}>
                <Text style={styles.planText}>{getPlanName(settings.plan)}</Text>
              </View>
            </View>
            <Text style={styles.memberCount}>{settings.memberCount} members</Text>
          </View>
        </View>

        {/* Access & Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Access & Permissions</Text>
          
          {renderSettingItem(
            UserPlus,
            'Allow member invitations',
            'Members can invite new people to the workspace',
            <Switch
              value={settings.allowInvites}
              onValueChange={(value) => handleToggleSetting('allowInvites', value)}
              trackColor={{ false: '#2D3142', true: '#4A154B' }}
              thumbColor="#FFFFFF"
            />
          )}

          {renderSettingItem(
            Shield,
            'Require approval for invites',
            'All invitations must be approved by an admin',
            <Switch
              value={settings.requireApproval}
              onValueChange={(value) => handleToggleSetting('requireApproval', value)}
              trackColor={{ false: '#2D3142', true: '#4A154B' }}
              thumbColor="#FFFFFF"
            />
          )}

          {renderSettingItem(
            Globe,
            'Allow external connections',
            'Enable Slack Connect with other organizations',
            <Switch
              value={settings.allowExternalConnections}
              onValueChange={(value) => handleToggleSetting('allowExternalConnections', value)}
              trackColor={{ false: '#2D3142', true: '#4A154B' }}
              thumbColor="#FFFFFF"
            />
          )}
        </View>

        {/* Default Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Channels</Text>
          <Text style={styles.sectionSubtitle}>
            New members will automatically join these channels
          </Text>
          
          {settings.defaultChannels.map((channel, index) => (
            <View key={index} style={styles.channelItem}>
              <Text style={styles.channelName}>#{channel}</Text>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.editChannelsButton}
            onPress={() => setShowChannelsModal(true)}
          >
            <Text style={styles.editChannelsText}>Edit Default Channels</Text>
          </TouchableOpacity>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          {renderSettingItem(
            Lock,
            'Message retention',
            `Keep messages for ${getRetentionText(settings.retentionPolicy)}`,
            undefined,
            () => setShowRetentionModal(true)
          )}

          {renderSettingItem(
            settings.privacyLevel === 'private' ? EyeOff : Eye,
            'Privacy settings',
            `${settings.privacyLevel === 'private' ? 'Private' : 'Public'} workspace`,
            undefined,
            () => setShowPrivacyModal(true)
          )}
        </View>

        {/* Billing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing</Text>
          
          {renderSettingItem(
            CreditCard,
            'Billing & subscription',
            `$${settings.monthlyCost}/month - ${getPlanName(settings.plan)} plan`,
            undefined,
            () => setShowBillingModal(true)
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          {renderSettingItem(
            Trash2,
            'Delete workspace',
            'Permanently delete this workspace and all its data',
            undefined,
            handleDeleteWorkspace
          )}
        </View>
      </ScrollView>

      <RetentionModal />
      <PrivacyModal />
      <BillingModal />
      <ChannelsModal />

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
  sectionSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    marginBottom: 16,
  },
  workspaceCard: {
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 16,
  },
  workspaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workspaceAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workspaceInfo: {
    flex: 1,
  },
  workspaceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  workspaceDomain: {
    color: '#8B8D97',
    fontSize: 14,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  memberCount: {
    color: '#8B8D97',
    fontSize: 14,
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
  channelItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D29',
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  editChannelsButton: {
    backgroundColor: '#4A154B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  editChannelsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23242A',
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxHeight: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    marginBottom: 16,
  },
  retentionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#1A1D29',
  },
  retentionOptionSelected: {
    backgroundColor: '#4A154B',
  },
  retentionOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  retentionOptionTextSelected: {
    fontWeight: '600',
  },
  retentionCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retentionCheckmarkText: {
    color: '#4A154B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  privacyOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#1A1D29',
  },
  privacyOptionSelected: {
    backgroundColor: '#4A154B',
  },
  privacyOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  privacyOptionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  privacyOptionTitleSelected: {
    color: '#FFFFFF',
  },
  privacyOptionDesc: {
    color: '#8B8D97',
    fontSize: 14,
    marginLeft: 28,
  },
  privacyCheckmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyCheckmarkText: {
    color: '#4A154B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  billingCard: {
    backgroundColor: '#1A1D29',
    borderRadius: 12,
    padding: 16,
  },
  billingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  billingAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  billingDetails: {
    marginBottom: 16,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    color: '#8B8D97',
    fontSize: 14,
  },
  billingValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  billingButton: {
    backgroundColor: '#4A154B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  addChannelContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addChannelInput: {
    flex: 1,
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  addChannelButton: {
    backgroundColor: '#4A154B',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelModalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#1A1D29',
  },
  channelModalName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  removeChannelButton: {
    padding: 4,
  },
}); 