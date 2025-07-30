import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  FAB,
  Searchbar,
  Chip,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function WorkspaceScreen({ route, navigation }) {
  const { workspace } = route.params;
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All Channels' },
    { key: 'public', label: 'Public' },
    { key: 'private', label: 'Private' },
    { key: 'archived', label: 'Archived' },
  ];

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const loadWorkspaceData = async () => {
    // Mock data for now
    setChannels([
      {
        id: 1,
        name: 'general',
        description: 'General discussions',
        type: 'PUBLIC',
        memberCount: 25,
        unreadCount: 3,
        lastActivity: '2 min ago',
        archived: false,
      },
      {
        id: 2,
        name: 'development',
        description: 'Development discussions and code reviews',
        type: 'PUBLIC',
        memberCount: 12,
        unreadCount: 0,
        lastActivity: '1 hour ago',
        archived: false,
      },
      {
        id: 3,
        name: 'design-team',
        description: 'Design discussions and feedback',
        type: 'PRIVATE',
        memberCount: 8,
        unreadCount: 1,
        lastActivity: '30 min ago',
        archived: false,
      },
      {
        id: 4,
        name: 'old-project',
        description: 'Archived project channel',
        type: 'PUBLIC',
        memberCount: 15,
        unreadCount: 0,
        lastActivity: '2 weeks ago',
        archived: true,
      },
    ]);

    setMembers([
      { id: 1, name: 'John Doe', status: 'online', role: 'Admin' },
      { id: 2, name: 'Jane Smith', status: 'away', role: 'Member' },
      { id: 3, name: 'Mike Johnson', status: 'offline', role: 'Member' },
    ]);
  };

  const getFilteredChannels = () => {
    let filtered = channels;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (activeFilter) {
      case 'public':
        filtered = filtered.filter(channel => channel.type === 'PUBLIC' && !channel.archived);
        break;
      case 'private':
        filtered = filtered.filter(channel => channel.type === 'PRIVATE' && !channel.archived);
        break;
      case 'archived':
        filtered = filtered.filter(channel => channel.archived);
        break;
      default:
        filtered = filtered.filter(channel => !channel.archived);
    }

    return filtered;
  };

  const renderChannel = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Channel', { channel: item })}
    >
      <Card style={[
        styles.channelCard,
        item.archived && styles.archivedChannel
      ]}>
        <Card.Content style={styles.channelContent}>
          <View style={styles.channelIcon}>
            <Ionicons
              name={item.type === 'PRIVATE' ? 'lock-closed' : 'hashtag'}
              size={20}
              color={item.archived ? theme.colors.placeholder : theme.colors.primary}
            />
          </View>
          
          <View style={styles.channelInfo}>
            <View style={styles.channelHeader}>
              <Text variant="titleMedium" style={[
                styles.channelName,
                item.archived && styles.archivedText
              ]}>
                {item.name}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
            
            <Text variant="bodySmall" style={[
              styles.channelDescription,
              item.archived && styles.archivedText
            ]}>
              {item.description}
            </Text>
            
            <View style={styles.channelMeta}>
              <Text variant="bodySmall" style={styles.metaText}>
                {item.memberCount} members
              </Text>
              <Text variant="bodySmall" style={styles.metaText}>
                • {item.lastActivity}
              </Text>
            </View>
          </View>
          
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.placeholder} 
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderMember = ({ item }) => (
    <TouchableOpacity style={styles.memberItem}>
      <Avatar.Text
        size={40}
        label={item.name.split(' ').map(n => n[0]).join('')}
        style={{ backgroundColor: theme.colors.primary }}
      />
      <View style={styles.memberInfo}>
        <Text variant="titleSmall">{item.name}</Text>
        <Text variant="bodySmall" style={styles.memberRole}>
          {item.role}
        </Text>
      </View>
      <View style={[
        styles.statusDot,
        { backgroundColor: getStatusColor(item.status) }
      ]} />
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'away': return '#ffc107';
      case 'busy': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            {workspace.name}
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            {members.length} members
          </Text>
        </View>
      </View>

      <Searchbar
        placeholder="Search channels"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filters}
        renderItem={({ item }) => (
          <Chip
            selected={activeFilter === item.key}
            onPress={() => setActiveFilter(item.key)}
            style={[
              styles.filterChip,
              activeFilter === item.key && styles.activeFilterChip
            ]}
            textStyle={activeFilter === item.key && styles.activeFilterText}
          >
            {item.label}
          </Chip>
        )}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      />

      <FlatList
        data={getFilteredChannels()}
        renderItem={renderChannel}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.channelsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Channels
          </Text>
        }
        ListFooterComponent={
          <View style={styles.membersSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Members ({members.length})
            </Text>
            {members.map((member) => (
              <View key={member.id}>
                {renderMember({ item: member })}
              </View>
            ))}
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Navigate to create channel screen
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.primary,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchbar: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  activeFilterText: {
    color: 'white',
  },
  channelsList: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  channelCard: {
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  archivedChannel: {
    opacity: 0.7,
  },
  channelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    width: 30,
    alignItems: 'center',
  },
  channelInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  channelName: {
    fontWeight: 'bold',
  },
  archivedText: {
    color: theme.colors.placeholder,
  },
  channelDescription: {
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  channelMeta: {
    flexDirection: 'row',
  },
  metaText: {
    color: theme.colors.placeholder,
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: theme.colors.notification,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  membersSection: {
    marginTop: theme.spacing.lg,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  memberInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  memberRole: {
    color: theme.colors.placeholder,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});