import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Settings, MessageSquare, Users, MoreVertical, Hash } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { externalOrgs, ExternalOrg } from '../../../src/data/external-connections-data';

export default function OrganizationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();



  const orgData = externalOrgs.find(org => org.id === id) || externalOrgs[0];
  
  // Combine channels and DMs for display
  const sharedItems = [
    ...orgData.channels.map(channel => ({
      id: `channel-${channel.id}`,
      name: channel.name,
      type: 'channel' as const,
      memberCount: channel.memberCount,
      lastActivity: '2 hours ago', // In real app, this would come from actual data
    })),
    ...orgData.dms.map(dm => ({
      id: `dm-${dm.id}`,
      name: dm.name,
      type: 'dm' as const,
      memberCount: dm.participants.length,
      lastActivity: '30 minutes ago', // In real app, this would come from actual data
    }))
  ];

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Organization',
      `Are you sure you want to disconnect from ${orgData.name}? This will remove access to all shared channels and DMs.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Disconnected', 'Organization has been disconnected');
            router.back();
          }
        }
      ]
    );
  };

  const renderChannelItem = ({ item }: { item: { id: string; name: string; type: 'channel' | 'dm'; memberCount: number; lastActivity: string } }) => (
    <TouchableOpacity 
      style={styles.channelContainer}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.channelLeft}>
        <View style={styles.channelIcon}>
          {item.type === 'channel' ? (
            <Hash size={16} color="#8B8D97" />
          ) : (
            <Users size={16} color="#8B8D97" />
          )}
        </View>
        <View style={styles.channelContent}>
          <Text style={styles.channelName}>{item.name}</Text>
          <Text style={styles.channelMeta}>
            {item.memberCount} members • {item.lastActivity}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.channelMore}>
        <MoreVertical size={16} color="#8B8D97" />
      </TouchableOpacity>
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{orgData.name}</Text>
          <Text style={styles.headerSubtitle}>{orgData.status}</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push({ pathname: '/external-connections/org/[id]/settings', params: { id } })}
        >
          <Settings size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Organization Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{orgData.channels.reduce((sum, ch) => sum + ch.memberCount, 0) + orgData.dms.reduce((sum, dm) => sum + dm.participants.length, 0)}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{orgData.channels.length}</Text>
          <Text style={styles.statLabel}>Channels</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{orgData.dms.length}</Text>
          <Text style={styles.statLabel}>DMs</Text>
        </View>
      </View>

      {/* Shared Channels Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shared channels & DMs</Text>
        <Text style={styles.sectionSubtitle}>
          {sharedItems.length} total
        </Text>
      </View>

      {/* Channels List */}
      <FlatList
        data={sharedItems}
        renderItem={renderChannelItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Disconnect Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.disconnectButton}
          onPress={handleDisconnect}
        >
          <Text style={styles.disconnectText}>Disconnect organization</Text>
        </TouchableOpacity>
      </View>
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
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    marginTop: 2,
  },
  settingsButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: '#8B8D97',
    fontSize: 14,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#4A154B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelContent: {
    flex: 1,
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  channelMeta: {
    color: '#8B8D97',
    fontSize: 14,
  },
  channelMore: {
    padding: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3142',
  },
  disconnectButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disconnectText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 