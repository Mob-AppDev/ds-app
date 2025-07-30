import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, AtSign, MessageSquare, RotateCcw, User, Hash, X } from 'lucide-react-native';
import { router } from 'expo-router';

interface ActivityItem {
  id: string;
  type: 'channel_invitation' | 'app_notification' | 'mention' | 'thread' | 'reaction';
  title: string;
  subtitle: string;
  timestamp: string;
  avatar: string;
  color: string;
  channel?: string;
  user?: string;
  message?: string;
}

export default function ActivityScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentions' | 'threads' | 'reactions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);  
  const [showUserModal, setShowUserModal] = useState(false);
  
  const [allActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'channel_invitation',
      title: 'Caleb Adams',
      subtitle: 'Added you to #test-channel',
      timestamp: 'Jun 9th',
      avatar: 'C',
      color: '#E91E63',
      channel: 'test-channel',
    },
    {
      id: '2',
      type: 'app_notification',
      title: 'Slackbot',
      subtitle: '@Alvin archived the channel 🗑️random',
      timestamp: 'May 20th',
      avatar: 'S',
      color: '#4A154B',
      user: 'Alvin',
      channel: 'random',
    },
    {
      id: '3',
      type: 'channel_invitation',
      title: 'Alvin',
      subtitle: 'Added you to #backend',
      timestamp: 'May 9th',
      avatar: 'A',
      color: '#9C27B0',
      channel: 'backend',
    },
    {
      id: '4',
      type: 'mention',
      title: 'Michael Oti Yamoah',
      subtitle: 'mentioned you in #general: @odfianko can you review this?',
      timestamp: 'Jun 8th',
      avatar: 'M',
      color: '#FF9800',
      channel: 'general',
      message: 'can you review this?',
    },
    {
      id: '5',
      type: 'mention',
      title: 'Hakeem Adam',
      subtitle: 'mentioned you in #main: @odfianko what do you think?',
      timestamp: 'Jun 7th',
      avatar: 'H',
      color: '#4CAF50',
      channel: 'main',
      message: 'what do you think?',
    },
    {
      id: '6',
      type: 'thread',
      title: 'Frank Iokko',
      subtitle: 'replied to your thread in #announcements',
      timestamp: 'Jun 6th',
      avatar: 'F',
      color: '#2196F3',
      channel: 'announcements',
    },
    {
      id: '7',
      type: 'thread',
      title: 'Caleb Adams',
      subtitle: 'started a thread on your message in #general',
      timestamp: 'Jun 5th',
      avatar: 'C',
      color: '#E91E63',
      channel: 'general',
    },
    {
      id: '8',
      type: 'reaction',
      title: 'Michael Oti Yamoah',
      subtitle: 'reacted 👍 to your message in #main',
      timestamp: 'Jun 4th',
      avatar: 'M',
      color: '#FF9800',
      channel: 'main',
    },
    {
      id: '9',
      type: 'reaction',
      title: 'Alvin',
      subtitle: 'reacted ❤️ to your message in #backend',
      timestamp: 'Jun 3rd',
      avatar: 'A',
      color: '#9C27B0',
      channel: 'backend',
    },
  ]);

  const getFilteredActivities = () => {
    let filtered = allActivities;

    // Filter by type
    switch (activeFilter) {
      case 'mentions':
        filtered = filtered.filter(item => item.type === 'mention');
        break;
      case 'threads':
        filtered = filtered.filter(item => item.type === 'thread');
        break;
      case 'reactions':
        filtered = filtered.filter(item => item.type === 'reaction');
        break;
      default:
        // 'all' shows everything
        break;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.channel && item.channel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.user && item.user.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'mentions':
        return AtSign;
      case 'threads':
        return MessageSquare;
      case 'reactions':
        return RotateCcw;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'channel_invitation':
        return '#';
      case 'app_notification':
        return '📱';
      case 'mention':
        return '@';
      case 'thread':
        return '💬';
      case 'reaction':
        return '👍';
      default:
        return '•';
    }
  };

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'mentions', label: 'Mentions' },
    { key: 'threads', label: 'Threads' },
    { key: 'reactions', label: 'Reactions' },
  ];

  const filteredActivities = getFilteredActivities();

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
          {filteredActivities.length > 0 ? (
            filteredActivities.map(renderActivityItem)
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search activities...'}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderActivityItem = (item: ActivityItem) => {
    const handleItemPress = () => {
      if (item.title === 'Slackbot') {
        // Navigate to Slackbot DM
        router.push('/chat/slackbot');
      } else if (item.type === 'mention' || item.type === 'thread') {
        // Navigate to the specific channel and message
        router.push(`/chat/${item.channel || 'general'}`);
      } else {
        // Navigate to the channel
        router.push(`/chat/${item.channel || 'general'}`);
      }
    };

    const renderClickableText = (text: string) => {
      const words = text.split(' ');
      return words.map((word, index) => {
        if (word.startsWith('@') && word.length > 1) {
          const username = word.substring(1);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/chat/dm-${username.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              <Text style={styles.mentionLink}>{word}</Text>
            </TouchableOpacity>
          );
        } else if (word.startsWith('#') && word.length > 1) {
          const channelName = word.substring(1);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/chat/${channelName}`)}
            >
              <Text style={styles.channelLink}>{word}</Text>
            </TouchableOpacity>
          );
        }
        return <Text key={index} style={styles.regularText}>{word} </Text>;
      });
    };

    return (
      <TouchableOpacity key={item.id} style={styles.activityItem} onPress={handleItemPress}>
        <View style={styles.activityLeft}>
          <View style={styles.activityIcon}>
            <Text style={styles.activityIconText}>{getActivityIcon(item.type)}</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: item.color }]}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
          <View style={styles.activityContent}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <View style={styles.activitySubtitle}>
              {renderClickableText(item.subtitle)}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        
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
      </TouchableOpacity>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filterButtons.map((filter) => {
            const IconComponent = getFilterIcon(filter.key);
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  activeFilter === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setActiveFilter(filter.key as any)}
              >
                {IconComponent && (
                  <IconComponent 
                    size={16} 
                    color={activeFilter === filter.key ? '#FFFFFF' : '#8B8D97'} 
                  />
                )}
                <Text style={[
                  styles.filterButtonText,
                  activeFilter === filter.key && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(renderActivityItem)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeFilter === 'all' 
                ? 'No activity yet' 
                : `No ${activeFilter} found`}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeFilter === 'mentions' && 'When someone mentions you, it will appear here'}
              {activeFilter === 'threads' && 'Thread replies will appear here'}
              {activeFilter === 'reactions' && 'Message reactions will appear here'}
              {activeFilter === 'all' && 'Your activity will appear here'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Unread Button */}
      <TouchableOpacity style={styles.unreadButton}>
        <Text style={styles.unreadButtonText}>Unread</Text>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
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
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3142',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#4A154B',
  },
  filterButtonText: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  activityIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 6,
  },
  activityIconText: {
    fontSize: 10,
    color: '#8B8D97',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    color: '#8B8D97',
    fontSize: 12,
  },
  activitySubtitle: {
    color: '#B8BCC8',
    fontSize: 14,
    lineHeight: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  channelLink: {
    color: '#4A9EFF',
  },
  mentionLink: {
    color: '#4A9EFF',
  },
  regularText: {
    color: '#B8BCC8',
  },
  unreadButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  unreadButtonText: {
    color: '#1A1D29',
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
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#8B8D97',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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