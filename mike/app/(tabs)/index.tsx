import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Menu, Hash, Plus, X, Bell, Coffee, Bookmark, Send, User, Settings, LogOut, Moon, Smartphone } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

  const handleShowUserModal = () => {
    setShowUserModal(true);
  };

  const handleHideUserModal = () => {
    setShowUserModal(false);
  };
  
  const unreadDMs = [
    { id: '1', name: 'Caleb Adams', avatar: 'C', color: '#E91E63', online: false },
    { id: '2', name: 'Michael Oti Yamoah', avatar: 'M', color: '#8B4513', online: false },
    { id: '3', name: 'Hakeem Adam', avatar: 'H', color: '#4CAF50', online: true },
  ];

  const channels = [
    { id: '1', name: 'announcements', unread: false },
    { id: '2', name: 'general', unread: false },
    { id: '3', name: 'main', unread: false },
  ];

  const allItems = [
    ...unreadDMs.map(dm => ({ ...dm, type: 'dm' as const })),
    ...channels.map(channel => ({ ...channel, type: 'channel' as const })),
  ];

  const getFilteredItems = () => {
    if (!searchQuery.trim()) return allItems;
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const SearchModal = () => (
    <Modal visible={showSearch} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.searchModal}>
        <View style={styles.searchHeader}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8B8D97" />
            <TextInput
              style={styles.searchInput}
              placeholder="Jump to or search..."
              placeholderTextColor="#8B8D97"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              returnKeyType="search"
              keyboardType="default"
              textContentType="none"
            />
          </View>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.searchResults}>
          {getFilteredItems().length > 0 ? (
            getFilteredItems().map((item) => (
              <TouchableOpacity
                key={`${item.type}-${item.id}`}
                style={styles.searchResultItem}
                onPress={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                  if (item.type === 'dm') {
                    router.push(`/chat/dm-${item.id}`);
                  } else {
                    router.push(`/chat/${item.id}`);
                  }
                }}
              >
                <View style={styles.searchResultLeft}>
                  {item.type === 'dm' ? (
                    <View style={[styles.searchResultAvatar, { backgroundColor: (item as any).color }]}>
                      <Text style={styles.searchResultAvatarText}>{(item as any).avatar}</Text>
                    </View>
                  ) : (
                    <Hash size={20} color="#8B8D97" />
                  )}
                  <Text style={styles.searchResultName}>
                    {item.type === 'channel' ? '#' : ''}{item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search...'}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const UserModal = () => (
    <Modal visible={showUserModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.userModalContainer}>
        <View style={styles.userModalHeader}>
          <TouchableOpacity onPress={handleHideUserModal}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.userModalTitle}>You</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.userProfile}>
          <View style={[styles.userAvatar, { backgroundColor: '#4A154B' }]}>
            <User size={24} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>odfianko</Text>
            <View style={styles.statusContainer}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity style={styles.userAction}>
            <Text style={styles.userActionIcon}>😊</Text>
            <Text style={styles.userActionText}>What's your status?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userAction}>
            <Bell size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>Pause notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userAction}>
            <User size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>Set yourself as away</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userAction}>
            <Coffee size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>Invitations to connect</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userAction}>
            <User size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>View profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userAction}>
            <Bell size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userAction}>
            <Settings size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>Preferences</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.userAction}>
            <Moon size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>Dark mode</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.userAction}>
            <Smartphone size={20} color="#FFFFFF" />
            <Text style={styles.userActionText}>Mobile settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.userAction}
            onPress={() => {
              handleHideUserModal();
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Sign Out', 
                    style: 'destructive',
                    onPress: () => router.replace('/auth/login')
                  }
                ]
              );
            }}
          >
            <LogOut size={20} color="#FF6B6B" />
            <Text style={[styles.userActionText, { color: '#FF6B6B' }]}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.workspaceInfo}>
          <View style={styles.workspaceIcon}>
            <Text style={styles.workspaceIconText}>GS</Text>
          </View>
          <Text style={styles.workspaceName}>G17's Workspace</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <View style={[styles.profileAvatar, { backgroundColor: '#4A154B' }]}>
            <User size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => setShowSearch(true)}
      >
        <View style={styles.searchBar}>
          <Search size={16} color="#8B8D97" />
          <Text style={styles.searchPlaceholder}>Jump to or search...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Menu size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Push Notification Banner */}
      {showNotificationBanner && (
        <View style={styles.notificationBanner}>
          <Bell size={20} color="#FFA726" />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Turn on push notifications?</Text>
            <Text style={styles.notificationSubtitle}>
              You're not getting notifications about incoming messages on your device.
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowNotificationBanner(false)}>
            <X size={20} color="#8B8D97" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Coffee size={20} color="#FFFFFF" />
            <Text style={styles.quickActionTitle}>Catch up</Text>
            <Text style={styles.quickActionSubtitle}>3 new</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Coffee size={20} color="#FFFFFF" />
            <Text style={styles.quickActionTitle}>Huddles</Text>
            <Text style={styles.quickActionSubtitle}>0 live</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Bookmark size={20} color="#FFFFFF" />
            <Text style={styles.quickActionTitle}>Later</Text>
            <Text style={styles.quickActionSubtitle}>0 items</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.quickActionTitle}>Drafts & sent</Text>
            <Text style={styles.quickActionSubtitle}>0 items</Text>
          </TouchableOpacity>
        </View>

        {/* Unread DMs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Unread DMs</Text>
            <TouchableOpacity onPress={() => router.push('/chat/all-dms')}>
              <Text style={styles.showAllText}>Show all 4</Text>
            </TouchableOpacity>
          </View>
          
          {unreadDMs.map((dm) => (
            <TouchableOpacity 
              key={dm.id} 
              style={styles.dmItem}
              onPress={() => router.push(`/chat/dm-${dm.id}`)}
            >
              <View style={styles.dmLeft}>
                <View style={styles.dmAvatarContainer}>
                  <View style={[styles.dmAvatar, { backgroundColor: dm.color }]}>
                    <Text style={styles.dmAvatarText}>{dm.avatar}</Text>
                  </View>
                  {dm.online && <View style={styles.onlineIndicator} />}
                </View>
                <Text style={styles.dmName}>{dm.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Unread Channels */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Unread</Text>
            <TouchableOpacity>
              <Text style={styles.expandIcon}>⌄</Text>
            </TouchableOpacity>
          </View>
          
          {channels.map((channel) => (
            <TouchableOpacity 
              key={channel.id} 
              style={styles.channelItem}
              onPress={() => router.push(`/chat/${channel.id}`)}
            >
              <Hash size={16} color="#8B8D97" />
              <Text style={styles.channelName}>{channel.name}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.addChannelButton}>
            <Plus size={16} color="#8B8D97" />
            <Text style={styles.addChannelText}>Add channel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, showQuickActions && styles.fabActive]}
        onPress={() => setShowQuickActions(!showQuickActions)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Quick Actions Menu */}
      {showQuickActions && (
        <TouchableOpacity 
          style={styles.quickActionsOverlay}
          activeOpacity={1}
          onPress={() => setShowQuickActions(false)}
        >
          <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.fabQuickAction}
            onPress={() => {
              setShowQuickActions(false);
              router.push('/canvases');
            }}
          >
            <View style={[styles.fabQuickActionIcon, { backgroundColor: '#7C3AED' }]}>
              <Hash size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.fabQuickActionText}>New Canvas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.fabQuickAction}
            onPress={() => {
              setShowQuickActions(false);
              router.push('/lists');
            }}
          >
            <View style={[styles.fabQuickActionIcon, { backgroundColor: '#10B981' }]}>
              <Hash size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.fabQuickActionText}>New List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.fabQuickAction}
            onPress={() => {
              setShowQuickActions(false);
              router.push('/chat/new');
            }}
          >
            <View style={[styles.fabQuickActionIcon, { backgroundColor: '#3B82F6' }]}>
              <User size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.fabQuickActionText}>New DM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.fabQuickAction}
            onPress={() => {
              setShowQuickActions(false);
              router.push('/chat/new-channel');
            }}
          >
            <View style={[styles.fabQuickActionIcon, { backgroundColor: '#F59E0B' }]}>
              <Hash size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.fabQuickActionText}>New Channel</Text>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      )}

      <UserModal />
      <SearchModal />
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
  workspaceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workspaceIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workspaceIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  workspaceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3142',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchPlaceholder: {
    color: '#8B8D97',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#2D3142',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#3D2914',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationSubtitle: {
    color: '#B8BCC8',
    fontSize: 14,
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#2D3142',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minHeight: 80,
  },
  quickActionTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    color: '#8B8D97',
    fontSize: 11,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  showAllText: {
    color: '#4A9EFF',
    fontSize: 14,
    fontWeight: '500',
  },
  expandIcon: {
    color: '#8B8D97',
    fontSize: 16,
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dmLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dmAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  dmAvatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dmAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1A1D29',
  },
  dmName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  addChannelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  addChannelText: {
    color: '#8B8D97',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#8B8D97',
    fontSize: 14,
    marginLeft: 6,
  },
  userActions: {
    paddingTop: 20,
  },
  userAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  userActionIcon: {
    fontSize: 20,
  },
  userActionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchModal: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3142',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#4A9EFF',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  searchResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchResultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultName: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  noResultsText: {
    color: '#8B8D97',
    fontSize: 16,
    textAlign: 'center',
  },
  userModalContainer: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  userModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  userModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#2D3142',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  // FAB Quick actions styles
  fabActive: {
    backgroundColor: '#7C3AED',
    transform: [{ rotate: '45deg' }],
  },
  quickActionsContainer: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  fabQuickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fabQuickActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // Overlay for closing quick actions
  quickActionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});