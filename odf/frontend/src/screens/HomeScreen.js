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
  Badge,
  FAB,
  Searchbar,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { workspaceService } from '../services/workspaceService';

export default function HomeScreen({ navigation }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [channels, setChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load user's workspaces and channels
      const workspacesData = await workspaceService.getUserWorkspaces();
      setWorkspaces(workspacesData);
      
      // Load channels from all workspaces
      const allChannels = [];
      for (const workspace of workspacesData) {
        const workspaceChannels = await workspaceService.getWorkspaceChannels(workspace.id);
        allChannels.push(...workspaceChannels.map(channel => ({
          ...channel,
          workspaceName: workspace.name,
        })));
      }
      setChannels(allChannels);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkspace = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Workspace', { workspace: item })}
    >
      <Card style={styles.workspaceCard}>
        <Card.Content style={styles.workspaceContent}>
          <Avatar.Text
            size={50}
            label={item.name.charAt(0).toUpperCase()}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.workspaceInfo}>
            <Text variant="titleMedium" style={styles.workspaceName}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.workspaceDescription}>
              {item.description || 'No description'}
            </Text>
            <Text variant="bodySmall" style={styles.memberCount}>
              {item.memberCount || 0} members
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.colors.placeholder} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderChannel = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Channel', { channel: item })}
    >
      <Card style={styles.channelCard}>
        <Card.Content style={styles.channelContent}>
          <View style={styles.channelIcon}>
            <Ionicons
              name={item.type === 'PRIVATE' ? 'lock-closed' : 'hashtag'}
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.channelInfo}>
            <Text variant="titleSmall" style={styles.channelName}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.channelWorkspace}>
              {item.workspaceName}
            </Text>
            {item.lastMessage && (
              <Text variant="bodySmall" style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            )}
          </View>
          {item.unreadCount > 0 && (
            <Badge style={styles.unreadBadge}>{item.unreadCount}</Badge>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.workspaceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          DevSync
        </Text>
      </View>

      <Searchbar
        placeholder="Search channels and workspaces"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={[]}
        ListHeaderComponent={
          <View>
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Your Workspaces
              </Text>
              <FlatList
                data={workspaces}
                renderItem={renderWorkspace}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recent Channels
              </Text>
              <FlatList
                data={filteredChannels}
                renderItem={renderChannel}
                keyExtractor={(item) => `${item.id}-${item.workspaceName}`}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Navigate to create workspace/channel screen
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
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchbar: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  workspaceCard: {
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  workspaceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workspaceInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  workspaceName: {
    fontWeight: 'bold',
  },
  workspaceDescription: {
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  memberCount: {
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  channelCard: {
    marginBottom: theme.spacing.sm,
    elevation: 1,
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
  channelName: {
    fontWeight: 'bold',
  },
  channelWorkspace: {
    color: theme.colors.placeholder,
    fontSize: 12,
  },
  lastMessage: {
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: theme.colors.notification,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});