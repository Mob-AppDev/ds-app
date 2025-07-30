import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  Chip,
  Avatar,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchResults, setSearchResults] = useState([]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'messages', label: 'Messages' },
    { key: 'files', label: 'Files' },
    { key: 'people', label: 'People' },
    { key: 'channels', label: 'Channels' },
  ];

  // Mock search results
  const mockResults = [
    {
      id: 1,
      type: 'message',
      content: 'Hey team, let\'s discuss the new project requirements',
      author: 'John Doe',
      channel: '#general',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'file',
      name: 'project-specs.pdf',
      author: 'Jane Smith',
      channel: '#development',
      timestamp: '1 day ago',
      size: '2.4 MB',
    },
    {
      id: 3,
      type: 'person',
      name: 'Mike Johnson',
      title: 'Senior Developer',
      status: 'online',
    },
    {
      id: 4,
      type: 'channel',
      name: 'design-team',
      description: 'Design discussions and feedback',
      memberCount: 12,
      isPrivate: false,
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Filter mock results based on query and active filter
      const filtered = mockResults.filter(item => {
        const matchesQuery = 
          item.content?.toLowerCase().includes(query.toLowerCase()) ||
          item.name?.toLowerCase().includes(query.toLowerCase()) ||
          item.author?.toLowerCase().includes(query.toLowerCase());
        
        const matchesFilter = activeFilter === 'all' || item.type === activeFilter.slice(0, -1);
        
        return matchesQuery && matchesFilter;
      });
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const renderSearchResult = ({ item }) => {
    switch (item.type) {
      case 'message':
        return (
          <TouchableOpacity onPress={() => {/* Navigate to message */}}>
            <Card style={styles.resultCard}>
              <Card.Content>
                <View style={styles.messageResult}>
                  <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
                  <View style={styles.messageContent}>
                    <Text variant="bodyMedium" numberOfLines={2}>
                      {item.content}
                    </Text>
                    <Text variant="bodySmall" style={styles.resultMeta}>
                      {item.author} in {item.channel} • {item.timestamp}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );

      case 'file':
        return (
          <TouchableOpacity onPress={() => {/* Navigate to file */}}>
            <Card style={styles.resultCard}>
              <Card.Content>
                <View style={styles.fileResult}>
                  <Ionicons name="document-outline" size={20} color={theme.colors.primary} />
                  <View style={styles.fileContent}>
                    <Text variant="titleSmall">{item.name}</Text>
                    <Text variant="bodySmall" style={styles.resultMeta}>
                      {item.author} in {item.channel} • {item.size} • {item.timestamp}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );

      case 'person':
        return (
          <TouchableOpacity onPress={() => {/* Navigate to profile */}}>
            <Card style={styles.resultCard}>
              <Card.Content>
                <View style={styles.personResult}>
                  <Avatar.Text
                    size={40}
                    label={item.name.split(' ').map(n => n[0]).join('')}
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <View style={styles.personContent}>
                    <Text variant="titleSmall">{item.name}</Text>
                    <Text variant="bodySmall" style={styles.resultMeta}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: item.status === 'online' ? '#28a745' : '#6c757d' }
                  ]} />
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );

      case 'channel':
        return (
          <TouchableOpacity onPress={() => {/* Navigate to channel */}}>
            <Card style={styles.resultCard}>
              <Card.Content>
                <View style={styles.channelResult}>
                  <Ionicons 
                    name={item.isPrivate ? "lock-closed-outline" : "hashtag"} 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                  <View style={styles.channelContent}>
                    <Text variant="titleSmall">#{item.name}</Text>
                    <Text variant="bodySmall" style={styles.resultMeta}>
                      {item.description} • {item.memberCount} members
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Search
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search messages, files, people..."
          onChangeText={handleSearch}
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
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text variant="titleMedium" style={styles.resultsTitle}>
            {searchResults.length} results for "{searchQuery}"
          </Text>
          <Divider style={styles.divider} />
        </View>
      )}

      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery.length > 2 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={theme.colors.placeholder} />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No results found
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Try different keywords or check your spelling
              </Text>
            </View>
          ) : searchQuery.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={theme.colors.placeholder} />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Search DevSync
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Find messages, files, people, and channels
              </Text>
            </View>
          ) : null
        }
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
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: theme.spacing.md,
  },
  searchbar: {
    elevation: 2,
    marginBottom: theme.spacing.md,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.sm,
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
  resultsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  resultsTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  divider: {
    marginBottom: theme.spacing.sm,
  },
  resultsList: {
    padding: theme.spacing.md,
  },
  resultCard: {
    marginBottom: theme.spacing.sm,
    elevation: 1,
  },
  messageResult: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  fileResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  personResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  channelResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  resultMeta: {
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    color: theme.colors.placeholder,
  },
  emptySubtitle: {
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
});