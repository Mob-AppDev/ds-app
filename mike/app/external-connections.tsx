import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Settings, Users, MessageSquare, Building, Clock, CheckCircle, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { externalOrgs, ExternalOrg } from '../src/data/external-connections-data';

export default function ExternalConnectionsScreen() {
  const [activeSection, setActiveSection] = useState<'active' | 'pending' | 'requests'>('active');



  const getFilteredOrgs = () => {
    return externalOrgs.filter((org: ExternalOrg) => org.type === activeSection);
  };

  const renderOrgItem = ({ item }: { item: ExternalOrg }) => (
    <TouchableOpacity 
      style={styles.orgContainer}
      onPress={() => router.push({ pathname: '/external-connections/org/[id]', params: { id: item.id } })}
    >
      <View style={styles.orgHeader}>
        <View style={styles.orgLeft}>
          <View style={styles.orgAvatar}>
            <Building size={20} color="#FFFFFF" />
          </View>
          <View style={styles.orgContent}>
            <Text style={styles.orgName}>{item.name}</Text>
            <Text style={styles.orgStatus}>{item.status}</Text>
          </View>
        </View>
        
        {item.type === 'active' && (
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push({ pathname: '/external-connections/org/[id]', params: { id: item.id } })}
          >
            <Settings size={16} color="#8B8D97" />
          </TouchableOpacity>
        )}
      </View>

      {item.type === 'active' && (
        <View style={styles.orgStats}>
          <View style={styles.statItem}>
            <MessageSquare size={14} color="#8B8D97" />
            <Text style={styles.statText}>{item.channels.length} channels</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={14} color="#8B8D97" />
            <Text style={styles.statText}>{item.dms.length} DMs</Text>
          </View>
        </View>
      )}

      {item.type === 'pending' && (
        <View style={styles.pendingActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Cancel Invite', 'Are you sure you want to cancel this invite?')}
          >
            <Text style={styles.cancelText}>Cancel invite</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.type === 'request' && (
        <View style={styles.requestActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => Alert.alert('Accept Request', 'Connection request accepted')}
          >
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Decline Request', 'Connection request declined')}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, count }: { title: string; count: number }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCount}>
        <Text style={styles.sectionCountText}>{count}</Text>
      </View>
    </View>
  );

  const filteredOrgs = getFilteredOrgs();

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
        <Text style={styles.headerTitle}>External connections</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => router.push('/external-connections/admin')}
          >
            <Shield size={18} color="#7C3AED" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/external-connections/invite')}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeSection === 'active' && styles.activeTabButton]}
          onPress={() => setActiveSection('active')}
        >
          <Text style={[styles.tabText, activeSection === 'active' && styles.activeTabText]}>
            Active
          </Text>
          <View style={[styles.tabCount, activeSection === 'active' && styles.activeTabCount]}>
            <Text style={[styles.tabCountText, activeSection === 'active' && styles.activeTabCountText]}>
              {externalOrgs.filter((org: ExternalOrg) => org.type === 'active').length}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeSection === 'pending' && styles.activeTabButton]}
          onPress={() => setActiveSection('pending')}
        >
          <Text style={[styles.tabText, activeSection === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
          <View style={[styles.tabCount, activeSection === 'pending' && styles.activeTabCount]}>
            <Text style={[styles.tabCountText, activeSection === 'pending' && styles.activeTabCountText]}>
              {externalOrgs.filter((org: ExternalOrg) => org.type === 'pending').length}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeSection === 'requests' && styles.activeTabButton]}
          onPress={() => setActiveSection('requests')}
        >
          <Text style={[styles.tabText, activeSection === 'requests' && styles.activeTabText]}>
            Requests
          </Text>
          <View style={[styles.tabCount, activeSection === 'requests' && styles.activeTabCount]}>
            <Text style={[styles.tabCountText, activeSection === 'requests' && styles.activeTabCountText]}>
              {externalOrgs.filter((org: ExternalOrg) => org.type === 'request').length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Organizations List */}
      <FlatList
        data={filteredOrgs}
        renderItem={renderOrgItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Building size={48} color="#8B8D97" />
            <Text style={styles.emptyTitle}>
              {activeSection === 'active' && 'No active connections'}
              {activeSection === 'pending' && 'No pending invites'}
              {activeSection === 'requests' && 'No connection requests'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeSection === 'active' && 'Start collaborating with external organizations'}
              {activeSection === 'pending' && 'No pending connection invites'}
              {activeSection === 'requests' && 'No incoming connection requests'}
            </Text>
            {activeSection === 'active' && (
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={() => router.push('/external-connections/invite')}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.emptyActionText}>Send invite</Text>
              </TouchableOpacity>
            )}
          </View>
        }
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminButton: {
    padding: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  addButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#2D3142',
  },
  activeTabButton: {
    backgroundColor: '#4A154B',
  },
  tabText: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabCount: {
    marginLeft: 6,
    backgroundColor: '#4A154B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabCount: {
    backgroundColor: '#FFFFFF',
  },
  tabCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabCountText: {
    color: '#4A154B',
  },
  list: {
    flex: 1,
  },
  orgContainer: {
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
  },
  orgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orgLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orgContent: {
    flex: 1,
  },
  orgName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  orgStatus: {
    color: '#8B8D97',
    fontSize: 14,
  },
  settingsButton: {
    padding: 4,
  },
  orgStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#8B8D97',
    fontSize: 14,
  },
  pendingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#2D3142',
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  cancelText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  declineText: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionCount: {
    marginLeft: 8,
    backgroundColor: '#4A154B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  sectionCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#8B8D97',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A154B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 