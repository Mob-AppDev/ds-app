import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Menu, Plus, User, Users } from 'lucide-react-native';
import { router } from 'expo-router';

interface DirectMessage {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

export default function DirectMessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Shared user and mapping logic (copy from chat/[id].tsx)
  const users: Record<string, { name: string; initials: string; color: string; online: boolean }> = {
    'caleb-adams': { name: 'Caleb Adams', initials: 'C', color: '#E94F37', online: false },
    'michael-oti-yamoah': { name: 'Michael Oti Yamoah', initials: 'M', color: '#F6C85F', online: true },
    'hakeem-adam': { name: 'Hakeem Adam', initials: 'H', color: '#43BCCD', online: true },
  };
  const userIdToSlug: Record<string, string> = {
    '1': 'caleb-adams',
    '2': 'michael-oti-yamoah',
    '3': 'hakeem-adam',
  };
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
  function getUserByIdOrName(id: string, name?: string) {
    let slug = id;
    if (userIdToSlug[slug]) slug = userIdToSlug[slug];
    const user = users[slug];
    if (user) return user;
    // Fallback for new users
    const displayName = name || slug.replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return {
      name: displayName,
      initials: getInitials(displayName),
      color: '#7C3AED',
      online: false,
    };
  }

  const [directMessages] = useState<DirectMessage[]>([
    // Use only id and name, let getUserByIdOrName handle the rest
    { id: '1', name: 'Caleb Adams', lastMessage: 'You: Worla joined Slack — take a second to say hello.', timestamp: 'May 9th' },
    { id: '2', name: 'Michael Oti Yamoah', lastMessage: 'You: Worla joined Slack — take a second to say hello.', timestamp: 'May 9th' },
    { id: '3', name: 'Hakeem Adam', lastMessage: 'You: Worla has joined Slack — take a second to say hello.', timestamp: 'May 9th' },
    { id: '4', name: 'Alvin', lastMessage: 'You: Worla accepted your invitation to join Slack — take a second to say hello.', timestamp: 'May 9th' },
    { id: '5', name: 'selormfidel', lastMessage: 'odefiankoworlasi made updates to a canvas tab:', timestamp: 'May 8th' },
    { id: '6', name: 'Roger Osafo Kwabena Adu', lastMessage: 'Roger Osafo Kwabena Adu made updates to a canvas tab:', timestamp: 'May 9th' },
  ]);

  const getFilteredMessages = () => {
    if (!searchQuery.trim()) return directMessages;
    
    return directMessages.filter(dm => 
      dm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dm.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const SearchModal = () => (
    <Modal visible={showSearch} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.searchModal}>
        <View style={styles.searchHeader}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8B8D97" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search direct messages..."
              placeholderTextColor="#8B8D97"
              value={searchQuery}
              onChangeText={setSearchQuery}
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
          {getFilteredMessages().length > 0 ? (
            getFilteredMessages().map(renderDirectMessage)
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search messages...'}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderDirectMessage = (dm: DirectMessage) => {
    const user = getUserByIdOrName(dm.id, dm.name);
    return (
      <TouchableOpacity
        key={dm.id}
        style={styles.dmItem}
        onPress={() => router.push(`/chat/dm-${dm.id}`)}
      >
        <View style={styles.dmLeft}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: user.color }]}> 
              <Text style={styles.avatarText}>{user.initials}</Text>
            </View>
            {user.online && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.dmContent}>
            <View style={styles.dmHeader}>
              <Text style={styles.dmName}>{user.name}</Text>
              <Text style={styles.timestamp}>{dm.timestamp}</Text>
            </View>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {dm.lastMessage}
            </Text>
            {dm.lastMessage.includes('canvas tab:') && (
              <Text style={styles.canvasLink}>📋 Weekly 1:1</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Direct messages</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Direct Messages List */}
        {directMessages.map(renderDirectMessage)}

        {/* Browse All People */}
        <TouchableOpacity style={styles.browseItem}>
          <View style={styles.browseIcon}>
            <Users size={20} color="#FFFFFF" />
          </View>
          <View style={styles.browseContent}>
            <Text style={styles.browseName}>Browse all people</Text>
            <Text style={styles.browseSubtitle}>8 members</Text>
          </View>
        </TouchableOpacity>

        {/* Add Teammates */}
        <TouchableOpacity style={styles.browseItem}>
          <View style={styles.addIcon}>
            <User size={20} color="#FFFFFF" />
          </View>
          <View style={styles.browseContent}>
            <Text style={styles.browseName}>Add teammates</Text>
            <Text style={styles.browseSubtitle}>By SMS, email or phone contacts</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    padding: 4,
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
  content: {
    flex: 1,
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  dmLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  dmContent: {
    flex: 1,
  },
  dmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dmName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    color: '#8B8D97',
    fontSize: 12,
  },
  lastMessage: {
    color: '#B8BCC8',
    fontSize: 14,
    lineHeight: 20,
  },
  canvasLink: {
    color: '#4A9EFF',
    fontSize: 14,
    marginTop: 4,
  },
  browseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  browseIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  browseContent: {
    flex: 1,
  },
  browseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  browseSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
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
});