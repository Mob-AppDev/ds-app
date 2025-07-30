import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Building, Check, X, Clock, User } from 'lucide-react-native';
import { router } from 'expo-router';

interface Invitation {
  id: string;
  organizationName: string;
  inviterName: string;
  inviterEmail: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  type: 'connect' | 'channel' | 'workspace';
}

export default function InvitationsScreen() {
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      organizationName: 'TechCorp Inc.',
      inviterName: 'Sarah Johnson',
      inviterEmail: 'sarah.johnson@techcorp.com',
      message: 'Hi! We\'d like to collaborate on the upcoming project. Would you be interested in connecting our workspaces?',
      timestamp: '2 hours ago',
      status: 'pending',
      type: 'connect',
    },
    {
      id: '2',
      organizationName: 'Design Studio',
      inviterName: 'Mike Chen',
      inviterEmail: 'mike@designstudio.com',
      message: 'We\'re working on a new design system and would love your team\'s input.',
      timestamp: '1 day ago',
      status: 'pending',
      type: 'channel',
    },
    {
      id: '3',
      organizationName: 'StartupXYZ',
      inviterName: 'Alex Thompson',
      inviterEmail: 'alex@startupxyz.com',
      message: 'Your team has been doing amazing work! Let\'s connect our workspaces for better collaboration.',
      timestamp: '3 days ago',
      status: 'accepted',
      type: 'connect',
    },
  ]);

  const handleAcceptInvitation = (id: string) => {
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, status: 'accepted' as const } : inv
      )
    );
  };

  const handleDeclineInvitation = (id: string) => {
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, status: 'declined' as const } : inv
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#4CAF50';
      case 'declined': return '#FF6B6B';
      default: return '#FFA726';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      default: return 'Pending';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'connect': return <Building size={20} color="#4A154B" />;
      case 'channel': return <User size={20} color="#4A154B" />;
      default: return <Building size={20} color="#4A154B" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'connect': return 'Workspace Connection';
      case 'channel': return 'Channel Invitation';
      default: return 'Workspace Invitation';
    }
  };

  const renderInvitation = ({ item }: { item: Invitation }) => (
    <View style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <View style={styles.orgInfo}>
          {getTypeIcon(item.type)}
          <View style={styles.orgDetails}>
            <Text style={styles.orgName}>{item.organizationName}</Text>
            <Text style={styles.typeText}>{getTypeText(item.type)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.inviterInfo}>
        <Text style={styles.inviterName}>{item.inviterName}</Text>
        <Text style={styles.inviterEmail}>{item.inviterEmail}</Text>
      </View>

      <Text style={styles.message}>{item.message}</Text>

      <View style={styles.invitationFooter}>
        <View style={styles.timestamp}>
          <Clock size={14} color="#8B8D97" />
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        </View>

        {item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAcceptInvitation(item.id)}
            >
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.declineButton]}
              onPress={() => handleDeclineInvitation(item.id)}
            >
              <X size={16} color="#FF6B6B" />
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const otherInvitations = invitations.filter(inv => inv.status !== 'pending');

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
        <Text style={styles.headerTitle}>Invitations</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={[...pendingInvitations, ...otherInvitations]}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          pendingInvitations.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Pending ({pendingInvitations.length})
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Building size={48} color="#8B8D97" />
            <Text style={styles.emptyTitle}>No invitations</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any pending invitations at the moment.
            </Text>
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
  list: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  sectionTitle: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  invitationCard: {
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orgInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orgDetails: {
    marginLeft: 12,
    flex: 1,
  },
  orgName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  typeText: {
    color: '#8B8D97',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inviterInfo: {
    marginBottom: 12,
  },
  inviterName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  inviterEmail: {
    color: '#8B8D97',
    fontSize: 14,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  invitationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    color: '#8B8D97',
    fontSize: 12,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  acceptButton: {
    backgroundColor: '#4A154B',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  declineButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
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
  },
  emptySubtitle: {
    color: '#8B8D97',
    fontSize: 16,
    textAlign: 'center',
  },
}); 