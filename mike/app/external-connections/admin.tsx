import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Users, Activity, AlertTriangle, Settings, Eye, Trash2, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { externalOrgs } from '../../src/data/external-connections-data';
import Toast from '../components/Toast';

interface AdminStats {
  totalOrgs: number;
  activeConnections: number;
  pendingInvites: number;
  recentActivity: number;
}

interface AdminActivity {
  id: string;
  type: 'connection' | 'invite' | 'revoke' | 'permission_change';
  orgName: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export default function AdminDashboardScreen() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const stats: AdminStats = {
    totalOrgs: externalOrgs.length,
    activeConnections: externalOrgs.filter(org => org.type === 'active').length,
    pendingInvites: externalOrgs.filter(org => org.type === 'pending').length,
    recentActivity: 12,
  };

  const recentActivity: AdminActivity[] = [
    {
      id: '1',
      type: 'connection',
      orgName: 'Acme Corp',
      description: 'New connection established',
      timestamp: '2 hours ago',
      severity: 'low',
    },
    {
      id: '2',
      type: 'invite',
      orgName: 'TechStart Inc',
      description: 'Invite sent to external organization',
      timestamp: '4 hours ago',
      severity: 'medium',
    },
    {
      id: '3',
      type: 'permission_change',
      orgName: 'University IT',
      description: 'Permissions updated for shared channels',
      timestamp: '1 day ago',
      severity: 'low',
    },
    {
      id: '4',
      type: 'revoke',
      orgName: 'Old Partner',
      description: 'Connection revoked by admin',
      timestamp: '2 days ago',
      severity: 'high',
    },
  ];

  const handleSendInvite = () => {
    if (!newInviteEmail.trim()) return;
    
    setToast({ visible: true, message: 'Invite sent successfully!', type: 'success' });
    setNewInviteEmail('');
    setShowInviteModal(false);
  };

  const getActivityIcon = (type: AdminActivity['type']) => {
    switch (type) {
      case 'connection':
        return <Users size={16} color="#10B981" />;
      case 'invite':
        return <Plus size={16} color="#3B82F6" />;
      case 'revoke':
        return <Trash2 size={16} color="#EF4444" />;
      case 'permission_change':
        return <Settings size={16} color="#F59E0B" />;
    }
  };

  const getSeverityColor = (severity: AdminActivity['severity']) => {
    switch (severity) {
      case 'low':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'high':
        return '#EF4444';
    }
  };

  const renderActivityItem = ({ item }: { item: AdminActivity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        {getActivityIcon(item.type)}
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.orgName}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{item.timestamp}</Text>
      </View>
      <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(item.severity) }]} />
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
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity 
          style={styles.inviteButton}
          onPress={() => setShowInviteModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Shield size={24} color="#7C3AED" />
            </View>
            <Text style={styles.statNumber}>{stats.totalOrgs}</Text>
            <Text style={styles.statLabel}>Total Organizations</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Users size={24} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{stats.activeConnections}</Text>
            <Text style={styles.statLabel}>Active Connections</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Activity size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{stats.pendingInvites}</Text>
            <Text style={styles.statLabel}>Pending Invites</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <AlertTriangle size={24} color="#EF4444" />
            </View>
            <Text style={styles.statNumber}>{stats.recentActivity}</Text>
            <Text style={styles.statLabel}>Recent Activity</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Eye size={24} color="#7C3AED" />
              <Text style={styles.actionTitle}>View All Connections</Text>
              <Text style={styles.actionDesc}>Monitor all external organizations</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Shield size={24} color="#10B981" />
              <Text style={styles.actionTitle}>Security Audit</Text>
              <Text style={styles.actionDesc}>Review permissions and access</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Settings size={24} color="#F59E0B" />
              <Text style={styles.actionTitle}>Global Settings</Text>
              <Text style={styles.actionDesc}>Configure default permissions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Activity size={24} color="#EF4444" />
              <Text style={styles.actionTitle}>Activity Log</Text>
              <Text style={styles.actionDesc}>View detailed activity history</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <FlatList
            data={recentActivity}
            renderItem={renderActivityItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <Modal visible={showInviteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Organization Invite</Text>
            <Text style={styles.modalDesc}>Invite an external organization to connect</Text>
            
            <TextInput
              style={styles.inviteInput}
              value={newInviteEmail}
              onChangeText={setNewInviteEmail}
              placeholder="Organization email"
              placeholderTextColor="#8B8D97"
              keyboardType="email-address"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSendInvite}
              >
                <Text style={styles.modalButtonPrimaryText}>Send Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    flex: 1,
  },
  inviteButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1D29',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#8B8D97',
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  actionCard: {
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDesc: {
    color: '#8B8D97',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1D29',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    color: '#8B8D97',
    fontSize: 12,
    marginBottom: 2,
  },
  activityTime: {
    color: '#8B8D97',
    fontSize: 10,
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalDesc: {
    color: '#8B8D97',
    fontSize: 14,
    marginBottom: 16,
  },
  inviteInput: {
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#2D3142',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#7C3AED',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 